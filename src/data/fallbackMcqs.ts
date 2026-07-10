import { MCQ } from "../types";

export const fallbackMcqs: MCQ[] = [
  {
    id: "fb-1",
    question: "कंप्यूटर का जनक (Father of Computer) किसे कहा जाता है?",
    options: ["एलन ट्यूरिंग (Alan Turing)", "चार्ल्स बैबेज (Charles Babbage)", "डेनिस रिची (Dennis Ritchie)", "बिल गेट्स (Bill Gates)"],
    correctIndex: 1,
    explanation: "चार्ल्स बैबेज को कंप्यूटर का जनक कहा जाता है क्योंकि उन्होंने 19वीं शताब्दी में पहले मैकेनिकल कंप्यूटर 'एनालिटिकल इंजन' का प्रारूप तैयार किया था।"
  },
  {
    id: "fb-2",
    question: "C प्रोग्रामिंग भाषा का विकास किसने और कहाँ किया था?",
    options: [
      "डेनिस रिची ने AT&T Bell Labs में",
      "जेम्स गोस्लिंग ने Sun Microsystems में",
      "बजार्ने स्ट्रॉस्ट्रुप ने Bell Labs में",
      "गिडो वैन रोसुम ने CWI में"
    ],
    correctIndex: 0,
    explanation: "C भाषा का विकास डेनिस रिची द्वारा 1972 में AT&T Bell Laboratories (USA) में किया गया था ताकि यूनिक्स ऑपरेटिंग सिस्टम विकसित किया जा सके।"
  },
  {
    id: "fb-3",
    question: "निम्नलिखित में से कौन सा विकल्प कंप्यूटर की 'प्राइमरी मेमोरी' का उदाहरण है?",
    options: ["हार्ड डिस्क (HDD)", "एसएसडी (SSD)", "रैम (RAM)", "पेन ड्राइव (USB)"],
    correctIndex: 2,
    explanation: "रैम (RAM - Random Access Memory) और रोम (ROM) कंप्यूटर की प्राथमिक (Primary) मेमोरी हैं, जो सीपीयू के सीधे संपर्क में रहती हैं।"
  },
  {
    id: "fb-4",
    question: "C भाषा में किस प्रकार का ऑपरेटर '&&' है?",
    options: ["अंकगणितीय ऑपरेटर (Arithmetic)", "तार्किक ऑपरेटर (Logical AND)", "तुलनात्मक ऑपरेटर (Relational)", "असाइनमेंट ऑपरेटर (Assignment)"],
    correctIndex: 1,
    explanation: "'&&' ऑपरेटर C में Logical AND को दर्शाता है। यह तब सत्य (1) परिणाम देता है जब इसके दोनों तरफ की शर्तें सत्य हों।"
  },
  {
    id: "fb-5",
    question: "कंप्यूटर की चौथी पीढ़ी (4th Generation) में मुख्य इलेक्ट्रॉनिक घटक कौन सा था?",
    options: ["वैक्यूम ट्यूब (Vacuum Tubes)", "ट्रांजिस्टर (Transistors)", "एकीकृत परिपथ (IC)", "माइक्रोप्रोसेसर (VLSI Microprocessor)"],
    correctIndex: 3,
    explanation: "चौथी पीढ़ी (1971-1980 के दशक) में बहुत बड़े पैमाने पर एकीकृत परिपथ (VLSI) अर्थात माइक्रोप्रोसेसर का उपयोग शुरू हुआ।"
  },
  {
    id: "fb-6",
    question: "C प्रोग्रामिंग में किसी भी वेरिएबल का नाम घोषित करते समय पहला अक्षर क्या हो सकता है?",
    options: ["केवल कोई अंक (0-9)", "कोई अक्षर (A-Z, a-z) या अंडरस्कोर (_)", "कोई भी विशेष प्रतीक जैसे @, $, %", "ऊपर के सभी विकल्प सही हैं"],
    correctIndex: 1,
    explanation: "C में आइडेंटिफायर के नियमों के अनुसार वेरिएबल का पहला चरित्र केवल वर्णमाला (letter) या अंडरस्कोर (_) होना चाहिए। यह अंक से शुरू नहीं हो सकता।"
  },
  {
    id: "fb-7",
    question: "गीगो (GIGO - Garbage In Garbage Out) सिद्धांत कंप्यूटर की किस विशेषता से संबंधित है?",
    options: ["गति (Speed)", "सटीकता (Accuracy)", "परिश्रमशीलता (Diligence)", "भंडारण क्षमता (Storage)"],
    correctIndex: 1,
    explanation: "GIGO सटीकता (Accuracy) से संबंधित है। यदि हम कंप्यूटर को गलत इनपुट (Garbage In) देंगे तो परिणाम भी गलत ही (Garbage Out) मिलेगा।"
  },
  {
    id: "fb-8",
    question: "C प्रोग्राम में प्रिंट करने के लिए उपयोग किया जाने वाला मानक आउटपुट फ़ंक्शन कौन सा है?",
    options: ["scanf()", "print()", "printf()", "write()"],
    correctIndex: 2,
    explanation: "printf() फ़ंक्शन C की मानक लाइब्रेरी 'stdio.h' का हिस्सा है, जिसका उपयोग कंसोल स्क्रीन पर प्रारूपित आउटपुट प्रदर्शित करने के लिए होता है।"
  },
  {
    id: "fb-9",
    question: "बाइनरी संख्या (1010)2 का दशमलव (Decimal) समतुल्य मान क्या होगा?",
    options: ["8", "10", "12", "14"],
    correctIndex: 1,
    explanation: "गणना: 1*2³ + 0*2² + 1*2¹ + 0*2⁰ = 8 + 0 + 2 + 0 = 10।"
  },
  {
    id: "fb-10",
    question: "C भाषा में 'for', 'while' और 'do-while' क्या हैं?",
    options: ["डेटा प्रकार (Data Types)", "फंक्शन (Functions)", "लूप नियंत्रण संरचनाएं (Loops)", "हेडर फाइलें (Header Files)"],
    correctIndex: 2,
    explanation: "ये तीनों C में कोड के किसी विशिष्ट ब्लॉक को बार-बार निष्पादित करने के लिए उपयोग किए जाने वाले लूप (Looping structures) हैं।"
  },
  {
    id: "fb-11",
    question: "कैश मेमोरी (Cache Memory) किन दो घटकों के बीच एक बफर की तरह कार्य करती है?",
    options: ["रैम (RAM) और रोम (ROM)", "सीपीयू (CPU) और मुख्य मेमोरी (RAM)", "हार्ड डिस्क और एसएसडी", "कीबोर्ड और मॉनिटर"],
    correctIndex: 1,
    explanation: "कैश मेमोरी सीपीयू की कार्य गति बढ़ाने के लिए अत्यंत तीव्र गति वाली मेमोरी है, जो मुख्य रैम और सीपीयू के बीच बफर का कार्य करती है।"
  },
  {
    id: "fb-12",
    question: "C प्रोग्रामिंग में एक एरे (Array) का इंडेक्स नंबर हमेशा कहाँ से शुरू होता है?",
    options: ["1", "-1", "0", "उपयोगकर्ता द्वारा तय किया जाता है"],
    correctIndex: 2,
    explanation: "C प्रोग्रामिंग भाषा में एरे का इंडेक्स हमेशा शून्य (0) से शुरू होकर (size - 1) तक जाता है।"
  },
  {
    id: "fb-13",
    question: "ओएसआई (OSI) नेटवर्क मॉडल में कुल कितनी परतें (Layers) होती हैं?",
    options: ["4", "5", "7", "9"],
    correctIndex: 2,
    explanation: "OSI (Open Systems Interconnection) मॉडल में 7 परतें होती हैं: फिजिकल, डेटा लिंक, नेटवर्क, ट्रांसपोर्ट, सेशन, प्रेजेंटेशन, और एप्लीकेशन।"
  },
  {
    id: "fb-14",
    question: "C भाषा में पॉइंटर (Pointer) क्या स्टोर करता है?",
    options: ["किसी वेरिएबल की वैल्यू", "दूसरे वेरिएबल का मेमोरी एड्रेस", "एक बड़ा फ्लोटिंग वैल्यू", "कीबोर्ड का इनपुट कोड"],
    correctIndex: 1,
    explanation: "पॉइंटर एक विशेष वेरिएबल होता है जो सामान्य मान के स्थान पर किसी अन्य वेरिएबल का मेमोरी एड्रेस (Address) स्टोर करता है।"
  },
  {
    id: "fb-15",
    question: "इंटरनेट पर सुरक्षित संचार (Secure Communication) के लिए किस प्रोटोकॉल का उपयोग किया जाता है?",
    options: ["HTTP", "FTP", "HTTPS", "SMTP"],
    correctIndex: 2,
    explanation: "HTTPS (Hypertext Transfer Protocol Secure) सामान्य HTTP का सुरक्षित संस्करण है, जो डेटा के सुरक्षित हस्तांतरण के लिए SSL/TLS एन्क्रिप्शन का उपयोग करता है।"
  }
];

export interface LeaderboardEntry {
  id: string;
  name: string;
  score: number;
  total: number;
  date: string;
  chapterNum?: string;
}

export const defaultLeaderboard: LeaderboardEntry[] = [
  { id: "lb-1", name: "अमित कुमार", score: 15, total: 15, date: "2026-07-09" },
  { id: "lb-2", name: "नेहा शर्मा", score: 14, total: 15, date: "2026-07-08" },
  { id: "lb-3", name: "रोहित वर्मा", score: 13, total: 15, date: "2026-07-09" },
  { id: "lb-4", name: "संजय सिंह", score: 12, total: 15, date: "2026-07-07" },
  { id: "lb-5", name: "प्रिया पटेल", score: 11, total: 15, date: "2026-07-09" }
];
