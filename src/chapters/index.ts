import { chapter1 } from "./chapter1";
import { chapter2 } from "./chapter2";
import { chapter3 } from "./chapter3";
import { chapter4 } from "./chapter4";
import { chapter5 } from "./chapter5";
import { chapter6 } from "./chapter6";
import { chapter7 } from "./chapter7";
import { chapter8 } from "./chapter8";
import { chapter9 } from "./chapter9";
import { chapter10 } from "./chapter10";
import { chapter11 } from "./chapter11";
import { chapter12 } from "./chapter12";
import { chapter13 } from "./chapter13";
import { chapter14 } from "./chapter14";
import { chapter15 } from "./chapter15";
import { chapter16 } from "./chapter16";
import { chapter17 } from "./chapter17";
import { chapter18 } from "./chapter18";
import { chapter19 } from "./chapter19";
import { chapter20 } from "./chapter20";

import { Chapter } from "../types";

export interface ChapterMetadata {
  number: number;
  title: string;
  englishTitle: string;
  topics: string[];
}

export const chaptersList: ChapterMetadata[] = [
  {
    number: 1,
    title: "कंप्यूटर का सामान्य परिचय",
    englishTitle: "Introduction to Computer",
    topics: [
      "Definition (परिभाषा)",
      "History (इतिहास)",
      "Characteristics (विशेषताएं)",
      "Applications (अनुप्रयोग)",
      "Block Diagram (ब्लॉक आरेख)",
      "Advantages (लाभ)",
      "Disadvantages (हानियां)",
      "Generations (पीढ़ियां)",
      "Data vs Information (डेटा बनाम सूचना)",
      "Hardware (हार्डवेयर)",
      "Software (सॉफ्टवेयर)",
      "Computer Languages (कंप्यूटर भाषाएं)"
    ]
  },
  {
    number: 2,
    title: "इनपुट उपकरण",
    englishTitle: "Input Devices",
    topics: [
      "Keyboard (कीबोर्ड)",
      "Mouse (माउस)",
      "Scanner (स्कैनर)",
      "MICR (Magnetic Ink Character Recognition)",
      "OCR (Optical Character Recognition)",
      "OMR (Optical Mark Reader)",
      "Barcode Reader (बारकोड रीडर)",
      "Joystick (जॉयस्टिक)",
      "Light Pen (लाइट पेन)",
      "Trackball (ट्रैकबॉल)",
      "Touch Screen (टच स्क्रीन)",
      "Biometric Devices (बायोमेट्रिक डिवाइस)",
      "Webcam (वेबकैम)",
      "Microphone (माइक्रोफोन)"
    ]
  },
  {
    number: 3,
    title: "आउटपुट उपकरण",
    englishTitle: "Output Devices",
    topics: [
      "Monitor (मॉनिटर)",
      "CRT (Cathode Ray Tube)",
      "LCD (Liquid Crystal Display)",
      "LED (Light Emitting Diode)",
      "OLED (Organic Light Emitting Diode)",
      "Printer (प्रिंटर)",
      "Impact Printer (प्रभावशाली प्रिंटर)",
      "Non Impact Printer (गैर-प्रभावशाली प्रिंटर)",
      "Inkjet Printer (इंकजेट)",
      "Laser Printer (लेजर)",
      "Dot Matrix Printer (डॉट मैट्रिक्स)",
      "Speaker (स्पीकर)",
      "Projector (प्रोजेक्टर)",
      "Plotter (प्लॉटर)",
      "Headphones (हेडफोन)"
    ]
  },
  {
    number: 4,
    title: "केंद्रीय प्रक्रमण इकाई (CPU)",
    englishTitle: "Central Processing Unit",
    topics: [
      "ALU (Arithmetic Logic Unit)",
      "CU (Control Unit)",
      "Registers (रजिस्टर)",
      "Clock Speed (क्लॉक स्पीड)",
      "Cache Memory (कैश मेमोरी)",
      "Processor Brands (Intel, AMD, Core Series)",
      "CPU Architecture (32-bit vs 64-bit)"
    ]
  },
  {
    number: 5,
    title: "कंप्यूटर मेमोरी",
    englishTitle: "Computer Memory",
    topics: [
      "Primary Memory (प्राथमिक मेमोरी)",
      "RAM (Random Access Memory)",
      "SRAM (Static RAM)",
      "DRAM (Dynamic RAM)",
      "ROM (Read Only Memory)",
      "PROM (Programmable ROM)",
      "EPROM (Erasable PROM)",
      "EEPROM (Electrically EPROM)",
      "Cache Memory (कैश मेमोरी)",
      "Virtual Memory (वर्चुअल मेमोरी)",
      "Memory Comparison Tables"
    ]
  },
  {
    number: 6,
    title: "भंडारण उपकरण",
    englishTitle: "Storage Devices",
    topics: [
      "Secondary Storage (द्वितीयक स्टोरेज)",
      "Hard Disk Drive (HDD)",
      "Solid State Drive (SSD)",
      "USB Flash Drive (Pen Drive)",
      "DVD (Digital Versatile Disc)",
      "Blu-ray Disc (ब्लू-रे डिस्क)",
      "Memory Card (SD Card)",
      "Cloud Storage (क्लाउड स्टोरेज - Drive, Dropbox)"
    ]
  },
  {
    number: 7,
    title: "ऑपरेटिंग सिस्टम",
    englishTitle: "Operating System",
    topics: [
      "Definition & Purpose (परिभाषा और उद्देश्य)",
      "Functions of OS (OS के कार्य)",
      "Types of OS (OS के प्रकार)",
      "Windows Operating System",
      "Linux Operating System",
      "Android & iOS",
      "macOS",
      "Booting Process (बूटिंग प्रक्रिया)",
      "File System (फ़ाइल प्रणाली)",
      "Multitasking & Multiprogramming",
      "GUI vs CLI (ग्राफिकल यूजर इंटरफेस बनाम कमांड लाइन इंटरफेस)"
    ]
  },
  {
    number: 8,
    title: "एमएस वर्ड का सामान्य परिचय",
    englishTitle: "MS Word",
    topics: [
      "Complete Interface (संपूर्ण इंटरफेस)",
      "Text Formatting (टेक्स्ट फॉर्मेटिंग)",
      "Tables (तालिकाएं बनाना)",
      "Pictures & Shapes (चित्र और आकृतियां)",
      "Headers and Footers (हेडर और फुटर)",
      "Mail Merge (मेल मर्ज)",
      "Printing Documents (दस्तावेज़ प्रिंट करना)",
      "MS Word Shortcut Keys",
      "Lab Exercises"
    ]
  },
  {
    number: 9,
    title: "एमएस एक्सेल का सामान्य परिचय",
    englishTitle: "MS Excel",
    topics: [
      "Workbook and Worksheet (वर्कबुक और वर्कशीट)",
      "Rows, Columns & Cells (पंक्तियाँ, कॉलम और सेल)",
      "Formulas & Functions (सूत्र और फ़ंक्शन)",
      "SUM, AVERAGE, MAX, MIN Functions",
      "Logical Function (IF Function)",
      "Charts & Graphs (चार्ट और ग्राफ)",
      "Printing Sheets",
      "MS Excel Shortcuts"
    ]
  },
  {
    number: 10,
    title: "एमएस पावरपॉइंट का सामान्य परिचय",
    englishTitle: "MS PowerPoint",
    topics: [
      "Slides & Layouts (स्लाइड और लेआउट)",
      "Design Themes (डिज़ाइन थीम्स)",
      "Custom Animations (एनिमेशन)",
      "Slide Transitions (ट्रांजिशन)",
      "Creating Professional Presentations (प्रस्तुति बनाना)",
      "Shortcut Keys & Presentation Tips"
    ]
  },
  {
    number: 11,
    title: "इंटरनेट और साइबर सुरक्षा",
    englishTitle: "Internet & Cyber Security",
    topics: [
      "World Wide Web (WWW)",
      "Web Browser (वेब ब्राउज़र)",
      "Search Engine (सर्च इंजन)",
      "Email Services (ईमेल)",
      "URL (Uniform Resource Locator)",
      "IP Address & Domain Name",
      "Websites & Web Hosting",
      "HTTP vs HTTPS",
      "FTP (File Transfer Protocol)",
      "Introduction to Cyber Security (साइबर सुरक्षा का परिचय)"
    ]
  },
  {
    number: 12,
    title: "कंप्यूटर नेटवर्क",
    englishTitle: "Computer Network",
    topics: [
      "LAN (Local Area Network)",
      "MAN (Metropolitan Area Network)",
      "WAN (Wide Area Network)",
      "Network Topology (Mesh, Star, Bus, Ring, Tree)",
      "Network Devices: Router, Switch, Hub, Bridge, Gateway",
      "OSI Model (7 Layers)",
      "TCP/IP Suite",
      "IP Addressing (IPv4 vs IPv6)"
    ]
  },
  {
    number: 13,
    title: "सी प्रोग्रामिंग का परिचय",
    englishTitle: "Introduction to C Programming",
    topics: [
      "History & Features of C (C का इतिहास और विशेषताएं)",
      "C Compiler vs Interpreter (कंपाइलर बनाम इंटरप्रेटर)",
      "C IDEs (Integrated Development Environments)",
      "Variables & Constants (चर और अचर)",
      "Data Types in C (डेटा प्रकार)",
      "Keywords (कीवर्ड्स)",
      "Basic Input Output (printf and scanf)",
      "Writing First C Program (पहला C प्रोग्राम)"
    ]
  },
  {
    number: 14,
    title: "निर्णय नियंत्रण और लूप्स",
    englishTitle: "Operators & Decision Control",
    topics: [
      "Operators in C (C में ऑपरेटर्स)",
      "Decision Making Statements (if, if-else, Nested if)",
      "Switch Case Statement (स्विच केस)",
      "Loops in C (लूप्स का परिचय)",
      "for Loop (फ़ॉर लूप)",
      "while Loop (व्हाइल लूप)",
      "do-while Loop (डू-व्हाइल लूप)",
      "Control Flow Programs"
    ]
  },
  {
    number: 15,
    title: "एरेज़ (Arrays)",
    englishTitle: "Arrays in C",
    topics: [
      "1D Array (एक-विमीय एरे)",
      "2D Array (द्वि-विमीय एरे - Matrices)",
      "Memory Representation of Arrays",
      "Searching Techniques: Linear Search & Binary Search",
      "Sorting Techniques: Bubble Sort & Selection Sort",
      "Array Programming Examples"
    ]
  },
  {
    number: 16,
    title: "स्ट्रिंग्स (Strings)",
    englishTitle: "Strings in C",
    topics: [
      "Introduction to Strings (स्ट्रिंग्स का परिचय)",
      "String Declaration & Initialization",
      "String Functions (string.h): strlen, strcpy, strcmp, strcat",
      "String Input/Output (gets, puts)",
      "String Programming Examples"
    ]
  },
  {
    number: 17,
    title: "फंक्शन्स (Functions)",
    englishTitle: "Functions in C",
    topics: [
      "Introduction & Types of Functions",
      "User Defined Functions (उपयोगकर्ता-निर्धारित फ़ंक्शन)",
      "Recursion (रिकर्शन - स्व-कॉलिंग फ़ंक्शन)",
      "Call by Value vs Call by Reference",
      "Function Prototypes & Arguments"
    ]
  },
  {
    number: 18,
    title: "पॉइंटर्स (Pointers)",
    englishTitle: "Pointers in C",
    topics: [
      "Concept of Address in Memory (मेमोरी एड्रेस की अवधारणा)",
      "Pointer Declaration & Initialization",
      "Pointer Arithmetic (पॉइंटर अंकगणित)",
      "Relationship between Arrays and Pointers",
      "Pointers to Pointers",
      "Pointer Programming Examples"
    ]
  },
  {
    number: 19,
    title: "स्ट्रक्चर्स (Structures)",
    englishTitle: "Structures in C",
    topics: [
      "Introduction to Structure & Union",
      "Defining and Declaring Structures",
      "Nested Structures (नेस्टेड स्ट्रक्चर्स)",
      "Array of Structures (स्ट्रक्चर्स का एरे)",
      "Structure Programming Examples"
    ]
  },
  {
    number: 20,
    title: "फाइल हैंडलिंग",
    englishTitle: "File Handling in C",
    topics: [
      "Concept of Files (फ़ाइल की अवधारणा)",
      "FILE structure and File Pointers",
      "fopen() and fclose() Functions",
      "File I/O Functions: fprintf, fscanf, fgets, fputs",
      "Text Files vs Binary Files",
      "Complete File Operations Programs"
    ]
  }
];

export function getPrewrittenChapter(number: number): Chapter | null {
  const chapters: Record<number, Chapter> = {
    1: chapter1,
    2: chapter2,
    3: chapter3,
    4: chapter4,
    5: chapter5,
    6: chapter6,
    7: chapter7,
    8: chapter8,
    9: chapter9,
    10: chapter10,
    11: chapter11,
    12: chapter12,
    13: chapter13,
    14: chapter14,
    15: chapter15,
    16: chapter16,
    17: chapter17,
    18: chapter18,
    19: chapter19,
    20: chapter20,
  };

  return chapters[number] ?? null;
}
