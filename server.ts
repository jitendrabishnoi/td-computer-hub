import express from "express";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import { chaptersList, getPrewrittenChapter } from "./src/chapters/index";
import { getEnrichedManual } from "./src/chapters/manual_enrichment";

dotenv.config();

// Ensure the chapters data folder exists in the project
const GENERATED_DIR = path.join(process.cwd(), "src", "chapters", "generated");
if (!fs.existsSync(GENERATED_DIR)) {
  fs.mkdirSync(GENERATED_DIR, { recursive: true });
}

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Initialize GoogleGenAI server-side with standard key
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// Helper function to call an API with retries and exponential backoff
async function callWithRetry<T>(
  fn: () => Promise<T>,
  retries: number = 4,
  delay: number = 2000,
  factor: number = 1.8
): Promise<T> {
  try {
    return await fn();
  } catch (error: any) {
    const isTransient = 
      !error.status || 
      error.status === 503 || 
      error.status === 429 || 
      error.status === 500 || 
      (error.message && (
        error.message.includes("503") || 
        error.message.includes("UNAVAILABLE") || 
        error.message.includes("high demand") || 
        error.message.includes("rate limit") || 
        error.message.includes("timeout") ||
        error.message.includes("service is currently unavailable")
      ));

    if (retries > 0 && isTransient) {
      console.log(`[Model SDK] Temporary state detected. Retrying in ${delay}ms... (${retries} attempts remaining)`);
      await new Promise((resolve) => setTimeout(resolve, delay));
      return callWithRetry(fn, retries - 1, delay * factor, factor);
    }
    throw error;
  }
}

// Robust fallback and retry logic for textbook chapter generation
async function generateChapterWithFallback(
  aiInstance: GoogleGenAI,
  prompt: string,
  responseSchema: any
): Promise<any> {
  const modelsToTry = [
    "gemini-3.5-flash",
    "gemini-3.1-pro-preview",
    "gemini-3.1-flash-lite",
    "gemini-flash-latest"
  ];
  let lastError: any = null;

  for (const model of modelsToTry) {
    try {
      console.log(`Attempting textbook generation with model: ${model}`);
      const response = await callWithRetry(async () => {
        return await aiInstance.models.generateContent({
          model: model,
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            responseSchema: responseSchema,
          },
        });
      }, 1, 1000, 1.5);
      
      return response;
    } catch (err: any) {
      console.log(`Model ${model} was unavailable, trying next fallback...`);
      lastError = err;
    }
  }

  throw lastError || new Error("All model generation attempts failed.");
}

// Robust fallback and retry logic for AI tutor chat conversations
async function chatWithFallback(
  aiInstance: GoogleGenAI,
  history: any[],
  systemInstruction: string,
  lastMessage: string
): Promise<any> {
  const modelsToTry = [
    "gemini-3.5-flash",
    "gemini-3.1-pro-preview",
    "gemini-3.1-flash-lite",
    "gemini-flash-latest"
  ];
  let lastError: any = null;

  for (const model of modelsToTry) {
    try {
      console.log(`Attempting tutor chat with model: ${model}`);
      const response = await callWithRetry(async () => {
        const chat = aiInstance.chats.create({
          model: model,
          history: history,
          config: {
            systemInstruction: systemInstruction,
          },
        });
        return await chat.sendMessage({ message: lastMessage });
      }, 1, 1000, 1.5);
      
      return response;
    } catch (err: any) {
      console.log(`Model ${model} chat was unavailable, trying next fallback...`);
      lastError = err;
    }
  }

  throw lastError || new Error("All chat attempts failed.");
}

function enrichChapter(chapterNumber: number, data: any): any {
  // 1. Ensure semesterQuestions has short and long lists
  if (!data.semesterQuestions) {
    data.semesterQuestions = { short: [], long: [] };
  }

  // 2. Populate veryShort questions
  if (!data.semesterQuestions.veryShort || data.semesterQuestions.veryShort.length === 0) {
    switch (chapterNumber) {
      case 1:
        data.semesterQuestions.veryShort = [
          "कंप्यूटर को परिभाषित कीजिए।",
          "ALU का पूरा नाम क्या है?",
          "GIGO सिद्धांत क्या है?",
          "रैम (RAM) और रोम (ROM) में मुख्य अंतर लिखिए।"
        ];
        break;
      case 2:
        data.semesterQuestions.veryShort = [
          "इनपुट उपकरण क्या हैं?",
          "OMR का पूरा नाम क्या है?",
          "MICR का क्या उपयोग है?",
          "स्कैनर का मुख्य कार्य बताइए।"
        ];
        break;
      case 3:
        data.semesterQuestions.veryShort = [
          "मॉनिटर के रिज़ॉल्यूशन से आप क्या समझते हैं?",
          "CRT का पूरा नाम क्या है?",
          "इम्पैक्ट प्रिंटर क्या है?",
          "प्लॉटर का उपयोग कहाँ होता है?"
        ];
        break;
      case 4:
        data.semesterQuestions.veryShort = [
          "ALU का क्या कार्य है?",
          "रजिस्टर क्या होते हैं?",
          "नियंत्रण इकाई (Control Unit) को कंप्यूटर का ट्रैफिक पुलिस क्यों कहा जाता है?",
          "क्लॉक स्पीड क्या है?"
        ];
        break;
      case 5:
        data.semesterQuestions.veryShort = [
          "SRAM और DRAM में क्या अंतर है?",
          "EPROM का पूरा नाम क्या है?",
          "कैश मेमोरी क्या है?",
          "वर्चुअल मेमोरी की आवश्यकता क्यों होती है?"
        ];
        break;
      case 6:
        data.semesterQuestions.veryShort = [
          "HDD और SSD में मुख्य अंतर क्या है?",
          "ब्लू-रे डिस्क की क्षमता क्या होती है?",
          "क्लाउड स्टोरेज के दो उदाहरण दीजिए?",
          "पेन ड्राइव किस प्रकार की मेमोरी है?"
        ];
        break;
      case 7:
        data.semesterQuestions.veryShort = [
          "ऑपरेटिंग सिस्टम को परिभाषित कीजिए।",
          "बूटिंग प्रक्रिया क्या है?",
          "GUI और CLI में मुख्य अंतर क्या है?",
          "दो ओपन-सोर्स ऑपरेटिंग सिस्टम के नाम लिखिए।"
        ];
        break;
      case 8:
        data.semesterQuestions.veryShort = [
          "एमएस वर्ड में मेल मर्ज क्या है?",
          "हेडर और फुटर का क्या उपयोग है?",
          "पेज ओरिएंटेशन क्या होता है?",
          "क्लिपआर्ट क्या है?"
        ];
        break;
      case 9:
        data.semesterQuestions.veryShort = [
          "सेल एड्रेस क्या होता है?",
          "वर्कशीट और वर्कबुक में क्या अंतर है?",
          "SUM और AVERAGE फ़ंक्शन का प्रारूप लिखिए।",
          "रिलेटिव और एब्सोल्यूट सेल रेफरेंस क्या है?"
        ];
        break;
      case 10:
        data.semesterQuestions.veryShort = [
          "स्लाइड ट्रांजिशन और कस्टम एनीमेशन में क्या अंतर है?",
          "स्लाइड सॉर्टर व्यू क्या है?",
          "पावरपॉइंट में हैंडआउट्स क्या होते हैं?",
          "प्रेजेंटेशन का मुख्य उद्देश्य क्या है?"
        ];
        break;
      case 11:
        data.semesterQuestions.veryShort = [
          "WWW का पूरा नाम क्या है?",
          "HTTP और HTTPS में मुख्य अंतर क्या है?",
          "वेब ब्राउज़र और सर्च इंजन में क्या अंतर है?",
          "फायरवॉल क्या है?"
        ];
        break;
      case 12:
        data.semesterQuestions.veryShort = [
          "LAN, MAN और WAN का पूरा नाम लिखिए।",
          "नेटवर्क टोपोलॉजी क्या है?",
          "राउटर का मुख्य कार्य क्या है?",
          "OSI मॉडल में कितनी परतें (Layers) होती हैं?"
        ];
        break;
      case 13:
        data.semesterQuestions.veryShort = [
          "C भाषा का विकास किसने और कब किया?",
          "कंपाइलर और इंटरप्रेटर में मुख्य अंतर क्या है?",
          "कीवर्ड्स (Keywords) क्या होते हैं?",
          "printf() और scanf() का क्या कार्य है?"
        ];
        break;
      case 14:
        data.semesterQuestions.veryShort = [
          "इंक्रीमेंट (++) और डिक्रीमेंट (--) ऑपरेटर्स क्या हैं?",
          "स्विच केस स्टेटमेंट का क्या उपयोग है?",
          "लूप्स के तीन प्रकार कौन से हैं?",
          "ब्रेक और कंटिन्यू स्टेटमेंट्स में क्या अंतर है?"
        ];
        break;
      case 15:
        data.semesterQuestions.veryShort = [
          "एरे (Array) को परिभाषित कीजिए।",
          "एक-विमीय और द्वि-विमीय एरे में क्या अंतर है?",
          "लीनियर सर्च और बाइनरी सर्च में कौन सा तेज है?",
          "बबल सॉर्ट का मूल सिद्धांत क्या है?"
        ];
        break;
      case 16:
        data.semesterQuestions.veryShort = [
          "स्ट्रिंग (String) क्या है?",
          "C में स्ट्रिंग के अंत में कौन सा विशेष कैरेक्टर स्वतः जुड़ता है?",
          "strlen() और strcpy() का कार्य बताइए।",
          "gets() और puts() का उपयोग क्यों किया जाता है?"
        ];
        break;
      case 17:
        data.semesterQuestions.veryShort = [
          "फ़ंक्शन (Function) क्या है?",
          "उपयोगकर्ता-निर्धारित (User Defined) फ़ंक्शन से आप क्या समझते हैं?",
          "रिकर्शन (Recursion) क्या है?",
          "कॉल बाई वैल्यू और कॉल बाई रेफरेंस में क्या अंतर है?"
        ];
        break;
      case 18:
        data.semesterQuestions.veryShort = [
          "पॉइंटर (Pointer) क्या है?",
          "मेमोरी एड्रेस की अवधारणा स्पष्ट कीजिए।",
          "एड्रेस ऑफ (&) और वैल्यू एट एड्रेस (*) ऑपरेटर्स का क्या कार्य है?",
          "पॉइंटर टू पॉइंटर क्या होता है?"
        ];
        break;
      case 19:
        data.semesterQuestions.veryShort = [
          "स्ट्रक्चर (Structure) और यूनियन (Union) में क्या अंतर है?",
          "नेस्टेड स्ट्रक्चर से आप क्या समझते हैं?",
          "स्ट्रक्चर के सदस्यों को एक्सेस करने के लिए किस ऑपरेटर का उपयोग होता है?",
          "स्ट्रक्चर का एरे क्या है?"
        ];
        break;
      case 20:
        data.semesterQuestions.veryShort = [
          "फ़ाइल पॉइंटर क्या है?",
          "fopen() के विभिन्न मोड्स (r, w, a) क्या हैं?",
          "फाइल को बंद करना (fclose) क्यों आवश्यक है?",
          "टेक्स्ट फाइल और बाइनरी फाइल में क्या अंतर है?"
        ];
        break;
      default:
        data.semesterQuestions.veryShort = [
          "प्रश्न 1",
          "प्रश्न 2",
          "प्रश्न 3",
          "प्रश्न 4"
        ];
    }
  }

  // 3. Populate numerical questions
  if (!data.semesterQuestions.numerical || data.semesterQuestions.numerical.length === 0) {
    switch (chapterNumber) {
      case 1:
        data.semesterQuestions.numerical = [
          "बाइनरी संख्या (110111)2 को दशमलव (Decimal) में बदलिए।",
          "अष्टक संख्या (Octal) (75)8 को बाइनरी में बदलिए।",
          "हेक्साडेसिमल (A4B)16 को दशमलव में बदलिए।",
          "कंप्यूटर की स्टोरेज क्षमता (10 GB) को बाइट्स (Bytes) में परिकलित कीजिए।"
        ];
        break;
      case 2:
        data.semesterQuestions.numerical = [
          "कीबोर्ड की सामान्य कुंजियों (Keys) की संख्या परिकलित कीजिए और उनके श्रेणियों का प्रतिशत ज्ञात करें।",
          "OMR रीडर द्वारा 1200 प्रश्नों की शीट जांचने में लगा कुल समय ज्ञात करें यदि एक शीट में 0.4 सेकंड लगता है।",
          "एक बारकोड स्कैनर प्रति सेकंड 50 स्कैन करता है। 5 मिनट में यह कितने स्कैन करेगा?",
          "यदि एक बायोमेट्रिक फिंगरप्रिंट की इमेज 500 KB की है, तो 1000 छात्रों का डेटाबेस कुल कितने MB जगह लेगा?"
        ];
        break;
      case 3:
        data.semesterQuestions.numerical = [
          "एक 1920x1080 रिज़ॉल्यूशन वाले फुल एचडी मॉनिटर में कुल पिक्सल की संख्या ज्ञात कीजिए।",
          "एक प्रिंटर 35 PPM (Pages Per Minute) की गति से 1050 पेज कितने मिनट में प्रिंट करेगा?",
          "एक 4K रिज़ॉल्यूशन (3840x2160) वाले डिस्प्ले की तुलना में 1080p में कितने प्रतिशत कम पिक्सल होते हैं?",
          "एक प्लॉटर 50 सेमी/सेकंड की गति से 2 मीटर लंबी लाइन खींचने में कितना समय लेगा?"
        ];
        break;
      case 4:
        data.semesterQuestions.numerical = [
          "एक CPU की क्लॉक स्पीड 3.4 GHz है, यह प्रति सेकंड कितने क्लॉक साइकिल निष्पादित करेगा?",
          "32-बिट और 64-बिट आर्किटेक्चर में अधिकतम मेमोरी एड्रेसिंग सीमा (RAM limit) की तुलना कीजिए।",
          "एक प्रोसेसर में L1 कैश 64 KB, L2 कैश 512 KB और L3 कैश 8 MB है। कुल कैश मेमोरी बाइट्स में ज्ञात कीजिए।",
          "यदि एक सीपीयू को एक निर्देश पूरा करने में 4 क्लॉक साइकिल लगते हैं, तो 3.0 GHz की गति पर यह प्रति सेकंड कितने निर्देश पूरे करेगा?"
        ];
        break;
      case 5:
        data.semesterQuestions.numerical = [
          "8 GB RAM को बाइट्स (Bytes) और किलोबाइट्स (KB) में परिवर्तित कीजिए।",
          "एक कंप्यूटर में 4 MB की कैश मेमोरी है, इसे किलोबाइट्स (KB) और बाइट्स में परिकलित कीजिए।",
          "यदि रैम की एक्सेस स्पीड 10 नैनोसेकंड (ns) है और कैश की 2 ns है, तो कैश मेमोरी रैम से कितनी गुना तेज है?",
          "16-बिट एड्रेस बस वाले माइक्रोप्रोसेसर द्वारा सीधे एड्रेस की जा सकने वाली अधिकतम मेमोरी क्षमता (KB में) ज्ञात कीजिए।"
        ];
        break;
      case 6:
        data.semesterQuestions.numerical = [
          "2 TB क्षमता वाली हार्ड डिस्क में कुल कितने GB और MB होते हैं?",
          "700 MB की कितनी CD की आवश्यकता होगी ताकि एक 4.7 GB की DVD का पूरा डेटा बैकअप लिया जा सके?",
          "एक SSD की रीड स्पीड 550 MB/s है और HDD की 110 MB/s है। SSD की गति HDD से कितनी गुना अधिक है?",
          "एक 64 GB के पेन ड्राइव में 4.3 GB साइज की कितनी HD वीडियो फाइलें स्टोर की जा सकती हैं?"
        ];
        break;
      case 7:
        data.semesterQuestions.numerical = [
          "FAT32 फ़ाइल सिस्टम में अधिकतम फ़ाइल आकार सीमा (4 GB) को बाइट्स में परिकलित कीजिए।",
          "एक 64-बिट ऑपरेटिंग सिस्टम अधिकतम कितनी रैम को सीधे एड्रेस कर सकता है? (सैद्धांतिक सीमा परिकलित करें)",
          "यदि कंप्यूटर को कोल्ड बूट होने में 45 सेकंड और रीबूट होने में 30 सेकंड लगते हैं, तो दोनों प्रक्रियाओं के समय का अनुपात ज्ञात कीजिए।",
          "एक सर्वर ओएस प्रति सेकंड 50000 फाइल्स को इंडेक्स करता है। 1 घंटे में यह कुल कितनी फाइल्स इंडेक्स करेगा?"
        ];
        break;
      case 8:
        data.semesterQuestions.numerical = [
          "एक वर्ड डॉक्यूमेंट में 1.5 लाइन स्पेसिंग के साथ 45 लाइनें हैं, कुल वर्टिकल स्पेसिंग ज्ञात कीजिए।",
          "A4 पेज का मानक आकार 8.27 x 11.69 इंच है। इसका क्षेत्रफल वर्ग इंच में ज्ञात कीजिए।",
          "यदि एक डॉक्यूमेंट में 12000 शब्द हैं और एक सामान्य छात्र प्रति मिनट 150 शब्द पढ़ता है, तो पूरा डॉक्यूमेंट पढ़ने में लगा समय ज्ञात करें।",
          "एक मेल मर्ज प्रक्रिया द्वारा 150 छात्रों को व्यक्तिगत पत्र भेजने में यदि प्रति पत्र 0.2 सेकंड का समय लगता है, तो कुल समय ज्ञात कीजिए।"
        ];
        break;
      case 9:
        data.semesterQuestions.numerical = [
          "यदि सेल A1=15, A2=25, A3=35, तो सूत्र =SUM(A1:A3) और =AVERAGE(A1:A3) का मान क्या होगा?",
          "एक्सेल शीट में कुल पंक्तियों (Rows) की संख्या 1048576 और कॉलमों की संख्या 16384 है। कुल सेल्स की संख्या घात (Exponent) के रूप में लिखिए।",
          "यदि सेल B1 में सूत्र =A1*2 लिखा है। जब इसे B2 में कॉपी किया जाएगा तो B2 का सूत्र क्या बन जाएगा? (रिलेटिव रेफरेंस के आधार पर)",
          "एक डेटाबेस में 500 कर्मचारियों का वेतन दिया है। =COUNTIF(C1:C500, \">50000\") का क्या परिणाम होगा यदि 120 कर्मचारियों का वेतन 50000 से अधिक है?"
        ];
        break;
      case 10:
        data.semesterQuestions.numerical = [
          "एक 25 स्लाइड वाली प्रेजेंटेशन को 15 मिनट में पूरा करने के लिए प्रति स्लाइड औसत समय सेकंड में परिकलित कीजिए।",
          "स्लाइड शो में 4:3 एस्पेक्ट रेशियो को 16:9 में बदलने पर स्क्रीन चौड़ाई प्रतिशत में होने वाली वृद्धि ज्ञात करें।",
          "यदि प्रत्येक स्लाइड में औसतन 50 शब्द हैं और कुल 12 स्लाइड्स हैं, तो पूरी प्रेजेंटेशन को 120 शब्द प्रति मिनट की गति से पढ़ने में कितना समय लगेगा?",
          "एक एनीमेशन का प्रभाव 1.5 सेकंड का है और स्लाइड ट्रांजिशन का समय 2.0 सेकंड है। 10 स्लाइड्स के शो में कुल एनीमेशन समय कितना होगा यदि प्रत्येक स्लाइड पर 1 एनीमेशन है?"
        ];
        break;
      case 11:
        data.semesterQuestions.numerical = [
          "एक 100 Mbps इंटरनेट कनेक्शन पर 600 MB की फाइल डाउनलोड करने में लगने वाला न्यूनतम समय सेकंड में ज्ञात कीजिए।",
          "IPv4 एड्रेस 32 बिट्स का होता है और IPv6 एड्रेस 128 बिट्स का। IPv6 एड्रेस IPv4 से कितने गुना बड़ा है और कुल कितने प्रतिशत अधिक बिट्स का है?",
          "एक वेब सर्वर प्रति मिनट 24000 हिट्स (अनुरोध) प्राप्त करता है। इसकी प्रति सेकंड हिट दर (Rate) परिकलित कीजिए।",
          "यदि एक वेबसाइट पेज का साइज 2.5 MB है और इंटरनेट की स्पीड 2 Mbps है, तो पेज लोड होने में लगने वाला समय ज्ञात कीजिए।"
        ];
        break;
      case 12:
        data.semesterQuestions.numerical = [
          "एक स्टार टोपोलॉजी नेटवर्क में 12 कंप्यूटर हैं, इसमें आवश्यक केबलों की संख्या ज्ञात कीजिए। मेष टोपोलॉजी में कितनी होगी?",
          "क्लास C IP एड्रेस में सबनेट मास्क 255.255.255.0 होता है। इस नेटवर्क में अधिकतम कितने होस्ट कंप्यूटर जोड़े जा सकते हैं?",
          "एक मेष टोपोलॉजी (Full Mesh) नेटवर्क में यदि कुल नोड्स (Nodes) की संख्या 8 है, तो कुल आवश्यक लिंकों (Links) की संख्या का सूत्र n(n-1)/2 द्वारा मान ज्ञात कीजिए।",
          "एक डेटा पैकेट को 1000 किमी दूरी तय करने में 5 मिलीसेकंड का समय लगता है। नेटवर्क लेटेंसी प्रति किमी माइक्रोसेकंड में ज्ञात कीजिए।"
        ];
        break;
      case 13:
        data.semesterQuestions.numerical = [
          "C भाषा में int, float, double and char डेटा प्रकारों का आकार (Bytes में) बताइए और उनका योग ज्ञात कीजिए।",
          "यदि int x = 7; y = 3; तो x / y, x % y और (float)x / y का परिणाम क्रमशः ज्ञात कीजिए।",
          "इंटीजर चर `int val = 32767;` में 1 जोड़ने पर ओवरफ्लो होने के बाद नया मान क्या प्राप्त होगा? (16-बिट इंटीजर मानकर)",
          "यदि `char ch = 'A';` हो, तो `ch + 3` करने पर प्राप्त कैरेक्टर और उसका ASCII मान क्या होगा?"
        ];
        break;
      case 14:
        data.semesterQuestions.numerical = [
          "यदि int a = 6; b = a++ + ++a; तो a और b का अंतिम मान ज्ञात कीजिए।",
          "निम्नलिखित लूप कितनी बार चलेगा और अंतिम आउटपुट क्या होगा:\n`for(int i=1; i<=15; i+=3) printf(\"%d \", i);`",
          "यदि `int x = 10, y = 20;` हो, तो कंडीशनल ऑपरेटर `(x > y) ? x : y` का मान क्या होगा?",
          "निम्नलिखित व्हाइल लूप में प्रिंट होने वाले नंबरों की संख्या ज्ञात कीजिए:\n`int i = 5; while(i > 0) { printf(\"%d \", i--); }`"
        ];
        break;
      case 15:
        data.semesterQuestions.numerical = [
          "int arr[15]; एरे मेमोरी में कुल कितने बाइट्स घेरेगा यदि एक इंटीजर 4 बाइट्स का है?",
          "यदि arr[] = {10, 20, 30, 40, 50} हो, तो `*(arr + 2)` और `arr[4]` का मान क्या होगा?",
          "एक 3x4 साइज का 2D इंटीजर एरे `int matrix[3][4]` मेमोरी में कुल कितना स्थान (Bytes) घेरेगा?",
          "10 तत्वों के एक अव्यवस्थित एरे पर बाइनरी सर्च लगाने के लिए आवश्यक अधिकतम तुलनाओं की संख्या ज्ञात कीजिए।"
        ];
        break;
      case 16:
        data.semesterQuestions.numerical = [
          "char name[] = \"BCA First Year\"; इस स्ट्रिंग का मेमोरी साइज (Size) और लंबाई (Length) कितनी होगी?",
          "यदि strcmp(\"hello\", \"world\") किया जाए, तो रिटर्न वैल्यू का प्रकार (धनात्मक/ऋणात्मक) क्या होगा?",
          "यदि `char s1[20] = \"Hello\";` और `char s2[] = \"World\";` हो, तो `strcat(s1, s2)` करने के बाद `s1` का साइज और लंबाई क्या होगी?",
          "यदि एक स्ट्रिंग में 80 कैरेक्टर्स हैं, तो इसे सुरक्षित रूप से स्टोर करने के लिए कैरेक्टर एरे का न्यूनतम घोषित आकार क्या होना चाहिए?"
        ];
        break;
      case 17:
        data.semesterQuestions.numerical = [
          "एक रिकर्सिव फ़ंक्शन `factorial(5)` कितनी बार स्वयं को रिकर्सिव रूप से कॉल करेगा (बेस केस को छोड़कर)?",
          "यदि एक फ़ंक्शन `void swap(int *x, int *y)` है, और `a = 5, b = 10` के साथ `swap(&a, &b)` कॉल किया जाए, तो कॉल के बाद `a` और `b` के मान क्रमशः क्या होंगे?",
          "निम्नलिखित फ़ंक्शन का आउटपुट क्या होगा यदि `calc(5)` कॉल किया जाए:\n`int calc(int n) { if(n <= 1) return 1; else return n + calc(n-1); }`",
          "एक प्रोग्राम में 3 उपयोगकर्ता-निर्धारित फंक्शन्स हैं। यदि मुख्य फ़ंक्शन `main()` प्रत्येक फ़ंक्शन को 2 बार कॉल करता है, तो कुल फ़ंक्शन निष्पादन की संख्या ज्ञात कीजिए।"
        ];
        break;
      case 18:
        data.semesterQuestions.numerical = [
          "यदि `int a = 25; *p = &a; **q = &p;` तो `a`, `*p` और `**q` का मान क्या होगा?",
          "यदि `p` एक इंटीजर पॉइंटर है जिसका मान 2000 है, तो `p + 2` करने पर प्राप्त नया एड्रेस क्या होगा? (4-बाइट इंटीजर मानकर)",
          "यदि `char *ptr = \"Computer\";` हो, तो `*(ptr + 4)` का मान क्या होगा?",
          "यदि `float arr[5] = {1.5, 2.5, 3.5, 4.5, 5.5}; *ptr = arr;` हो, तो `*(ptr + 3)` का मान ज्ञात कीजिए।"
        ];
        break;
      case 19:
        data.semesterQuestions.numerical = [
          "struct Student { char name[30]; int roll; float percentage; }; यह स्ट्रक्चर मेमोरी में कुल कितने बाइट्स घेरेगा?",
          "यदि एक स्ट्रक्चर में `char ch;` and `int x;` हैं, और संघ (Union) में भी वही सदस्य हैं। दोनों के मेमोरी आकारों का अनुपात ज्ञात कीजिए।",
          "एक एरे `struct Book shelf[100];` घोषित है। यदि प्रत्येक `Book` स्ट्रक्चर का साइज 60 बाइट्स है, तो कुल शेल्फ मेमोरी क्षमता ज्ञात कीजिए।",
          "यदि एक यूनियन `union Data { int i; float f; char str[20]; };` घोषित है, तो इसका अंतिम आकार बाइट्स में क्या होगा?"
        ];
        break;
      case 20:
        data.semesterQuestions.numerical = [
          "यदि एक फाइल में 250 कैरेक्टर्स हैं और हम उसे fgets() की मदद से प्रति बार 50 कैरेक्टर्स पढ़ते हैं, तो पूरी फाइल पढ़ने के लिए लूप कितनी बार चलेगा?",
          "fseek(fp, 10, SEEK_SET); ftell(fp); यह कोड ब्लॉक फ़ाइल पॉइंटर को कहाँ स्थापित करेगा और स्थिति संख्या क्या होगी?",
          "यदि `fprintf(fp, \"BCA %d\", 2026);` द्वारा फाइल में डेटा लिखा जाता है, तो कुल कितने बाइट्स फाइल में लिखे गए?",
          "fseek(fp, -5, SEEK_END); ftell(fp); यदि फ़ाइल का कुल आकार 100 बाइट्स है, तो इस स्थिति पर फ़ाइल पॉइंटर का मान ज्ञात कीजिए।"
        ];
        break;
      default:
        data.semesterQuestions.numerical = [
          "तार्किक प्रश्न 1",
          "तार्किक प्रश्न 2"
        ];
    }
  }

  // 4. Populate shortcut keys
  if (!data.shortcutKeys || data.shortcutKeys.length === 0) {
    switch (chapterNumber) {
      case 1:
        data.shortcutKeys = [
          { key: "Win + D", action: "डेस्कटॉप दिखाएं/छिपाएं (Show/Hide Desktop)", description: "सभी खुली विंडोज़ को तुरंत मिनिमाइज़ करने के लिए।" },
          { key: "Win + E", action: "फाइल एक्सप्लोरर खोलें (Open File Explorer)", description: "कंप्यूटर की स्टोरेज ड्राइव्स और फाइलों को देखने के लिए।" },
          { key: "Alt + Tab", action: "अॅप्स स्विच करें (Switch Apps)", description: "एक सक्रिय अॅप्लिकेशन से दूसरे अॅप्लिकेशन पर जाने के लिए।" },
          { key: "Ctrl + Shift + Esc", action: "टास्क मैनेजर खोलें (Open Task Manager)", description: "चल रहे सिस्टम प्रोसेस और रैम यूसेज देखने के लिए।" },
          { key: "Win + Pause/Break", action: "सिस्टम प्रॉपर्टीज (System Properties)", description: "कंप्यूटर का प्रोसेसर, रैम और विंडोज वर्जन देखने के लिए।" }
        ];
        break;
      case 2:
        data.shortcutKeys = [
          { key: "Ctrl + C", action: "कॉपी (Copy)", description: "चयनित टेक्स्ट या फ़ाइल की प्रतिलिपि बनाने के लिए।" },
          { key: "Ctrl + V", action: "पेस्ट (Paste)", description: "कॉपी किए गए टेक्स्ट या फ़ाइल को रखने के लिए।" },
          { key: "Shift + Arrow Keys", action: "टेक्स्ट का चयन (Select Text)", description: "कीबोर्ड की मदद से टेक्स्ट को दिशा अनुसार चुनने के लिए।" },
          { key: "Double Click", action: "शब्द चयन (Select Word)", description: "माउस से किसी शब्द पर दो बार क्लिक करके उसे चुनने के लिए।" },
          { key: "Triple Click", action: "पैराग्राफ चयन (Select Paragraph)", description: "माउस से पूरे पैराग्राफ को एक बार में चुनने के लिए।" }
        ];
        break;
      case 3:
        data.shortcutKeys = [
          { key: "Win + P", action: "प्रोजेक्शन सेटिंग्स (Projector Settings)", description: "मल्टीपल मॉनिटर या प्रोजेक्टर स्क्रीन मोड सेट करने के लिए।" },
          { key: "Ctrl + P", action: "प्रिंट डायलॉग (Print Dialog Box)", description: "डॉक्यूमेंट को प्रिंट करने के लिए सेटिंग्स विंडो खोलने हेतु।" },
          { key: "Print Screen", action: "स्क्रीनशॉट लें (Take Screenshot)", description: "पूरी स्क्रीन की छवि को क्लिपबोर्ड पर सहेजने के लिए।" },
          { key: "Alt + Print Screen", action: "सक्रिय विंडो स्क्रीनशॉट", description: "केवल वर्तमान में खुली हुई एक्टिव विंडो का स्क्रीनशॉट लेने के लिए।" },
          { key: "F5", action: "रिफ्रेश (Refresh)", description: "डिस्प्ले स्क्रीन की मेमोरी और डेटा को दोबारा लोड करने के लिए।" }
        ];
        break;
      case 4:
        data.shortcutKeys = [
          { key: "Ctrl + Shift + Esc", action: "टास्क मैनेजर सीधे खोलें", description: "सीपीयू यूसेज और रनिंग थ्रेड्स को देखने और प्रबंधित करने के लिए।" },
          { key: "Win + R -> cmd -> wmic cpu get name", action: "सीपीयू का नाम जानना", description: "कमांड प्रॉम्प्ट द्वारा सीपीयू मॉडल जानने की शॉर्टकट कमांड।" },
          { key: "Win + X", action: "क्विक लिंक मेनू (Quick Link Menu)", description: "डिवाइस मैनेजर और सीपीयू सेटिंग्स पर सीधे जाने के लिए।" },
          { key: "Ctrl + Alt + Delete", action: "सिक्योरिटी ऑप्शंस मेनू", description: "सिस्टम को लॉक करने, यूजर बदलने या टास्क मैनेजर खोलने के लिए।" }
        ];
        break;
      case 5:
        data.shortcutKeys = [
          { key: "Win + R -> 'temp'", action: "अस्थायी फाइलें साफ करना", description: "रैम और कैशे मेमोरी को खाली करने के लिए टेम्परेरी फोल्डर खोलना।" },
          { key: "Win + R -> '%temp%'", action: "सिस्टम अस्थायी फाइलें", description: "छिपे हुए रैम कैशे और टेम्पररी फाइल्स को डिलीट करने के लिए।" },
          { key: "Ctrl + F5", action: "हार्ड रीलोड (Hard Reload)", description: "ब्राउज़र कैशे मेमोरी को बायपास कर पेज को पूरी तरह दोबारा लोड करना।" },
          { key: "Win + Tab", action: "टास्क व्यू (Task View)", description: "वर्चुअल डेस्कटॉप और रैम में चल रहे कार्यों को ग्रिड रूप में देखना।" }
        ];
        break;
      case 6:
        data.shortcutKeys = [
          { key: "Alt + Enter", action: "ड्राइव प्रॉपर्टीज देखना", description: "हार्ड डिस्क या पेन ड्राइव का खाली और भरा हुआ स्पेस देखने के लिए।" },
          { key: "Win + E -> Right Click Drive -> Format", action: "ड्राइव फॉर्मेट करना", description: "स्टोरेज डिवाइस को पूरी तरह साफ करने की शॉर्टकट विधि।" },
          { key: "Ctrl + Shift + N", action: "नया फोल्डर बनाना", description: "स्टोरेज ड्राइव के अंदर नया फोल्डर (Directory) बनाने के लिए।" },
          { key: "Shift + Delete", action: "स्थायी डिलीट", description: "फाइल को रीसायकल बिन में भेजे बिना स्टोरेज से हमेशा के लिए हटाने हेतु।" }
        ];
        break;
      case 7:
        data.shortcutKeys = [
          { key: "Win + I", action: "विंडोज सेटिंग्स खोलें", description: "ऑपरेटिंग सिस्टम की सेटिंग्स पैनल को खोलने के लिए।" },
          { key: "Win + R", action: "रन कमांड बॉक्स (Run Command Box)", description: "किसी भी प्रोग्राम या सिस्टम टूल को सीधे कमांड से चलाने के लिए।" },
          { key: "Win + L", action: "सिस्टम लॉक करें (Lock PC)", description: "बिना ऐप्स बंद किए ऑपरेटिंग सिस्टम यूजर सेशन को लॉक करने के लिए।" },
          { key: "Alt + F4", action: "विंडो बंद करें / शटडाउन", description: "खुली विंडो बंद करने या पीसी को शटडाउन करने के लिए।" }
        ];
        break;
      case 8:
        data.shortcutKeys = [
          { key: "Ctrl + N", action: "नया डॉक्यूमेंट (New Document)", description: "एक नया खाली एमएस वर्ड पेज खोलने के लिए।" },
          { key: "Ctrl + S", action: "डॉक्यूमेंट सेव करें (Save)", description: "वर्तमान डॉक्यूमेंट को कंप्यूटर स्टोरेज में सुरक्षित करने के लिए।" },
          { key: "Ctrl + B / I / U", action: "बोल्ड / इटैलिक / अंडरलाइन", description: "चयनित टेक्स्ट को गाढ़ा, तिरछा या रेखांकित करने के लिए।" },
          { key: "Ctrl + L / E / R / J", action: "टेक्स्ट एलाइनमेंट", description: "टेक्स्ट को लेफ्ट, सेंटर, Right, Justified एलाइन करने के लिए।" },
          { key: "Ctrl + H", action: "रिप्लेस (Replace)", description: "डॉक्यूमेंट में किसी शब्द को ढूंढकर उसे बदलने के लिए।" }
        ];
        break;
      case 9:
        data.shortcutKeys = [
          { key: "F2", action: "सेल एडिट (Edit Cell)", description: "चयनित एक्सेल सेल के अंदर फार्मूला या टेक्स्ट लिखने के लिए।" },
          { key: "Alt + =", action: "ऑटो-सम (AutoSum)", description: "चयनित कॉलम या रो की संख्याओं का स्वतः जोड़ करने के लिए।" },
          { key: "Ctrl + ;", action: "आज की तारीख दर्ज करें", description: "सेल में वर्तमान सिस्टम डेट (Current Date) दर्ज करने के लिए।" },
          { key: "Ctrl + Shift + $", action: "करेंसी फॉर्मेट अप्लाई करें", description: "संख्या को मुद्रा फॉर्मेट (Currency Format) में बदलने के लिए।" },
          { key: "Ctrl + Arrow Keys", action: "अंतिम सेल पर जाएं", description: "वर्कशीट की सीमा में सीधे अंतिम भरी हुई रो या कॉलम पर जाने के लिए।" }
        ];
        break;
      case 10:
        data.shortcutKeys = [
          { key: "F5", action: "स्लाइड शो शुरू करें", description: "पहली स्लाइड से प्रेजेंटेशन को फुल स्क्रीन मोड में चलाने के लिए।" },
          { key: "Shift + F5", action: "वर्तमान स्लाइड से शो", description: "चयनित स्लाइड से ही फुल स्क्रीन स्लाइड शो शुरू करने के लिए।" },
          { key: "Ctrl + M", action: "नई स्लाइड जोड़ें", description: "प्रेजेंटेशन के अंदर एक नया खाली स्लाइड पेज इन्सर्ट करने के लिए।" },
          { key: "Esc", action: "स्लाइड शो बंद करें", description: "फुल स्क्रीन प्रेजेंटेशन मोड से बाहर आने के लिए।" },
          { key: "B / W Keys (In Show)", action: "ब्लैक / व्हाइट स्क्रीन", description: "शो के दौरान स्क्रीन को पूरी तरह काली या सफेद करने के लिए।" }
        ];
        break;
      case 11:
        data.shortcutKeys = [
          { key: "Ctrl + T", action: "नया ब्राउज़र टैब खोलें", description: "इंटरनेट ब्राउज़र में नया खाली वेब पेज टैब खोलने के लिए।" },
          { key: "Ctrl + Shift + T", action: "बंद टैब दोबारा खोलें", description: "हाल ही में गलती से बंद हो गए वेब पेज टैब को पुनः जीवित करने के लिए।" },
          { key: "Ctrl + H", action: "वेब ब्राउज़िंग इतिहास (History)", description: "हाल ही में देखी गई सभी वेबसाइटों की सूची देखने के लिए।" },
          { key: "Ctrl + D", action: "बुकमार्क जोड़ें (Add Bookmark)", description: "पसंदीदा वेबसाइट को सहेजने के लिए ताकि भविष्य में सीधे खोला जा सके।" },
          { key: "Ctrl + Shift + N", action: "इन्कॉग्निटो मोड (Private)", description: "बिना ब्राउज़िंग हिस्ट्री रिकॉर्ड किए प्राइवेट सर्फिंग करने के लिए।" }
        ];
        break;
      case 12:
        data.shortcutKeys = [
          { key: "Win + R -> cmd -> ping google.com", action: "नेटवर्क कनेक्टिविटी टेस्ट", description: "इंटरनेट या सर्वर से कनेक्शन की जांच करने का मुख्य शॉर्टकट।" },
          { key: "Win + R -> cmd -> ipconfig", action: "आईपी एड्रेस देखना", description: "कंप्यूटर का लोकल नेटवर्क आईपी और सबनेट मास्क जानने के लिए।" },
          { key: "Win + R -> cmd -> tracert google.com", action: "नेटवर्क रूट ट्रैक करना", description: "डेटा पैकेट किन-किन नेटवर्क नोड्स से होकर जा रहा है, यह देखना।" },
          { key: "Win + R -> ncpa.cpl", action: "नेटवर्क कनेक्शंस विंडो", description: "लैन, वाईफाई और ब्लूटूथ नेटवर्क एडेप्टर सेटिंग्स को सीधे खोलना।" }
        ];
        break;
      case 13:
        data.shortcutKeys = [
          { key: "Alt + F9", action: "प्रोग्राम कंपाइल करें", description: "C प्रोग्राम के कोड में सिंटैक्स एरर की जांच करने के लिए।" },
          { key: "Ctrl + F9", action: "प्रोग्राम रन करें", description: "C कोड को कंपाइल करके उसका निष्पादन आउटपुट स्क्रीन पर देखने के लिए।" },
          { key: "Alt + F5", action: "यूजर स्क्रीन देखें", description: "प्रोग्राम के पिछले रन का कंसोल आउटपुट दोबारा देखने के लिए।" },
          { key: "F2", action: "फाइल सेव करें (Save File)", description: "IDE के अंदर वर्तमान C कोड फाइल को सहेजने के लिए।" },
          { key: "F3", action: "फाइल खोलें (Open File)", description: "पहले से सहेजी गई C कोड फाइल को दोबारा एडिटर में खोलने के लिए।" }
        ];
        break;
      case 14:
        data.shortcutKeys = [
          { key: "F7 / F8", action: "स्टेप-बाय-स्टेप डिबग", description: "C प्रोग्राम की एक-एक लाइन को निष्पादित करके वैल्यू बदलते हुए देखना।" },
          { key: "Ctrl + F2", action: "डिबग रिसेट करना", description: "सक्रिय डिबगिंग सेशन को बीच में ही रोककर सामान्य एडिटर मोड में लौटना।" },
          { key: "Ctrl + F8", action: "टॉगल ब्रेकपॉइंट", description: "कोड की किसी विशिष्ट लाइन पर प्रोग्राम को डिबग करते समय रोकने का पॉइंट बनाना।" },
          { key: "F9", action: "प्रोजेक्ट मेक / बिल्ड", description: "पूरे कोडिंग प्रोजेक्ट की सभी फाइलों को एक साथ कंपाइल करना।" }
        ];
        break;
      case 15:
        data.shortcutKeys = [
          { key: "Ctrl + C on array item", action: "एरे एलिमेंट कॉपी", description: "कोड एडिटर में एरे इनिशियलाइज़ेशन डेटा को कॉपी करना।" },
          { key: "Ctrl + Shift + Space", action: "फंक्शन आर्गुमेंट संकेत", description: "एरे पास करते समय फंक्शन पैरामीटर्स के प्रकार और नियम देखना।" },
          { key: "F4 (In Turbo C)", action: "कर्सर तक प्रोग्राम चलाना", description: "एरे प्रोसेसिंग लूप के कर्सर वाली लाइन तक सीधे कोड रन करना।" }
        ];
        break;
      case 16:
        data.shortcutKeys = [
          { key: "Ctrl + F", action: "कोड में खोजें (Find)", description: "C कोड के अंदर किसी विशिष्ट स्ट्रिंग या वेरिएबल को ढूंढने के लिए।" },
          { key: "Ctrl + R", action: "रिप्लेस करें (Replace)", description: "कोड में किसी वेरिएबल या स्ट्रिंग का नाम एक साथ हर जगह बदलने के लिए।" },
          { key: "Alt + Enter on string.h", action: "हेडर फाइल हेल्प", description: "string.h लाइब्रेरी के सभी फंक्शन्स की सूची और विवरण देखने के लिए।" }
        ];
        break;
      case 17:
        data.shortcutKeys = [
          { key: "F12 / Ctrl + Click", action: "फंक्शन डेफिनिशन पर जाएं", description: "कॉलिंग स्टेटमेंट से सीधे फंक्शन की मूल कोडिंग डेफिनिशन पर कूदना।" },
          { key: "Alt + Backspace", action: "वापस लौटें (Undo)", description: "फंक्शन डेफिनिशन देखने के बाद वापस कॉलिंग कोड लाइन पर लौटने के लिए।" },
          { key: "Ctrl + Space", action: "कोड ऑटो-कम्प्लीट", description: "उपयोगकर्ता-निर्धारित फंक्शन्स के नाम टाइप करते समय स्वतः पूरा करना।" }
        ];
        break;
      case 18:
        data.shortcutKeys = [
          { key: "Ctrl + F7 -> Watch", action: "वेरिएबल वॉच窗口", description: "डिबग करते समय पॉइंटर एड्रेस और उसके अंदर की वैल्यू की लाइव निगरानी।" },
          { key: "Alt + F7", action: "सक्रिय पॉइंटर संदर्भ खोजना", description: "पूरे कोडिंग प्रोजेक्ट में पॉइंटर वेरिएबल कहाँ-कहाँ उपयोग हुआ है, यह देखना।" }
        ];
        break;
      case 19:
        data.shortcutKeys = [
          { key: "Ctrl + Space after '.'", action: "स्ट्रक्चर मेंबर्स ऑटोकम्प्लीट", description: "स्ट्रक्चर वेरिएबल के बाद डॉट ऑपरेटर दबाने पर उसके सदस्यों को देखना।" },
          { key: "Ctrl + Shift + U", action: "अपरकेस में बदलना", description: "स्ट्रक्चर और यूनियन के कीवर्ड्स को मानक रूप से कैपिटल करने के लिए।" }
        ];
        break;
      case 20:
        data.shortcutKeys = [
          { key: "Ctrl + Shift + C", action: "फाइल पाथ कॉपी", description: "फाइल ओपन करने के लिए fopen() में डालने हेतु फाइल पाथ कॉपी करना।" },
          { key: "Alt + F10", action: "लोकल डायरेक्टरी व्यू", description: "प्रोग्राम फाइल जहाँ सेव है, उस डायरेक्टरी में बन रही टेक्स्ट फाइलों को देखना।" }
        ];
        break;
      default:
        data.shortcutKeys = [
          { key: "Ctrl + S", action: "सुरक्षित करें (Save)" }
        ];
    }
  }

  // 4. Enrich programming examples with the 20-point practical manual
  if (data.programmingExamples && Array.isArray(data.programmingExamples)) {
    data.programmingExamples = data.programmingExamples.map((ex: any) => {
      const enriched = getEnrichedManual(chapterNumber, ex.title || "", ex.code || "", ex.output || "");
      return {
        ...ex,
        ...enriched
      };
    });
  }

  return data;
}

// ----------------- API ENDPOINTS -----------------

// 1. Get List of Chapters
app.get("/api/chapters", (req, res) => {
  res.json(chaptersList);
});

// 2. Get Chapter Detail (Prewritten or Dynamically Generated)
app.get("/api/chapters/:number", async (req, res) => {
  const chapterNumber = parseInt(req.params.number, 10);
  
  if (isNaN(chapterNumber) || chapterNumber < 1 || chapterNumber > 20) {
    return res.status(400).json({ error: "Invalid chapter number. Must be between 1 and 20." });
  }

  // Check if we have prewritten Chapter 1
  const prewritten = getPrewrittenChapter(chapterNumber);
  if (prewritten) {
    return res.json(enrichChapter(chapterNumber, prewritten));
  }

  // Check if we already have a generated version saved on disk
  const cachePath = path.join(GENERATED_DIR, `chapter_${chapterNumber}.json`);
  if (fs.existsSync(cachePath)) {
    try {
      const data = JSON.parse(fs.readFileSync(cachePath, "utf-8"));
      return res.json(enrichChapter(chapterNumber, data));
    } catch (e) {
      console.error("Error reading cached chapter file", e);
    }
  }

  // If no cache, generate dynamically using Gemini!
  if (!ai) {
    return res.status(500).json({
      error: "Gemini API Key is not configured. Please add GEMINI_API_KEY in Settings > Secrets.",
    });
  }

  const meta = chaptersList.find((c) => c.number === chapterNumber);
  if (!meta) {
    return res.status(404).json({ error: "Chapter metadata not found." });
  }

  try {
    console.log(`Generating Chapter ${chapterNumber}: ${meta.title} via Gemini...`);
    
    // Detailed prompt instructing Gemini on how to write the textbook chapter
    const prompt = `
You are an expert Computer Science Professor and Professional Textbook Writer with 25+ years of teaching experience.
Write a COMPLETE PROFESSIONAL TEXTBOOK CHAPTER in HINDI for BCA First Year students.
Title: Chapter ${chapterNumber}: ${meta.title} (${meta.englishTitle})
Syllabus topics to cover: ${meta.topics.join(", ")}

The response MUST follow the Chapter JSON structure exactly as specified by the schema.
Language Instructions:
• Write the entire content in 100% Hindi (Devanagari Script).
• Use simple, easy-to-understand Hindi suitable for BCA First Year students.
• Use English terms only for technical concepts, putting the English term in brackets after the Hindi. Example: "केंद्रीय प्रक्रमण इकाई (Central Processing Unit - CPU)" or "ऑपरेटिंग सिस्टम (Operating System)".
• Explain every topic deeply in detail. Never give short one-line explanations or placeholders.
• Avoid "AI-slop" or meta-commentary like "Sure, here is your chapter". Only output the pure JSON data.

Chapter Sections Requirements:
- learningObjectives: Exactly 4 key bullet points in Hindi.
- introduction: A thorough introduction paragraph (in Hindi, 80-120 words) setting the stage.
- theorySections: Exactly 3 high-quality, comprehensive theory sections corresponding to the syllabus topics. Each section should have 'title' (Hindi), 'englishTitle' (optional), and detailed 'content' (detailed Hindi explanations with examples, 150-200 words per section). You can also include 'subsections' if necessary.
- diagrams: Exactly 1 clean, illustrative ASCII diagram representing a key concept in this chapter, with a title and Hindi description.
- tables: Exactly 1 comparison table comparing different concepts with headers and at most 3-4 comparison rows.
- realLifeExamples: Exactly 1-2 practical real-world analogies in Hindi explaining difficult concepts simply.
- importantPoints: Exactly 4 bullet points of key takeaways.
- interviewQuestions: Exactly 2 detailed technical interview Q&As in Hindi.
- vivaQuestions: Exactly 3 short Viva-voce Q&As in Hindi.
- semesterQuestions: Standard university questions. 'short' (exactly 2) and 'long' (exactly 1-2).
- practicals: Exactly 1 step-by-step lab practical/exercise in Hindi with title, steps, and expected outcome.
- shortNotes: Exactly 2-3 short memory notes.
- revisionNotes: Exactly 2-3 quick revision key points.
- previousYearQuestions: Exactly 2 previous year university exam style questions.
- mcqs: Provide EXACTLY 5 highly comprehensive multiple choice questions. Each MCQ must contain: question (Hindi), options (4 options in Hindi with English terms), correctIndex (0 to 3), explanation (Hindi explanation of why it is correct).
- programmingExamples: (Required for C Programming Chapters 13-20, optional but great for others if relevant, e.g. MS Excel formulas, OS commands etc.) Exactly 1 complete, working code block with detailed line-by-line explanation in Hindi, and expected output.
- assignments: Exactly 2 theoretical or practical assignments for students.
- summary: A final summary of the chapter (80-120 words) in Hindi.

Be incredibly thorough. The output must be educational, academic, and highly professional.
`;

    const response = await generateChapterWithFallback(ai, prompt, {
          type: Type.OBJECT,
          properties: {
            number: { type: Type.INTEGER },
            title: { type: Type.STRING },
            englishTitle: { type: Type.STRING },
            learningObjectives: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            introduction: { type: Type.STRING },
            theorySections: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  title: { type: Type.STRING },
                  englishTitle: { type: Type.STRING },
                  content: { type: Type.STRING },
                  subsections: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        title: { type: Type.STRING },
                        englishTitle: { type: Type.STRING },
                        content: { type: Type.STRING },
                        code: { type: Type.STRING },
                        codeExplanation: { type: Type.STRING }
                      }
                    }
                  }
                },
                required: ["id", "title", "content"]
              }
            },
            diagrams: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  title: { type: Type.STRING },
                  ascii: { type: Type.STRING },
                  description: { type: Type.STRING }
                },
                required: ["id", "title", "ascii", "description"]
              }
            },
            tables: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  title: { type: Type.STRING },
                  headers: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  },
                  rows: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        parameter: { type: Type.STRING },
                        col1: { type: Type.STRING },
                        col2: { type: Type.STRING },
                        col3: { type: Type.STRING }
                      },
                      required: ["parameter", "col1", "col2"]
                    }
                  }
                },
                required: ["id", "title", "headers", "rows"]
              }
            },
            realLifeExamples: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  concept: { type: Type.STRING },
                  analogy: { type: Type.STRING },
                  hindiExplanation: { type: Type.STRING }
                },
                required: ["id", "concept", "analogy", "hindiExplanation"]
              }
            },
            importantPoints: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            interviewQuestions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  question: { type: Type.STRING },
                  answer: { type: Type.STRING }
                },
                required: ["question", "answer"]
              }
            },
            vivaQuestions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  question: { type: Type.STRING },
                  answer: { type: Type.STRING }
                },
                required: ["question", "answer"]
              }
            },
            semesterQuestions: {
              type: Type.OBJECT,
              properties: {
                short: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                },
                long: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                }
              },
              required: ["short", "long"]
            },
            practicals: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  steps: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  },
                  expectedOutput: { type: Type.STRING }
                },
                required: ["title", "steps"]
              }
            },
            shortNotes: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            revisionNotes: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            previousYearQuestions: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            mcqs: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  question: { type: Type.STRING },
                  options: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  },
                  correctIndex: { type: Type.INTEGER },
                  explanation: { type: Type.STRING }
                },
                required: ["id", "question", "options", "correctIndex", "explanation"]
              }
            },
            programmingExamples: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  title: { type: Type.STRING },
                  code: { type: Type.STRING },
                  explanation: { type: Type.STRING },
                  output: { type: Type.STRING }
                },
                required: ["id", "title", "code", "explanation", "output"]
              }
            },
            assignments: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            summary: { type: Type.STRING }
          },
          required: [
            "number",
            "title",
            "englishTitle",
            "learningObjectives",
            "introduction",
            "theorySections",
            "diagrams",
            "tables",
            "realLifeExamples",
            "importantPoints",
            "interviewQuestions",
            "vivaQuestions",
            "semesterQuestions",
            "practicals",
            "shortNotes",
            "revisionNotes",
            "previousYearQuestions",
            "mcqs",
            "programmingExamples",
            "assignments",
            "summary"
          ]
    });

    const resultText = response.text || "{}";
    const parsedData = JSON.parse(resultText);

    // Save generated file to disk cache
    fs.writeFileSync(cachePath, JSON.stringify(parsedData, null, 2), "utf-8");
    console.log(`Successfully generated and saved Chapter ${chapterNumber} to disk cache!`);

    return res.json(enrichChapter(chapterNumber, parsedData));
  } catch (error: any) {
    console.error(`Error generating Chapter ${chapterNumber}:`, error);
    return res.status(500).json({
      error: "Failed to generate chapter content. Gemini API error: " + (error.message || error),
    });
  }
});

// 3. Multiturn AI Tutor Chat Route
app.post("/api/chat", async (req, res) => {
  const { messages, chapterContext } = req.body;

  if (!ai) {
    return res.status(500).json({
      error: "Gemini API Key is not configured. Please add GEMINI_API_KEY in Settings > Secrets.",
    });
  }

  try {
    // Format the messages for Gemini Chats
    // The last message is the user prompt. Other messages can serve as history.
    const history = messages.slice(0, -1).map((msg: any) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }],
    }));

    const lastMessage = messages[messages.length - 1].content;

    const systemInstruction = `
You are Professor Alok Kumar, an expert, kind, and supportive Computer Science Professor and BCA faculty member with 25+ years of experience.
Your specialty is teaching Computer Fundamentals and C Programming to first-year BCA students.
You respond in a polite, scholarly, and supportive academic manner.

Language Rules:
- Answer in a clear mixture of Hindi and English (Hinglish / Easy Hindi), using standard English terminology in brackets or directly where helpful, just like a real university professor explaining doubts in class.
- Always be encouraging and guide the student step-by-step.
- If the student asks you to write code, provide standard C code, properly commented, and explain each line simply in Hindi.

Context:
The student is currently reading Chapter Context: ${chapterContext || "BCA Computer Basics & C Programming"}.
Refer to this context or relevant textbook topics to keep your explanations aligned with their syllabus.
`;

    const response = await chatWithFallback(ai, history, systemInstruction, lastMessage);
    return res.json({ reply: response.text });
  } catch (error: any) {
    console.error("Error in tutor chat:", error);
    return res.status(500).json({ error: "Gemini API Error: " + (error.message || error) });
  }
});

// ----------------- VITE DEVELOPMENT SERVER SETUP -----------------

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
