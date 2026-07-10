import { Chapter } from "../types";

export const chapter2: Chapter = {
  number: 2,
  title: "इनपुट उपकरण",
  englishTitle: "Input Devices",

  learningObjectives: [
    "कंप्यूटर में इनपुट उपकरणों की भूमिका को समझना।",
    "कीबोर्ड और माउस की कार्यप्रणाली का अध्ययन करना।",
    "OCR, OMR तथा MICR जैसी स्कैनिंग तकनीकों को समझना।",
    "जॉयस्टिक, लाइट पेन, ट्रैकबॉल तथा टच स्क्रीन का उपयोग जानना।",
    "वेबकैम, माइक्रोफोन तथा बायोमेट्रिक उपकरणों की कार्यप्रणाली समझना।",
    "विभिन्न इनपुट उपकरणों के उपयोग एवं अंतर की तुलना करना।"
  ],

  introduction: `कंप्यूटर में इनपुट उपकरण (Input Devices) वे हार्डवेयर होते हैं जिनकी सहायता से उपयोगकर्ता कंप्यूटर को डेटा, सूचना तथा निर्देश प्रदान करता है। यदि इनपुट उपकरण न हों तो कंप्यूटर कोई कार्य नहीं कर सकता क्योंकि उसे आवश्यक डेटा प्राप्त ही नहीं होगा।

आज के आधुनिक कंप्यूटर में साधारण कीबोर्ड एवं माउस से लेकर टच स्क्रीन, फिंगरप्रिंट स्कैनर, वेबकैम तथा बायोमेट्रिक सिस्टम जैसे उन्नत उपकरणों का उपयोग किया जाता है। इस अध्याय में हम सभी प्रमुख इनपुट उपकरणों का विस्तृत अध्ययन करेंगे।`,

  theorySections: [

    {
      id: "input-definition",
      title: "इनपुट उपकरण (Input Devices)",
      englishTitle: "Definition of Input Devices",

      content: `इनपुट उपकरण वे हार्डवेयर होते हैं जिनके माध्यम से उपयोगकर्ता कंप्यूटर को डेटा, निर्देश तथा नियंत्रण संकेत देता है।

इन उपकरणों का मुख्य कार्य उपयोगकर्ता द्वारा दिए गए डेटा को डिजिटल (Binary) रूप में बदलकर CPU तक पहुँचाना है।

मुख्य कार्य:

• डेटा इनपुट करना
• निर्देश देना
• नियंत्रण संकेत भेजना
• उपयोगकर्ता एवं कंप्यूटर के बीच संचार स्थापित करना

उदाहरण:

• Keyboard
• Mouse
• Scanner
• Barcode Reader
• OCR
• OMR
• MICR
• Joystick
• Touch Screen
• Webcam
• Microphone
• Biometric Devices`
    },

    {
      id: "keyboard",
      title: "कीबोर्ड (Keyboard)",
      englishTitle: "Keyboard",

      content: `कीबोर्ड सबसे अधिक उपयोग किया जाने वाला इनपुट उपकरण है।

यह टाइपराइटर के समान दिखाई देता है तथा इसके माध्यम से अक्षर, अंक एवं विशेष चिन्ह कंप्यूटर में प्रविष्ट किए जाते हैं।

कीबोर्ड में लगभग 104 से 108 Keys होती हैं।

मुख्य प्रकार की Keys

1. Typing Keys
(A-Z तथा 0-9)

2. Function Keys
(F1 से F12)

3. Control Keys
Ctrl, Alt, Shift, Esc

4. Navigation Keys
Arrow Keys, Home, End, Page Up, Page Down

5. Numeric Keypad
तेजी से संख्याएँ दर्ज करने के लिए।

कार्यप्रणाली

जब कोई Key दबाई जाती है तो Keyboard Controller एक Scan Code उत्पन्न करता है जिसे CPU पढ़ता है और उसे संबंधित Character में बदल देता है।`
    },

    {
      id: "mouse",
      title: "माउस (Mouse)",
      englishTitle: "Mouse",

      content: `माउस एक Pointing Device है।

इसका आविष्कार Douglas Engelbart ने किया था।

यह Graphical User Interface (GUI) में सबसे महत्वपूर्ण उपकरण है।

मुख्य भाग

• Left Button
• Right Button
• Scroll Wheel
• Optical Sensor

मुख्य कार्य

• Click
• Double Click
• Right Click
• Drag and Drop
• Scroll

माउस के प्रकार

1. Mechanical Mouse

2. Optical Mouse

3. Laser Mouse

4. Wireless Mouse

ऑप्टिकल माउस LED तथा Image Sensor की सहायता से सतह की गति को पहचानता है।`
    },

    {
      id: "scanner",
      title: "स्कैनर (Scanner)",
      englishTitle: "Scanner",

      content: `स्कैनर एक ऐसा इनपुट उपकरण है जो किसी Printed Document, Photograph अथवा चित्र को Digital रूप में बदल देता है।

स्कैनर प्रकाश (Light) की सहायता से दस्तावेज को पढ़ता है।

मुख्य उपयोग

• Document Scanning

• Photo Scanning

• PDF बनाना

• पुराने रिकॉर्ड सुरक्षित रखना

स्कैनर के प्रकार

• Flatbed Scanner

• Handheld Scanner

• Drum Scanner

• Sheet-fed Scanner

लाभ

• तेज डेटा एंट्री

• मूल दस्तावेज सुरक्षित रहता है

• उच्च गुणवत्ता की डिजिटल कॉपी तैयार होती है।`
    }

  ],
  {
  id: "scanning-technologies",
  title: "स्कैनिंग तकनीकें",
  englishTitle: "Scanning Technologies",
  content: `स्कैनर (Scanner) एक इनपुट उपकरण है जो कागज़ पर लिखे हुए टेक्स्ट, चित्र या दस्तावेज़ को डिजिटल डेटा में बदलता है। आधुनिक स्कैनिंग तकनीकों ने डेटा एंट्री को तेज, सटीक और त्रुटिरहित बना दिया है।

1. **OCR (Optical Character Recognition):**
   OCR ऐसी तकनीक है जो स्कैन किए गए प्रिंटेड अक्षरों को पहचानकर उन्हें संपादन योग्य (Editable) टेक्स्ट में बदल देती है। इसका उपयोग पुस्तकों, दस्तावेज़ों तथा पुराने रिकॉर्ड को डिजिटल बनाने में किया जाता है।

2. **OMR (Optical Mark Recognition):**
   OMR का उपयोग उत्तर पुस्तिकाओं (OMR Sheets) की जाँच करने में किया जाता है। यह पेंसिल या पेन से लगाए गए निशानों को प्रकाश के आधार पर पहचानता है। प्रतियोगी परीक्षाओं में इसका व्यापक उपयोग होता है।

3. **MICR (Magnetic Ink Character Recognition):**
   MICR तकनीक मुख्य रूप से बैंकों में चेक प्रोसेसिंग के लिए प्रयोग की जाती है। चेक के नीचे विशेष चुंबकीय स्याही (Magnetic Ink) से लिखे गए कोड को मशीन आसानी से पढ़ लेती है। इससे सुरक्षा तथा गति दोनों बढ़ जाती हैं।

4. **Barcode Reader:**
   बारकोड रीडर दुकानों एवं सुपरमार्केट में उत्पादों पर बने बारकोड को पढ़ता है। यह लेज़र या कैमरा तकनीक का उपयोग करता है और तुरंत उत्पाद की जानकारी कंप्यूटर तक पहुँचाता है।

5. **QR Code Scanner:**
   QR Code Scanner दो-आयामी (2D) कोड को पढ़ता है। इसका उपयोग भुगतान (UPI), वेबसाइट लिंक, टिकट तथा पहचान सत्यापन में किया जाता है।

इन सभी तकनीकों का उद्देश्य डेटा प्रविष्टि को तेज, सटीक और स्वचालित बनाना है।`
},
{
  id: "pointing-devices",
  title: "पॉइंटिंग एवं मल्टीमीडिया इनपुट उपकरण",
  englishTitle: "Pointing and Multimedia Input Devices",
  content: `पॉइंटिंग डिवाइस वे उपकरण हैं जिनकी सहायता से उपयोगकर्ता स्क्रीन पर किसी ऑब्जेक्ट को चुन सकता है या नियंत्रित कर सकता है।

1. **Joystick (जॉयस्टिक):**
   इसका उपयोग मुख्यतः वीडियो गेम खेलने, फ्लाइट सिम्युलेटर तथा रोबोट नियंत्रण में किया जाता है। इसमें एक लीवर होता है जिसे विभिन्न दिशाओं में घुमाया जा सकता है।

2. **Light Pen (लाइट पेन):**
   यह पेन के समान इनपुट उपकरण है जो CRT मॉनिटर की स्क्रीन पर सीधे ड्राइंग या चयन करने के लिए उपयोग किया जाता था।

3. **Trackball (ट्रैकबॉल):**
   यह माउस जैसा उपकरण है लेकिन इसमें गेंद (Ball) ऊपर होती है। उपयोगकर्ता गेंद को घुमाकर कर्सर नियंत्रित करता है। इसका उपयोग CAD तथा औद्योगिक प्रणालियों में होता है।

4. **Touch Screen (टच स्क्रीन):**
   टच स्क्रीन एक ऐसा उपकरण है जो इनपुट और आउटपुट दोनों का कार्य करता है। उपयोगकर्ता स्क्रीन को स्पर्श करके निर्देश देता है तथा परिणाम भी उसी स्क्रीन पर देखता है। आज लगभग सभी स्मार्टफोन, ATM तथा कियोस्क में इसका उपयोग होता है।

5. **Webcam (वेबकैम):**
   वेबकैम चित्र एवं वीडियो को कैप्चर करता है। इसका उपयोग वीडियो कॉन्फ्रेंसिंग, ऑनलाइन कक्षाओं तथा सुरक्षा निगरानी में किया जाता है।

6. **Microphone (माइक्रोफोन):**
   माइक्रोफोन ध्वनि तरंगों को डिजिटल सिग्नल में परिवर्तित करता है। इसका उपयोग वॉयस रिकॉर्डिंग, ऑनलाइन मीटिंग, वॉयस कमांड तथा स्पीच रिकग्निशन में किया जाता है।

7. **Graphics Tablet (ग्राफिक्स टैबलेट):**
   यह कलाकारों एवं डिजाइनरों द्वारा डिजिटल चित्र बनाने के लिए प्रयोग किया जाता है। इसमें स्टाइलस (Stylus) की सहायता से ड्राइंग बनाई जाती है।`
},
{
  id: "biometric-devices",
  title: "बायोमेट्रिक एवं आधुनिक इनपुट उपकरण",
  englishTitle: "Biometric and Modern Input Devices",
  content: `बायोमेट्रिक इनपुट उपकरण किसी व्यक्ति की विशिष्ट शारीरिक अथवा जैविक विशेषताओं के आधार पर पहचान करते हैं। इन्हें सबसे सुरक्षित इनपुट तकनीकों में माना जाता है।

1. **Fingerprint Scanner (फिंगरप्रिंट स्कैनर):**
   यह व्यक्ति की उँगलियों के निशान पहचानकर पहचान सत्यापित करता है। इसका उपयोग मोबाइल, लैपटॉप तथा आधार प्रमाणीकरण में किया जाता है।

2. **Face Recognition System (फेस रिकग्निशन):**
   कैमरे की सहायता से चेहरे की बनावट का विश्लेषण करके व्यक्ति की पहचान करता है। आधुनिक स्मार्टफोन तथा सुरक्षा प्रणालियों में इसका उपयोग होता है।

3. **Iris Scanner (आईरिस स्कैनर):**
   आँख की पुतली (Iris) के पैटर्न की पहचान करके उपयोगकर्ता का सत्यापन करता है। यह अत्यधिक सुरक्षित तकनीक मानी जाती है।

4. **Voice Recognition (वॉयस रिकग्निशन):**
   उपयोगकर्ता की आवाज़ के आधार पर पहचान करता है। Google Assistant, Siri तथा Alexa इसी तकनीक का उपयोग करते हैं।

5. **Smart Card Reader:**
   यह चिप युक्त स्मार्ट कार्ड को पढ़ता है और बैंकिंग, पहचान पत्र तथा प्रवेश नियंत्रण में उपयोग किया जाता है।

बायोमेट्रिक तकनीकों का सबसे बड़ा लाभ यह है कि इन्हें चोरी करना या नकली बनाना अत्यंत कठिन होता है। इसलिए आधुनिक सुरक्षा प्रणालियों में इनका व्यापक उपयोग किया जाता है।`
},
diagrams: [
  {
    id: "input-device-block-diagram",
    title: "इनपुट उपकरणों का ब्लॉक आरेख",
    ascii: `
+------------------+
|  INPUT DEVICES   |
| Keyboard, Mouse  |
| Scanner, Webcam  |
+---------+--------+
          |
          v
+------------------+
|       CPU        |
| (Processing Unit)|
+---------+--------+
          |
     +----+----+
     | Memory  |
     +----+----+
          |
          v
+------------------+
| OUTPUT DEVICES   |
| Monitor,Printer  |
+------------------+
`,
    description:
      "यह आरेख दर्शाता है कि इनपुट उपकरणों से प्राप्त डेटा CPU तक पहुँचता है, जहाँ उसका प्रसंस्करण होता है। आवश्यकतानुसार डेटा मेमोरी में संग्रहित किया जाता है तथा अंत में परिणाम आउटपुट उपकरणों द्वारा प्रदर्शित किया जाता है।"
  }
],

tables: [
  {
    id: "input-devices-comparison",
    title: "विभिन्न इनपुट उपकरणों की तुलना",
    headers: [
      "उपकरण",
      "मुख्य कार्य",
      "उपयोग का क्षेत्र"
    ],
    rows: [
      {
        parameter: "कीबोर्ड",
        col1: "टेक्स्ट एवं संख्याएँ दर्ज करना",
        col2: "डेटा एंट्री, प्रोग्रामिंग"
      },
      {
        parameter: "माउस",
        col1: "कर्सर नियंत्रित करना",
        col2: "GUI आधारित कार्य"
      },
      {
        parameter: "स्कैनर",
        col1: "दस्तावेज़ डिजिटल बनाना",
        col2: "ऑफिस, डिजिटाइजेशन"
      },
      {
        parameter: "OMR",
        col1: "चिन्ह पहचानना",
        col2: "प्रतियोगी परीक्षाएँ"
      },
      {
        parameter: "MICR",
        col1: "चुंबकीय अक्षर पढ़ना",
        col2: "बैंकिंग"
      },
      {
        parameter: "Barcode Reader",
        col1: "बारकोड पढ़ना",
        col2: "सुपरमार्केट, स्टोर"
      }
    ]
  },

  {
    id: "ocr-omr-micr-table",
    title: "OCR, OMR एवं MICR में अंतर",
    headers: [
      "आधार",
      "OCR",
      "OMR",
      "MICR"
    ],
    rows: [
      {
        parameter: "पूरा नाम",
        col1: "Optical Character Recognition",
        col2: "Optical Mark Recognition",
        col3: "Magnetic Ink Character Recognition"
      },
      {
        parameter: "क्या पहचानता है",
        col1: "अक्षर",
        col2: "निशान",
        col3: "चुंबकीय अक्षर"
      },
      {
        parameter: "मुख्य उपयोग",
        col1: "बुक स्कैनिंग",
        col2: "OMR शीट",
        col3: "बैंक चेक"
      },
      {
        parameter: "तकनीक",
        col1: "Optical",
        col2: "Optical",
        col3: "Magnetic"
      }
    ]
  }
],

realLifeExamples: [
  {
    id: "keyboard-example",
    concept: "कीबोर्ड",
    analogy: "टाइपराइटर",
    hindiExplanation:
      "जिस प्रकार टाइपराइटर में बटन दबाकर अक्षर लिखे जाते हैं, उसी प्रकार कीबोर्ड के माध्यम से कंप्यूटर में डेटा दर्ज किया जाता है।"
  },

  {
    id: "scanner-example",
    concept: "स्कैनर",
    analogy: "फोटोकॉपी मशीन",
    hindiExplanation:
      "स्कैनर किसी दस्तावेज़ की डिजिटल कॉपी बनाता है जबकि फोटोकॉपी मशीन उसकी कागज़ पर प्रतिलिपि बनाती है।"
  },

  {
    id: "barcode-example",
    concept: "बारकोड रीडर",
    analogy: "दुकान का बिलिंग सिस्टम",
    hindiExplanation:
      "जब सुपरमार्केट में किसी वस्तु का बारकोड स्कैन किया जाता है तो उसका नाम और मूल्य तुरंत कंप्यूटर में दिखाई देता है।"
  },

  {
    id: "biometric-example",
    concept: "बायोमेट्रिक",
    analogy: "घर की चाबी",
    hindiExplanation:
      "चाबी खो सकती है लेकिन आपकी उँगलियों के निशान या चेहरा नहीं। इसलिए बायोमेट्रिक प्रणाली अधिक सुरक्षित मानी जाती है।"
  }
],

importantPoints: [
  "इनपुट उपकरण उपयोगकर्ता और कंप्यूटर के बीच संचार का माध्यम होते हैं।",
  "कीबोर्ड सबसे सामान्य इनपुट उपकरण है।",
  "माउस एक पॉइंटिंग डिवाइस है।",
  "OCR अक्षरों को पहचानता है।",
  "OMR उत्तर-पत्रक के निशानों को पहचानता है।",
  "MICR बैंक चेक पढ़ने में प्रयोग होता है।",
  "बारकोड रीडर दुकानों में वस्तुओं की पहचान के लिए प्रयोग किया जाता है।",
  "टच स्क्रीन इनपुट और आउटपुट दोनों उपकरण है।",
  "वेबकैम वीडियो इनपुट देता है।",
  "माइक्रोफोन ध्वनि को डिजिटल डेटा में बदलता है।",
  "बायोमेट्रिक उपकरण सुरक्षा के लिए सबसे अधिक उपयोग किए जाते हैं।"
],

interviewQuestions: [
  {
    question: "OCR और OMR में मुख्य अंतर क्या है?",
    answer:
      "OCR अक्षरों को पहचानकर उन्हें टेक्स्ट में बदलता है जबकि OMR केवल चिन्हों या गोलों की पहचान करता है।"
  },

  {
    question: "MICR तकनीक बैंकों में क्यों उपयोग की जाती है?",
    answer:
      "क्योंकि चुंबकीय स्याही से लिखे अक्षरों को मशीन तेज़ी और सटीकता से पढ़ सकती है तथा इसकी नक़ल करना कठिन होता है।"
  },

  {
    question: "टच स्क्रीन को इनपुट और आउटपुट दोनों क्यों कहा जाता है?",
    answer:
      "क्योंकि यह उपयोगकर्ता से इनपुट भी लेती है और उसी स्क्रीन पर परिणाम भी प्रदर्शित करती है।"
  }
],

vivaQuestions: [
  {
    question: "सबसे सामान्य इनपुट उपकरण कौन-सा है?",
    answer: "कीबोर्ड।"
  },

  {
    question: "माउस का आविष्कार किसने किया था?",
    answer: "डगलस एंजेलबार्ट (Douglas Engelbart)।"
  },

  {
    question: "OMR का पूरा नाम क्या है?",
    answer: "Optical Mark Recognition।"
  },

  {
    question: "MICR का उपयोग कहाँ होता है?",
    answer: "बैंकों में चेक प्रोसेसिंग के लिए।"
  },

  {
    question: "वेबकैम किस प्रकार का उपकरण है?",
    answer: "मल्टीमीडिया इनपुट उपकरण।"
  }
],
semesterQuestions: {
  short: [
    "इनपुट उपकरण (Input Device) क्या है?",
    "कीबोर्ड के प्रकार लिखिए।",
    "माउस क्या है?",
    "OCR का पूरा नाम लिखिए।",
    "OMR और MICR में अंतर लिखिए।",
    "बारकोड रीडर क्या है?",
    "टच स्क्रीन को इनपुट डिवाइस क्यों कहा जाता है?",
    "बायोमेट्रिक उपकरण क्या हैं?"
  ],

  long: [
    "कंप्यूटर के विभिन्न इनपुट उपकरणों का विस्तारपूर्वक वर्णन कीजिए।",
    "OCR, OMR तथा MICR की कार्यप्रणाली एवं उपयोगों की तुलना कीजिए।",
    "कीबोर्ड तथा माउस की संरचना एवं कार्यप्रणाली का विस्तार से वर्णन कीजिए।",
    "मल्टीमीडिया एवं आधुनिक इनपुट उपकरणों का वर्णन कीजिए।"
  ]
},

practicals: [
  {
    title: "इनपुट उपकरणों की पहचान",
    steps: [
      "प्रयोगशाला में उपलब्ध सभी इनपुट उपकरणों को देखें।",
      "उनके नाम लिखें।",
      "प्रत्येक उपकरण का उपयोग लिखें।",
      "उन्हें CPU से जोड़कर परीक्षण करें।",
      "एक रिपोर्ट तैयार करें।"
    ],
    expectedOutput:
      "विद्यार्थी विभिन्न इनपुट उपकरणों की पहचान एवं उपयोग समझ सकेंगे।"
  },

  {
    title: "OCR एवं Scanner का प्रयोग",
    steps: [
      "एक मुद्रित दस्तावेज स्कैन करें।",
      "OCR सॉफ्टवेयर खोलें।",
      "स्कैन किए गए दस्तावेज को Text में बदलें।",
      "परिणाम की तुलना मूल दस्तावेज से करें।"
    ],
    expectedOutput:
      "विद्यार्थी OCR तकनीक की कार्यप्रणाली समझ सकेंगे।"
  }
],

shortNotes: [
  "**Input Device:** वह हार्डवेयर जो कंप्यूटर को डेटा देता है।",

  "**Keyboard:** सबसे सामान्य इनपुट उपकरण।",

  "**Mouse:** GUI में कर्सर नियंत्रित करता है।",

  "**Scanner:** कागज़ को डिजिटल रूप देता है।",

  "**OCR:** Printed Text को Editable Text में बदलता है।",

  "**OMR:** उत्तर-पत्रक पढ़ता है।",

  "**MICR:** बैंक चेक पढ़ता है।",

  "**Barcode Reader:** बारकोड पढ़ता है।",

  "**Touch Screen:** Input तथा Output दोनों।",

  "**Biometric Device:** Fingerprint एवं Face पहचानता है।"
],

revisionNotes: [
  "Input Device = User → Computer",

  "Keyboard सबसे सामान्य Input Device है।",

  "Mouse एक Pointing Device है।",

  "OCR = Character Recognition",

  "OMR = Mark Recognition",

  "MICR = Magnetic Ink Recognition",

  "Barcode Reader दुकानों में उपयोग होता है।",

  "Webcam Video Input देता है।",

  "Microphone Voice Input देता है।",

  "Touch Screen = Input + Output"
],

previousYearQuestions: [
  "BCA Semester-I Exam 2022: OCR तथा OMR में अंतर स्पष्ट कीजिए।",

  "BCA Semester-I Exam 2023: विभिन्न इनपुट उपकरणों का वर्णन कीजिए।",

  "BCA Semester-I Exam 2024: MICR तकनीक का उपयोग एवं लाभ बताइए।"
],

mcqs: [
  {
    id: "q1",
    question: "कंप्यूटर का सबसे सामान्य इनपुट उपकरण कौन-सा है?",
    options: ["Monitor", "Keyboard", "Printer", "Speaker"],
    correctIndex: 1,
    explanation: "Keyboard सबसे सामान्य Input Device है।"
  },

  {
    id: "q2",
    question: "माउस का आविष्कार किसने किया था?",
    options: [
      "Charles Babbage",
      "Douglas Engelbart",
      "Bill Gates",
      "Steve Jobs"
    ],
    correctIndex: 1,
    explanation: "Douglas Engelbart ने Mouse का आविष्कार किया।"
  },

  {
    id: "q3",
    question: "OCR का पूरा नाम क्या है?",
    options: [
      "Optical Character Recognition",
      "Optical Code Reader",
      "Object Character Reader",
      "Optical Computer Recognition"
    ],
    correctIndex: 0,
    explanation: "OCR का पूरा नाम Optical Character Recognition है।"
  },

  {
    id: "q4",
    question: "OMR किसके लिए प्रयोग किया जाता है?",
    options: [
      "Cheque Reading",
      "OMR Sheet Checking",
      "Typing",
      "Drawing"
    ],
    correctIndex: 1,
    explanation: "OMR उत्तर-पत्रक जांचने के लिए प्रयोग किया जाता है।"
  },

  {
    id: "q5",
    question: "MICR का उपयोग कहाँ किया जाता है?",
    options: [
      "School",
      "Hospital",
      "Bank",
      "Cinema"
    ],
    correctIndex: 2,
    explanation: "MICR बैंकों में चेक प्रोसेसिंग के लिए प्रयोग होता है।"
  },

  {
    id: "q6",
    question: "Barcode Reader किसे पढ़ता है?",
    options: [
      "Photo",
      "Barcode",
      "Video",
      "Sound"
    ],
    correctIndex: 1,
    explanation: "Barcode Reader बारकोड पढ़ता है।"
  },

  {
    id: "q7",
    question: "Touch Screen क्या है?",
    options: [
      "केवल Input",
      "केवल Output",
      "Input और Output दोनों",
      "Memory"
    ],
    correctIndex: 2,
    explanation: "Touch Screen Input एवं Output दोनों का कार्य करती है।"
  },

  {
    id: "q8",
    question: "Microphone किस प्रकार का उपकरण है?",
    options: [
      "Output",
      "Input",
      "Storage",
      "Memory"
    ],
    correctIndex: 1,
    explanation: "Microphone आवाज को Input के रूप में देता है।"
  },

  {
    id: "q9",
    question: "Webcam क्या कैप्चर करता है?",
    options: [
      "Video",
      "Audio",
      "Text",
      "Barcode"
    ],
    correctIndex: 0,
    explanation: "Webcam वीडियो कैप्चर करता है।"
  },

  {
    id: "q10",
    question: "Biometric Device किसका उपयोग करता है?",
    options: [
      "Fingerprint",
      "Password",
      "PIN",
      "OTP"
    ],
    correctIndex: 0,
    explanation: "Biometric Device Fingerprint आदि का उपयोग करता है।"
  }
],

programmingExamples: [
  {
    id: "keyboard-input-c",
    title: "C Program : Keyboard से संख्या पढ़ना",
    code: `#include<stdio.h>

int main() {
    int n;
    printf("Enter Number: ");
    scanf("%d",&n);
    printf("You Entered = %d",n);
    return 0;
}`,
    explanation:
      "इस प्रोग्राम में scanf() की सहायता से Keyboard से Input लिया जाता है तथा printf() द्वारा Output प्रदर्शित किया जाता है।",
    output: `Enter Number: 25
You Entered = 25`
  }
],

assignments: [
  "अपने घर या कॉलेज में उपलब्ध 10 इनपुट उपकरणों की सूची बनाइए।",

  "OCR, OMR तथा MICR पर 5-5 पृष्ठ का प्रोजेक्ट तैयार कीजिए।",

  "Keyboard के सभी Function Keys (F1-F12) के कार्य लिखिए।",

  "आधुनिक Biometric Devices पर एक रिपोर्ट तैयार कीजिए।"
],

summary: `इस अध्याय में हमने कंप्यूटर के विभिन्न इनपुट उपकरणों का विस्तृत अध्ययन किया। इनपुट उपकरण उपयोगकर्ता तथा कंप्यूटर के बीच संचार का माध्यम होते हैं। हमने Keyboard, Mouse, Scanner, OCR, OMR, MICR, Barcode Reader, Joystick, Light Pen, Trackball, Webcam, Microphone, Touch Screen तथा Biometric Devices की संरचना, कार्यप्रणाली और उपयोगों का अध्ययन किया। साथ ही विभिन्न इनपुट तकनीकों की तुलना, वास्तविक जीवन के उदाहरण, विश्वविद्यालय परीक्षा प्रश्न, Viva प्रश्न तथा MCQs के माध्यम से अध्याय को पूर्ण रूप से समझा।`  
