import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  BookOpen,
  Info,
  Award,
  HelpCircle,
  Terminal,
  MessageSquare,
  Download,
  ListOrdered,
  Play,
  Check,
  X,
  ChevronRight,
  Search,
  Sparkles,
  Clock,
  ArrowLeft,
  Code,
  Table,
  FileText,
  Lightbulb,
  Cpu,
  Bookmark,
  ChevronDown,
  Menu,
  XCircle,
  RotateCcw,
  Keyboard,
  Target,
  GraduationCap,
  CheckCircle,
  AlertTriangle,
  AlertOctagon,
  Moon,
  Sun,
  Eye,
  Trash2,
  Edit2,
  Plus,
  Trophy,
  Calendar
} from "lucide-react";

import { Chapter, MCQ, ProgrammingExample } from "./types";
import { chaptersList, ChapterMetadata, getPrewrittenChapter } from "./chapters/index";
import { authorBioData, aboutContent, disclaimerContent, latestUpdates, popularTopics } from "./data/infoPages";
import { fallbackMcqs, defaultLeaderboard, LeaderboardEntry } from "./data/fallbackMcqs";
// @ts-ignore
import jitendraProfile from "./assets/images/regenerated_image_1783630725258.png";

export default function App() {
  // Navigation & UI States
  const [selectedChapterNum, setSelectedChapterNum] = useState<number | null>(null);
  const [currentChapter, setCurrentChapter] = useState<Chapter | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("syllabus");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);

  // Premium Features States
  const [theme, setTheme] = useState<"light" | "dark" | "auto">(() => {
    try {
      const saved = localStorage.getItem("bca_theme");
      return (saved as any) || "light";
    } catch {
      return "light";
    }
  });
  const [fontSize, setFontSize] = useState<"sm" | "base" | "lg" | "xl">("base");
  const [focusMode, setFocusMode] = useState<boolean>(false);
  const [systemPrefersDark, setSystemPrefersDark] = useState<boolean>(false);

  // Sync System Dark Mode preference
  useEffect(() => {
    try {
      const media = window.matchMedia("(prefers-color-scheme: dark)");
      setSystemPrefersDark(media.matches);
      const listener = (e: MediaQueryListEvent) => setSystemPrefersDark(e.matches);
      media.addEventListener("change", listener);
      return () => media.removeEventListener("change", listener);
    } catch {
      // Safe fallback if not supported
    }
  }, []);

  const isDark = theme === "dark" || (theme === "auto" && systemPrefersDark);

  const [bookmarkedChapters, setBookmarkedChapters] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem("bca_bookmarks");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [completedChapters, setCompletedChapters] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem("bca_completed");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // User Notes Structures
  interface UserNote {
    id: string;
    chapterNum: number;
    title: string;
    content: string;
    createdAt: string;
    bookmarked?: boolean;
  }

  const [userNotes, setUserNotes] = useState<UserNote[]>(() => {
    try {
      const saved = localStorage.getItem("bca_user_notes");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [noteTitle, setNoteTitle] = useState<string>("");
  const [noteContent, setNoteContent] = useState<string>("");
  const [dashboardTab, setDashboardTab] = useState<string>("home");

  // Local storage synchronization
  useEffect(() => {
    localStorage.setItem("bca_theme", theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("bca_bookmarks", JSON.stringify(bookmarkedChapters));
  }, [bookmarkedChapters]);

  useEffect(() => {
    localStorage.setItem("bca_completed", JSON.stringify(completedChapters));
  }, [completedChapters]);

  useEffect(() => {
    localStorage.setItem("bca_user_notes", JSON.stringify(userNotes));
  }, [userNotes]);

  // Random Quiz States
  const [randomQuizActive, setRandomQuizActive] = useState<boolean>(false);
  const [randomQuizQuestions, setRandomQuizQuestions] = useState<MCQ[]>([]);
  const [randomQuizAnswers, setRandomQuizAnswers] = useState<{ [key: string]: number }>({});
  const [randomQuizSubmitted, setRandomQuizSubmitted] = useState<boolean>(false);
  const [randomQuizScore, setRandomQuizScore] = useState<number>(0);
  const [quizQuestionCount, setQuizQuestionCount] = useState<number>(10);
  const [studentName, setStudentName] = useState<string>("");
  const [localLeaderboard, setLocalLeaderboard] = useState<LeaderboardEntry[]>(() => {
    try {
      const saved = localStorage.getItem("bca_leaderboard");
      return saved ? JSON.parse(saved) : defaultLeaderboard;
    } catch {
      return defaultLeaderboard;
    }
  });

  useEffect(() => {
    localStorage.setItem("bca_leaderboard", JSON.stringify(localLeaderboard));
  }, [localLeaderboard]);

  // Contact Page Feedback State
  const [contactName, setContactName] = useState<string>("");
  const [contactEmail, setContactEmail] = useState<string>("");
  const [contactMsg, setContactMsg] = useState<string>("");
  const [contactSubmitted, setContactSubmitted] = useState<boolean>(false);

  // Search Results
  const [filteredChapters, setFilteredChapters] = useState<ChapterMetadata[]>(chaptersList);

  // Quiz States
  const [quizAnswers, setQuizAnswers] = useState<{ [key: string]: number }>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<number>(0);
  const [manualMcqAnswers, setManualMcqAnswers] = useState<{ [key: string]: number }>({});

  // Code Execution States
  const [simulatorOutput, setSimulatorOutput] = useState<string>("");
  const [isRunningCode, setIsRunningCode] = useState<boolean>(false);
  const [selectedProgExample, setSelectedProgExample] = useState<ProgrammingExample | null>(null);
  const [manualSubTab, setManualSubTab] = useState<string>("aim");

  // AI Tutor States
  const [chatInput, setChatInput] = useState<string>("");
  const [chatHistory, setChatHistory] = useState<{ role: string; content: string }[]>([
    {
      role: "assistant",
      content: "नमस्ते! मैं जितेन्द्र बिश्नोई हूँ। इस अध्याय से संबंधित आपके मन में कोई भी शंका या प्रश्न हो, तो निसंकोच मुझसे पूछें। मैं हिंदी और अंग्रेजी के आसान मिश्रण में आपको समझाऊंगा।"
    }
  ]);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // Auto Scroll Chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, isTyping]);

  // Search Text Highlighter
  const highlightText = (text: string, query: string) => {
    if (!query || !query.trim()) return text;
    try {
      const regex = new RegExp(`(${query.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&")})`, "gi");
      const parts = text.split(regex);
      return (
        <>
          {parts.map((part, idx) => 
            regex.test(part) ? (
              <mark key={idx} className="bg-yellow-200 text-slate-900 rounded px-0.5 font-bold">{part}</mark>
            ) : (
              part
            )
          )}
        </>
      );
    } catch {
      return text;
    }
  };

  // Save Note Handler
  const handleSaveNote = () => {
    if (!noteTitle.trim() || !noteContent.trim()) return;

    if (editingNoteId) {
      setUserNotes(prev => prev.map(note => 
        note.id === editingNoteId 
          ? { ...note, title: noteTitle, content: noteContent }
          : note
      ));
      setEditingNoteId(null);
    } else {
      const newNote: UserNote = {
        id: Date.now().toString(),
        chapterNum: selectedChapterNum || 1,
        title: noteTitle,
        content: noteContent,
        createdAt: new Date().toLocaleDateString('hi-IN', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      };
      setUserNotes(prev => [newNote, ...prev]);
    }
    setNoteTitle("");
    setNoteContent("");
  };

  // Edit Note Handler
  const handleEditNote = (note: UserNote) => {
    setEditingNoteId(note.id);
    setNoteTitle(note.title);
    setNoteContent(note.content);
  };

  // Delete Note Handler
  const handleDeleteNote = (id: string) => {
    setUserNotes(prev => prev.filter(note => note.id !== id));
    if (editingNoteId === id) {
      setEditingNoteId(null);
      setNoteTitle("");
      setNoteContent("");
    }
  };

  // Handle Search filtering
  useEffect(() => {
    if (!searchQuery || searchQuery.trim() === "") {
      setFilteredChapters(chaptersList);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = chaptersList.filter(
        (c) =>
          c.title.toLowerCase().includes(query) ||
          c.englishTitle.toLowerCase().includes(query) ||
          c.topics.some((t) => t.toLowerCase().includes(query))
      );
      setFilteredChapters(filtered);
    }
  }, [searchQuery]);

  // Load Chapter Data
  const loadChapter = async (num: number) => {
    setIsLoading(true);
    setErrorMsg(null);
    setSelectedChapterNum(num);
    setActiveTab("syllabus");
    setQuizAnswers({});
    setQuizSubmitted(false);
    setQuizScore(0);
    setSimulatorOutput("");
    setSelectedProgExample(null);
    setChatHistory([
      {
        role: "assistant",
        content: `नमस्ते! मैं जितेन्द्र बिश्नोई हूँ। अध्याय ${num} से संबंधित आपके मन में कोई भी शंका या प्रश्न हो, तो निसंकोच मुझसे पूछें। मैं हिंदी और अंग्रेजी के आसान मिश्रण में आपको समझाऊंगा।`
      }
    ]);

    // Check for prewritten Chapter 1 locally
    const prewritten = getPrewrittenChapter(num);
    if (prewritten) {
      setCurrentChapter(prewritten);
      if (prewritten.programmingExamples.length > 0) {
        setSelectedProgExample(prewritten.programmingExamples[0]);
      }
      setIsLoading(false);
      return;
    }

    // Fetch Chapters 2-20 from backend API (which dynamically generates using Gemini if not cached)
    try {
      const response = await fetch(`/api/chapters/${num}`);
      if (!response.ok) {
        let errorMsgText = "Failed to load chapter.";
        try {
          const text = await response.text();
          try {
            const errorData = JSON.parse(text);
            errorMsgText = errorData.error || errorMsgText;
          } catch {
            // Not a JSON response (might be HTML or plain text)
            if (text.includes("<!doctype html>") || text.includes("<html")) {
              errorMsgText = "सर्वर अभी व्यस्त है या अनुरोध का समय समाप्त हो गया है। कृपया पुनः प्रयास करें।";
            } else {
              errorMsgText = text.substring(0, 150) || errorMsgText;
            }
          }
        } catch {
          errorMsgText = `HTTP Error ${response.status}`;
        }
        throw new Error(errorMsgText);
      }
      const data: Chapter = await response.json();
      setCurrentChapter(data);
      if (data.programmingExamples && data.programmingExamples.length > 0) {
        setSelectedProgExample(data.programmingExamples[0]);
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "सर्वर से कनेक्ट होने में समस्या आ रही है। कृपया सुनिश्चित करें कि आपकी API Key सही ढंग से कॉन्फ़िगर है।");
    } finally {
      setIsLoading(false);
    }
  };

  // Run C Code Simulation
  const runCodeSimulation = (code: string, expectedOutput: string) => {
    setIsRunningCode(true);
    setSimulatorOutput("Compiling code with gcc...\n");
    setTimeout(() => {
      setSimulatorOutput((prev) => prev + "Linking variables & generating output...\n\n");
      setTimeout(() => {
        setSimulatorOutput((prev) => prev + `[OUTPUT]\n${expectedOutput}\n\n[Process completed with exit code 0]`);
        setIsRunningCode(false);
      }, 1000);
    }, 1000);
  };

  // Submit MCQ answers
  const submitQuiz = () => {
    if (!currentChapter) return;
    let score = 0;
    currentChapter.mcqs.forEach((mcq) => {
      if (quizAnswers[mcq.id] === mcq.correctIndex) {
        score += 1;
      }
    });
    setQuizScore(score);
    setQuizSubmitted(true);
  };

  // Ask AI Tutor
  const askTutor = async () => {
    if (!chatInput.trim() || !currentChapter) return;
    const userMsg = chatInput;
    setChatInput("");
    setChatHistory((prev) => [...prev, { role: "user", content: userMsg }]);
    setIsTyping(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...chatHistory.slice(-5), { role: "user", content: userMsg }],
          chapterContext: `Chapter ${currentChapter.number}: ${currentChapter.title} (${currentChapter.englishTitle})`,
        }),
      });

      if (!response.ok) {
        throw new Error("Tutor was unable to respond.");
      }

      const data = await response.json();
      setChatHistory((prev) => [...prev, { role: "assistant", content: data.reply }]);
    } catch (err) {
      setChatHistory((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "माफ़ कीजियेगा, सर्वर कनेक्टिविटी या API Key सीमा के कारण मैं अभी उत्तर देने में असमर्थ हूँ। कृपया अपनी API Key जांचें या थोड़ी देर बाद प्रयास करें।"
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  // Generate Print-ready Word / PDF notes download
  const downloadChapterNotes = () => {
    if (!currentChapter) return;

    let docContent = `
    <html>
    <head>
      <title>BCA First Year Notes - Chapter ${currentChapter.number}</title>
      <style>
        body { font-family: 'Arial', sans-serif; padding: 40px; color: #333; line-height: 1.6; }
        h1 { color: #1e3a8a; font-size: 28px; text-align: center; border-bottom: 2px solid #1e3a8a; padding-bottom: 10px; }
        h2 { color: #1e40af; font-size: 20px; margin-top: 30px; border-bottom: 1px solid #e5e7eb; padding-bottom: 5px; }
        h3 { color: #1e3a8a; font-size: 16px; }
        .metadata { text-align: center; font-style: italic; color: #666; margin-bottom: 40px; }
        .section { margin-bottom: 30px; }
        .box { background-color: #f3f4f6; border-left: 4px solid #1e3a8a; padding: 15px; margin: 15px 0; border-radius: 4px; }
        pre { background-color: #1f2937; color: #f3f4f6; padding: 15px; border-radius: 6px; font-family: 'Courier New', monospace; overflow-x: auto; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th, td { border: 1px solid #cbd5e1; padding: 10px; text-align: left; }
        th { background-color: #f1f5f9; color: #1e3a8a; }
      </style>
    </head>
    <body>
      <h1>अध्याय ${currentChapter.number}: ${currentChapter.title}</h1>
      <div class="metadata">BCA First Year - Computer Basics & C Programming Textbook (Hindi Notes)</div>
      
      <h2>1. सीखने के उद्देश्य (Learning Objectives)</h2>
      <ul>
        ${currentChapter.learningObjectives.map((o) => `<li>${o}</li>`).join("")}
      </ul>

      <h2>2. परिचय (Introduction)</h2>
      <div class="section">${currentChapter.introduction}</div>

      <h2>3. मुख्य सिद्धांत एवं थ्योरी (Theory & Detailed Concepts)</h2>
      ${currentChapter.theorySections
        .map(
          (s) => `
        <div class="section">
          <h3>${s.title} ${s.englishTitle ? `(${s.englishTitle})` : ""}</h3>
          <p>${s.content.replace(/\n/g, "<br>")}</p>
          ${
            s.subsections
              ? s.subsections
                  .map(
                    (sub) => `
            <div style="margin-left: 20px; margin-top: 15px;">
              <strong>${sub.title} ${sub.englishTitle ? `(${sub.englishTitle})` : ""}</strong>
              <p>${sub.content.replace(/\n/g, "<br>")}</p>
            </div>
          `
                  )
                  .join("")
              : ""
          }
        </div>
      `
        )
        .join("")}

      <h2>4. ब्लॉक आरेख व चित्र (Diagrams)</h2>
      ${currentChapter.diagrams
        .map(
          (d) => `
        <div class="section">
          <h3>${d.title}</h3>
          <pre>${d.ascii}</pre>
          <p><em>${d.description}</em></p>
        </div>
      `
        )
        .join("")}

      <h2>5. तुलनात्मक तालिकाएं (Comparison Tables)</h2>
      ${currentChapter.tables
        .map(
          (t) => `
        <div class="section">
          <h3>${t.title}</h3>
          <table>
            <thead>
              <tr>
                ${t.headers.map((h) => `<th>${h}</th>`).join("")}
              </tr>
            </thead>
            <tbody>
              ${t.rows
                .map(
                  (r) => `
                <tr>
                  <td><strong>${r.parameter}</strong></td>
                  <td>${r.col1}</td>
                  <td>${r.col2}</td>
                  ${r.col3 ? `<td>${r.col3}</td>` : ""}
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>
        </div>
      `
        )
        .join("")}

      <h2>6. वास्तविक जीवन के उदाहरण (Real Life Analogies)</h2>
      ${currentChapter.realLifeExamples
        .map(
          (e) => `
        <div class="box">
          <strong>अवधारणा: ${e.concept}</strong><br>
          <strong>सादृश्य (Analogy): ${e.analogy}</strong><br>
          <p>${e.hindiExplanation}</p>
        </div>
      `
        )
        .join("")}

      <h2>7. अभ्यास प्रश्नोत्तरी (University Exam Questions)</h2>
      <h3>अति-लघु एवं लघु उत्तरीय प्रश्न (Short Questions)</h3>
      <ul>
        ${currentChapter.semesterQuestions.short.map((q) => `<li>${q}</li>`).join("")}
      </ul>
      <h3>दीर्घ उत्तरीय प्रश्न (Long Questions)</h3>
      <ul>
        ${currentChapter.semesterQuestions.long.map((q) => `<li>${q}</li>`).join("")}
      </ul>

      <h2>8. मुख्य परीक्षा / इंटरव्यू प्रश्न (Interview & Viva-Voce)</h2>
      ${currentChapter.interviewQuestions
        .map(
          (q) => `
        <p><strong>प्रश्न: ${q.question}</strong><br>
        उत्तर: ${q.answer}</p>
      `
        )
        .join("")}

      <h2>9. असाइनमेंट (Assignments)</h2>
      <ul>
        ${currentChapter.assignments.map((a) => `<li>${a}</li>`).join("")}
      </ul>

      <h2>10. सारांश (Summary)</h2>
      <p>${currentChapter.summary}</p>
    </body>
    </html>
    `;

    const blob = new Blob([docContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Chapter_${currentChapter.number}_BCA_Notes.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className={`flex h-screen overflow-hidden font-sans antialiased transition-colors duration-300 ${
      isDark ? "dark bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-800"
    }`}>
      
      {/* 1. SIDEBAR: Chapter Index List & General Navigation */}
      <AnimatePresence initial={false}>
        {sidebarOpen && !focusMode && (
          <motion.div
            id="sidebar"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 340, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={`flex flex-col h-full shrink-0 shadow-2xl z-20 overflow-hidden border-r transition-colors duration-300 ${
              isDark ? "bg-slate-900 border-slate-800 text-white" : "bg-slate-900 border-slate-950 text-white"
            }`}
          >
            {/* Sidebar Logo & Author Header */}
            <div className="p-5 border-b border-slate-800 bg-slate-950/50 flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-600 rounded-lg text-white">
                  <BookOpen className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="font-display font-extrabold text-lg tracking-tight leading-none text-blue-400">BCA Textbook</h1>
                  <span className="text-[10px] text-slate-400 font-mono">Hindi Digital Medium</span>
                </div>
              </div>
              <p className="text-[11px] text-slate-400 leading-normal mt-1 border-t border-slate-800/80 pt-2 font-display">
                "BCA Computer Basics & C Programming"
              </p>
              
              {/* Reading Progress Tracker */}
              <div className="mt-1 space-y-1 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                <div className="flex justify-between items-center text-[10px] font-mono font-bold text-slate-300">
                  <span>पठन प्रगति (Syllabus Progress)</span>
                  <span>{completedChapters.length} / 20 ({Math.round((completedChapters.length / 20) * 100)}%)</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 transition-all duration-500"
                    style={{ width: `${(completedChapters.length / 20) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="flex items-center gap-1.5 mt-1">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-[10px] text-slate-400">लेखक: जितेन्द्र बिश्नोई</span>
              </div>
            </div>

            {/* Quick Portal Shortcuts */}
            <div className="px-3 py-2 border-b border-slate-800 bg-slate-950/20 flex gap-1.5">
              <button 
                onClick={() => { setSelectedChapterNum(null); setDashboardTab("home"); }}
                className={`flex-1 py-1.5 rounded text-[10px] font-bold text-center transition-all ${
                  selectedChapterNum === null && dashboardTab === "home" ? "bg-blue-600 text-white" : "bg-slate-800 text-slate-300 hover:bg-slate-705"
                }`}
              >
                होमपोर्टल
              </button>
              <button 
                onClick={() => { setSelectedChapterNum(null); setDashboardTab("notes"); }}
                className={`flex-1 py-1.5 rounded text-[10px] font-bold text-center transition-all ${
                  selectedChapterNum === null && dashboardTab === "notes" ? "bg-blue-600 text-white" : "bg-slate-800 text-slate-300 hover:bg-slate-705"
                }`}
              >
                मेरी नोट्स
              </button>
              <button 
                onClick={() => { setSelectedChapterNum(null); setDashboardTab("quiz"); }}
                className={`flex-1 py-1.5 rounded text-[10px] font-bold text-center transition-all ${
                  selectedChapterNum === null && dashboardTab === "quiz" ? "bg-blue-600 text-white" : "bg-slate-800 text-slate-300 hover:bg-slate-705"
                }`}
              >
                रैंडम क्विज़
              </button>
            </div>

            {/* Sidebar Search Bar */}
            <div className="p-3 border-b border-slate-800 bg-slate-900/60 flex items-center gap-2">
              <div className="relative w-full">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                  <Search className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  placeholder="अध्याय या विषय खोजें..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-700/60 rounded-md text-xs text-white placeholder-slate-450 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-sans"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Sidebar Chapter Items Scrollable list */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              <div className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 mb-1 pl-1 flex justify-between items-center">
                <span>पाठ्यपुस्तक अनुक्रमणिका</span>
                <span className="text-[9px] text-blue-400 font-mono lowercase">({filteredChapters.length} found)</span>
              </div>
              {filteredChapters.map((ch) => {
                const isSelected = selectedChapterNum === ch.number;
                const isCompleted = completedChapters.includes(ch.number);
                const isBookmarked = bookmarkedChapters.includes(ch.number);
                return (
                  <button
                    key={ch.number}
                    onClick={() => loadChapter(ch.number)}
                    className={`w-full text-left p-2.5 rounded-lg flex items-start gap-2 transition-all group ${
                      isSelected
                        ? "bg-blue-600 text-white font-medium shadow-lg shadow-blue-600/10"
                        : "hover:bg-slate-800/60 text-slate-300"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono font-bold shrink-0 mt-0.5 ${
                        isSelected ? "bg-white text-blue-600" : "bg-slate-850 text-slate-300"
                      }`}
                    >
                      {ch.number}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <div className="text-xs font-semibold leading-tight line-clamp-1 flex-1 group-hover:text-blue-300 transition-colors">{ch.title}</div>
                        {isCompleted && <CheckCircle className="w-3 h-3 text-emerald-400 shrink-0" />}
                        {isBookmarked && <Bookmark className="w-3 h-3 text-amber-400 fill-amber-400 shrink-0" />}
                      </div>
                      <div
                        className={`text-[9px] mt-0.5 line-clamp-1 font-mono ${
                          isSelected ? "text-blue-200" : "text-slate-400"
                        }`}
                      >
                        {ch.englishTitle}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Sidebar Footer */}
            <div className="p-4 border-t border-slate-800 bg-slate-950/40 text-[11px] text-slate-400 flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <span>विश्वविद्यालय पाठ्यक्रम 2026</span>
                <span className="font-mono text-[9px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded">v1.2</span>
              </div>
              <div className="text-[9px] text-slate-500">BCA First Year (Semester I) Textbook</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. MAIN READING AREA AND UTILITIES */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        
        {/* HEADER */}
        <header className={`border-b px-6 py-3.5 flex items-center justify-between shrink-0 shadow-sm z-10 transition-colors duration-300 ${
          isDark ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-850"
        }`}>
          <div className="flex items-center gap-4">
            {!focusMode && (
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className={`p-1.5 rounded-lg transition-colors ${
                  isDark ? "hover:bg-slate-800 text-slate-300" : "hover:bg-slate-100 text-slate-500"
                }`}
                title="Toggle Menu"
              >
                {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            )}
            
            {focusMode && (
              <button
                onClick={() => setFocusMode(false)}
                className="flex items-center gap-1.5 text-xs text-blue-500 bg-blue-500/10 px-2.5 py-1.5 rounded-lg font-bold hover:bg-blue-500/20 transition-all"
              >
                <Eye className="w-4 h-4" />
                <span>रीडिंग फोकस मोड बंद करें (Exit Focus)</span>
              </button>
            )}

            {selectedChapterNum !== null ? (
              <button
                onClick={() => setSelectedChapterNum(null)}
                className={`flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg font-semibold transition-all ${
                  isDark ? "text-slate-300 hover:text-white hover:bg-slate-800" : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                मुख्य पोर्टल
              </button>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-500" />
                <span className={`text-xs font-semibold ${isDark ? "text-slate-300" : "text-slate-500"}`}>BCA University Exam Ready Textbook</span>
              </div>
            )}
          </div>

          {/* Accessibility Settings & Theme Switchers */}
          <div className="flex items-center gap-3">
            
            {/* Font Sizer */}
            <div className={`hidden lg:flex items-center gap-1 px-1.5 py-1 rounded-lg border text-xs font-mono font-bold ${
              isDark ? "border-slate-800 bg-slate-950/40" : "border-slate-200 bg-slate-100"
            }`}>
              <span className="text-[10px] text-slate-400 pr-1 select-none">SIZE:</span>
              <button 
                onClick={() => setFontSize("sm")}
                className={`px-1.5 py-0.5 rounded transition-all ${fontSize === "sm" ? "bg-blue-600 text-white" : "hover:bg-slate-300/40"}`}
                title="Small text"
              >
                A-
              </button>
              <button 
                onClick={() => setFontSize("base")}
                className={`px-1.5 py-0.5 rounded transition-all ${fontSize === "base" ? "bg-blue-600 text-white" : "hover:bg-slate-300/40"}`}
                title="Normal text"
              >
                A
              </button>
              <button 
                onClick={() => setFontSize("lg")}
                className={`px-1.5 py-0.5 rounded transition-all ${fontSize === "lg" ? "bg-blue-600 text-white" : "hover:bg-slate-300/40"}`}
                title="Large text"
              >
                A+
              </button>
              <button 
                onClick={() => setFontSize("xl")}
                className={`px-1.5 py-0.5 rounded transition-all ${fontSize === "xl" ? "bg-blue-600 text-white" : "hover:bg-slate-300/40"}`}
                title="Extra Large text"
              >
                A++
              </button>
            </div>

            {/* Reading focus mode switcher */}
            {selectedChapterNum !== null && (
              <button
                onClick={() => setFocusMode(!focusMode)}
                className={`p-1.5 rounded-lg transition-all hidden md:flex ${
                  focusMode 
                    ? "bg-blue-600 text-white" 
                    : isDark 
                      ? "hover:bg-slate-800 text-slate-300" 
                      : "hover:bg-slate-100 text-slate-500"
                }`}
                title="Toggle Reading Focus Mode (Maximizes screen)"
              >
                <Eye className="w-5 h-5" />
              </button>
            )}

            {/* Theme switcher control */}
            <div className={`flex items-center gap-0.5 p-0.5 rounded-lg border ${
              isDark ? "border-slate-800 bg-slate-950/40" : "border-slate-200 bg-slate-100"
            }`}>
              <button
                onClick={() => setTheme("light")}
                className={`p-1 rounded transition-all ${theme === "light" ? "bg-white text-amber-500 shadow-sm" : "text-slate-400 hover:text-slate-600"}`}
                title="Light Theme"
              >
                <Sun className="w-4 h-4" />
              </button>
              <button
                onClick={() => setTheme("dark")}
                className={`p-1 rounded transition-all ${theme === "dark" ? "bg-slate-800 text-blue-400 shadow-sm" : "text-slate-400 hover:text-slate-300"}`}
                title="Dark Theme"
              >
                <Moon className="w-4 h-4" />
              </button>
              <button
                onClick={() => setTheme("auto")}
                className={`px-1.5 py-0.5 text-[9px] rounded font-bold font-mono transition-all ${theme === "auto" ? "bg-blue-600 text-white shadow-sm" : "text-slate-400 hover:text-slate-500"}`}
                title="Follow system preference"
              >
                AUTO
              </button>
            </div>

            <div className="hidden md:flex items-center gap-2 text-[10px] text-slate-400 font-mono">
              <Clock className="w-3.5 h-3.5" />
              <span>UTC: 2026-07-09</span>
            </div>
            {currentChapter && (
              <button
                onClick={downloadChapterNotes}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-xs px-3 py-1.5 rounded-lg transition-all shadow-md font-medium"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">नोट्स प्रिंट (HTML)</span>
              </button>
            )}
          </div>
        </header>

        {/* CONTAINER CONTENT */}
        <div className={`flex-1 overflow-y-auto transition-colors duration-300 ${
          isDark ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-800"
        }`}>
          
          {/* SEARCH TRIGGERED RESULTS VIEW */}
          {searchQuery.trim().length > 0 ? (
            <div className="p-6 md:p-10 max-w-4xl mx-auto space-y-6">
              <div className="flex justify-between items-center border-b pb-4">
                <div>
                  <h2 className="font-display font-extrabold text-xl md:text-2xl flex items-center gap-2">
                    <Search className="w-6 h-6 text-blue-500" />
                    <span>गहन खोज परिणाम (Search Results)</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">पूरे डिजिटल पाठ्यपुस्तक पाठ्यक्रम, प्रैक्टिकल मैनुअल और विषय-वस्तु में आपकी खोज</p>
                </div>
                <button 
                  onClick={() => setSearchQuery("")}
                  className="text-xs font-semibold text-blue-500 hover:underline"
                >
                  खोज बंद करें
                </button>
              </div>

              {/* Dynamic matched results block */}
              <div className="space-y-4">
                {/* 1. Matched Chapters */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">अध्याय और अनुक्रमणिका मेल</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {chaptersList.filter(c => 
                      c.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                      c.englishTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      c.topics.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
                    ).map(c => (
                      <div 
                        key={c.number}
                        onClick={() => { loadChapter(c.number); setSearchQuery(""); }}
                        className={`p-4 border rounded-xl hover:scale-[1.01] transition-all cursor-pointer ${
                          isDark ? "bg-slate-900 border-slate-800 hover:bg-slate-800/80" : "bg-white border-slate-200 hover:bg-blue-50/20"
                        }`}
                      >
                        <span className="text-[10px] font-bold text-blue-500 font-mono">अध्याय {c.number}</span>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                          {highlightText(c.title, searchQuery)}
                        </h4>
                        <p className="text-xs text-slate-400 font-mono mt-0.5">{highlightText(c.englishTitle, searchQuery)}</p>
                        
                        {/* Subtopics matched preview */}
                        {c.topics.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())) && (
                          <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800/50">
                            <span className="text-[10px] text-slate-400 block font-semibold mb-1">संबंधित टॉपिक्स:</span>
                            <div className="flex flex-wrap gap-1">
                              {c.topics.filter(t => t.toLowerCase().includes(searchQuery.toLowerCase())).map((t, idx) => (
                                <span key={idx} className="text-[10px] px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded font-medium">
                                  {highlightText(t, searchQuery)}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. Matched Offline MCQ Bank Questions */}
                <div className="space-y-3 pt-4">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">प्रश्नोत्तरी एवं वाइवा प्रश्न मिलान</h3>
                  <div className="space-y-2">
                    {fallbackMcqs.filter(m => 
                      m.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      m.explanation.toLowerCase().includes(searchQuery.toLowerCase())
                    ).map((m, idx) => (
                      <div 
                        key={idx}
                        className={`p-4 border rounded-xl ${
                          isDark ? "bg-slate-900 border-slate-800 text-slate-300" : "bg-white border-slate-200 text-slate-700"
                        }`}
                      >
                        <span className="text-[10px] bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 rounded font-bold font-mono">ऑफलाइन मॉक प्रश्न</span>
                        <p className="text-xs font-bold text-slate-900 dark:text-white mt-2 leading-relaxed">{highlightText(m.question, searchQuery)}</p>
                        <p className="text-[11px] text-slate-400 mt-2 italic">व्याख्या: {highlightText(m.explanation, searchQuery)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              {selectedChapterNum === null ? (
                /* PORTAL SYSTEM - MAIN DASHBOARD PORTAL SYSTEM */
                <motion.div
                  key="portal-dashboard"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="p-6 md:p-10 max-w-5xl mx-auto space-y-8"
                >
                  {/* Sub Header for Portal Navigation Tabs */}
                  <div className="flex border-b pb-px overflow-x-auto gap-1 border-slate-200 dark:border-slate-800 no-scrollbar">
                    {[
                      { id: "home", label: "मुख्य होम", icon: Sparkles },
                      { id: "notes", label: "मेरी पर्सनल नोट्स", icon: FileText },
                      { id: "quiz", label: "रैंडम क्विज़ टेस्ट", icon: Trophy },
                      { id: "author", label: "प्रोफ़ेसर प्रोफ़ाइल (Author)", icon: GraduationCap },
                      { id: "about", label: "कोर्स विवरण (About)", icon: Info },
                      { id: "disclaimer", label: "अस्वीकरण (Disclaimer)", icon: AlertTriangle },
                      { id: "contact", label: "संपर्क करें (Contact)", icon: MessageSquare },
                    ].map((tab) => {
                      const Icon = tab.icon;
                      const isActive = dashboardTab === tab.id;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setDashboardTab(tab.id)}
                          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold whitespace-nowrap transition-all border-b-2 ${
                            isActive
                              ? "border-blue-600 text-blue-600 dark:text-blue-400"
                              : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-350"
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          <span>{tab.label}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* PORTAL TAB 1: HOME PAGE DASHBOARD */}
                  {dashboardTab === "home" && (
                    <div className="space-y-8">
                      
                      {/* Hero Block with 3D Book Cover Grid */}
                      <div className="bg-gradient-to-br from-slate-900 via-slate-920 to-blue-950 rounded-2xl p-6 md:p-10 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row gap-8 items-center border border-slate-800">
                        <div className="absolute top-0 right-0 transform translate-x-12 -translate-y-12 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
                        
                        {/* CSS-designed 3D Book Cover */}
                        <div className="relative shrink-0 perspective-1000 group">
                          <div className="relative w-44 h-60 bg-gradient-to-br from-blue-600 to-indigo-900 rounded-r-xl shadow-2xl overflow-hidden border border-blue-400/20 transform hover:scale-105 hover:-rotate-3 transition-all duration-300 flex flex-col justify-between p-5 select-none">
                            {/* Spine shadow overlay */}
                            <div className="absolute left-0 inset-y-0 w-3 bg-gradient-to-r from-black/45 via-transparent to-transparent"></div>
                            <div className="space-y-1 relative z-10">
                              <div className="text-[9px] uppercase tracking-wider font-mono text-blue-200 font-bold">BCA Sem I Textbook</div>
                              <h3 className="font-display font-extrabold text-white text-base tracking-tight leading-tight pt-1">
                                Computer Fundamentals & C Programming
                              </h3>
                              <div className="text-[8px] text-indigo-200 font-medium font-sans mt-1">100% हिंदी व्याख्या सहित</div>
                            </div>
                            <div className="flex justify-between items-end relative z-10">
                              <div className="space-y-0.5">
                                <div className="text-[8px] text-blue-300">वरिष्ठ लेखक</div>
                                <div className="text-xs font-bold text-white leading-none">प्रो. जितेन्द्र बिश्नोई</div>
                              </div>
                              <div className="w-8 h-8 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center text-white shadow-inner">
                                <Cpu className="w-4 h-4 text-blue-100" />
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Welcome Text Section */}
                        <div className="relative z-10 space-y-4 flex-1">
                          <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-300 border border-blue-500/30 px-3 py-1 rounded-full text-xs font-semibold font-display">
                            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                            <span>BCA First Semester Premium Digital Learning Platform</span>
                          </div>
                          <h2 className="font-display font-extrabold text-2xl md:text-3xl tracking-tight leading-tight">
                            BCA कंप्यूटर बेसिक्स और सी प्रोग्रामिंग
                          </h2>
                          <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
                            यह संपूर्ण डिजिटल पाठ्यपुस्तक और विश्वविद्यालय परीक्षा अध्ययन मार्गदर्शिका 100% हिंदी माध्यम के छात्रों के लिए विशेष रूप से विकसित की गई है। यहाँ आप प्रत्येक C प्रोग्राम के लिए विस्तृत 20-सूत्री विश्वविद्यालय प्रैक्टिकल गाइड, लाइन-दर-लाइन हिंदी स्पष्टीकरण, ड्राय रन ट्रेस और 24/7 जितेन्द्र बिश्नोई AI ट्यूटर के साथ कोडिंग की बारीकियों को सहजता से सीख सकते हैं।
                          </p>
                          <div className="flex flex-wrap gap-3 pt-2">
                            <button
                              onClick={() => loadChapter(1)}
                              className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-blue-600/20 inline-flex items-center gap-2 group cursor-pointer"
                            >
                              <span>पढ़ाई शुरू करें (अध्याय 1)</span>
                              <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                            </button>
                            <button
                              onClick={() => {
                                // Jump back to continue reading where the user was, or chapter 1
                                const lastRead = selectedChapterNum || 1;
                                loadChapter(lastRead);
                              }}
                              className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold px-5 py-2.5 rounded-xl transition-all border border-slate-700 inline-flex items-center gap-1.5 cursor-pointer"
                            >
                              <span>अध्ययन जारी रखें</span>
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Course statistics panels */}
                      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                        {[
                          { val: "20", label: "सम्पूर्ण अध्याय", desc: "Chapters List", icon: ListOrdered, col: "text-blue-500 bg-blue-100/50 dark:bg-blue-900/20" },
                          { val: "150+", label: "सटीक प्रोग्राम्स", desc: "C Source Code", icon: Code, col: "text-emerald-500 bg-emerald-100/50 dark:bg-emerald-900/20" },
                          { val: "200+", label: "अभ्यास प्रश्नोत्तरी", desc: "MCQs Bank", icon: HelpCircle, col: "text-purple-500 bg-purple-100/50 dark:bg-purple-900/20" },
                          { val: "60+", label: "लैब प्रैक्टिकल्स", desc: "Manual Practicals", icon: Terminal, col: "text-indigo-500 bg-indigo-100/50 dark:bg-indigo-900/20" },
                          { val: "100+", label: "वाइवा प्रश्न", desc: "Viva Questions", icon: Award, col: "text-amber-500 bg-amber-100/50 dark:bg-amber-900/20" },
                          { val: "45 Hrs", label: "औसत पठन समय", desc: "Reading Hours", icon: Clock, col: "text-pink-500 bg-pink-100/50 dark:bg-pink-900/20" },
                        ].map((stat, sIdx) => {
                          const Icon = stat.icon;
                          return (
                            <div 
                              key={sIdx}
                              className={`p-4 rounded-xl border text-center space-y-1 transition-all ${
                                isDark ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-850 shadow-sm"
                              }`}
                            >
                              <div className={`w-8 h-8 rounded-full mx-auto flex items-center justify-center ${stat.col}`}>
                                <Icon className="w-4 h-4" />
                              </div>
                              <div className="text-sm font-extrabold font-mono pt-1 leading-none">{stat.val}</div>
                              <div className="text-[10px] font-bold text-slate-800 dark:text-slate-200 leading-snug">{stat.label}</div>
                              <div className="text-[8px] text-slate-400 font-mono">{stat.desc}</div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Updates & Popular Topics Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* 1. Latest Updates Section */}
                        <div className={`p-6 rounded-2xl border ${
                          isDark ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-800 shadow-sm"
                        }`}>
                          <h3 className="font-display font-bold text-base mb-4 flex items-center gap-2 border-b pb-2 dark:border-slate-800">
                            <Clock className="w-4 h-4 text-blue-500" />
                            <span>नवीनतम अपडेट्स (Latest Portal Updates)</span>
                          </h3>
                          <div className="space-y-4">
                            {latestUpdates.map((item) => (
                              <div key={item.id} className="flex gap-3 items-start text-xs">
                                <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase ${
                                  item.tag === "नया" ? "bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300" : "bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300"
                                }`}>
                                  {item.tag}
                                </span>
                                <div className="space-y-1 flex-1">
                                  <h4 className="font-semibold text-slate-900 dark:text-slate-150">{item.title}</h4>
                                  <p className="text-slate-500 leading-normal">{item.desc}</p>
                                  <span className="text-[9px] text-slate-400 font-mono block">{item.date}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* 2. Popular Topics List */}
                        <div className={`p-6 rounded-2xl border ${
                          isDark ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-800 shadow-sm"
                        }`}>
                          <h3 className="font-display font-bold text-base mb-4 flex items-center gap-2 border-b pb-2 dark:border-slate-800">
                            <Target className="w-4 h-4 text-emerald-500" />
                            <span>लोकप्रिय अध्ययन विषय (Popular Topics)</span>
                          </h3>
                          <div className="space-y-3">
                            {popularTopics.map((topic) => (
                              <div 
                                key={topic.id}
                                onClick={() => loadChapter(topic.chapter)}
                                className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer hover:scale-[1.01] ${
                                  isDark ? "bg-slate-950/45 border-slate-800/80 hover:bg-slate-800/80" : "bg-slate-50 border-slate-150 hover:bg-emerald-50/20 hover:border-emerald-200"
                                }`}
                              >
                                <div className="space-y-0.5">
                                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">{topic.title}</h4>
                                  <span className="text-[9px] text-slate-400 font-mono block">{topic.english}</span>
                                </div>
                                <span className="text-[9px] bg-blue-100 dark:bg-blue-900/30 text-blue-750 dark:text-blue-300 px-2 py-0.5 rounded font-bold font-mono">
                                  Ch {topic.chapter}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Recently Added Chapters Quick Access Bento */}
                      <div className={`p-6 rounded-2xl border ${
                        isDark ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-800 shadow-sm"
                      }`}>
                        <h3 className="font-display font-bold text-base mb-4 flex items-center gap-2 border-b pb-2 dark:border-slate-800">
                          <BookOpen className="w-4 h-4 text-blue-500" />
                          <span>हाल ही में जोड़े गए अध्याय (Syllabus Grid Selection)</span>
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {chaptersList.slice(0, 4).map((ch) => (
                            <div 
                              key={ch.number}
                              onClick={() => loadChapter(ch.number)}
                              className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all hover:scale-[1.01] ${
                                isDark 
                                  ? "bg-slate-950/45 border-slate-800/80 hover:bg-slate-850" 
                                  : "bg-slate-50 border-slate-150 hover:bg-blue-50/20 hover:border-blue-200"
                              }`}
                            >
                              <div className="flex gap-3 items-center">
                                <span className="w-7 h-7 bg-blue-600 rounded-lg text-white font-bold font-mono text-xs flex items-center justify-center">
                                  {ch.number}
                                </span>
                                <div>
                                  <h4 className="text-xs font-bold leading-tight text-slate-900 dark:text-white">{ch.title}</h4>
                                  <span className="text-[9px] text-slate-400 font-mono mt-0.5 block">{ch.englishTitle}</span>
                                </div>
                              </div>
                              <ChevronRight className="w-4 h-4 text-slate-400" />
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>
                  )}

                  {/* PORTAL TAB 2: STUDY NOTES MANAGER */}
                  {dashboardTab === "notes" && (
                    <div className="space-y-6">
                      <div className="border-b pb-4">
                        <h2 className="font-display font-extrabold text-xl md:text-2xl flex items-center gap-2">
                          <FileText className="w-6 h-6 text-blue-500" />
                          <span>डिजिटल पर्सनल नोट्स डायरी (My Local Notes Manager)</span>
                        </h2>
                        <p className="text-xs text-slate-400 mt-1">अपने अध्यायों और कोडिंग के संदर्भ के लिए व्यक्तिगत अध्ययन नोट्स बनाएं, वे स्थानीय रूप से सुरक्षित रहेंगे।</p>
                      </div>

                      {/* Add/Edit Note Form */}
                      <div className={`p-5 rounded-xl border space-y-4 ${
                        isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
                      }`}>
                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                          {editingNoteId ? "नोट संशोधित करें (Edit Study Note)" : "नया अध्ययन नोट लिखें (Create Study Note)"}
                        </h3>
                        <div className="space-y-3">
                          <input 
                            type="text" 
                            placeholder="नोट का शीर्षक (उदा: 'एरे इंडेक्स नियम')"
                            value={noteTitle}
                            onChange={(e) => setNoteTitle(e.target.value)}
                            className={`w-full px-4 py-2 text-xs rounded-lg border focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                              isDark ? "bg-slate-950 border-slate-800 text-white" : "bg-slate-50 border-slate-200"
                            }`}
                          />
                          <textarea 
                            placeholder="मुख्य विवरण यहाँ लिखें (उदा: C में एरे का आकार परिभाषित करना आवश्यक है, इंडेक्स 0 से शुरू होता है...)"
                            value={noteContent}
                            onChange={(e) => setNoteContent(e.target.value)}
                            rows={4}
                            className={`w-full px-4 py-2.5 text-xs rounded-lg border focus:outline-none focus:ring-1 focus:ring-blue-500 font-sans ${
                              isDark ? "bg-slate-950 border-slate-800 text-white" : "bg-slate-50 border-slate-200"
                            }`}
                          ></textarea>
                          <div className="flex justify-end gap-2">
                            {editingNoteId && (
                              <button 
                                onClick={() => { setEditingNoteId(null); setNoteTitle(""); setNoteContent(""); }}
                                className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-705 text-slate-700 dark:text-slate-300 text-xs font-bold px-4 py-2 rounded-lg"
                              >
                                निरस्त करें
                              </button>
                            )}
                            <button 
                              onClick={handleSaveNote}
                              className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-5 py-2 rounded-lg shadow-md flex items-center gap-1.5 cursor-pointer"
                            >
                              <Plus className="w-4 h-4" />
                              <span>{editingNoteId ? "अपडेट करें" : "सुरक्षित करें (Save)"}</span>
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Display Saved Notes List */}
                      <div className="space-y-3">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">सुरक्षित किए गए नोट्स ({userNotes.length})</h3>
                        {userNotes.length === 0 ? (
                          <div className="text-center py-12 border border-dashed rounded-xl border-slate-200 dark:border-slate-850">
                            <FileText className="w-12 h-12 text-slate-300 mx-auto" />
                            <p className="text-xs text-slate-400 mt-2 font-display">अभी तक कोई अध्ययन नोट नहीं लिखा गया है। ऊपर दिए गए फॉर्म से शुरू करें!</p>
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {userNotes.map((note) => (
                              <div 
                                key={note.id}
                                className={`p-4 rounded-xl border flex flex-col justify-between space-y-4 shadow-sm transition-all hover:shadow ${
                                  isDark ? "bg-slate-900 border-slate-800 text-slate-300" : "bg-white border-slate-200 text-slate-700"
                                }`}
                              >
                                <div className="space-y-2">
                                  <div className="flex justify-between items-start">
                                    <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-snug">{note.title}</h4>
                                    <span className="text-[9px] text-slate-400 font-mono">{note.createdAt}</span>
                                  </div>
                                  <p className="text-[11px] leading-relaxed whitespace-pre-wrap text-slate-600 dark:text-slate-300 font-sans">{note.content}</p>
                                </div>
                                <div className="flex justify-between items-center border-t border-slate-100 dark:border-slate-800/80 pt-2.5">
                                  <span className="text-[9px] text-blue-500 font-bold bg-blue-100/50 dark:bg-blue-900/30 px-2.5 py-0.5 rounded-full font-sans">
                                    सामान्य नोट्स
                                  </span>
                                  <div className="flex items-center gap-2 shrink-0">
                                    <button 
                                      onClick={() => handleEditNote(note)}
                                      className="text-slate-400 hover:text-blue-600 p-1 rounded transition-colors"
                                      title="Edit Note"
                                    >
                                      <Edit2 className="w-3.5 h-3.5" />
                                    </button>
                                    <button 
                                      onClick={() => handleDeleteNote(note.id)}
                                      className="text-slate-400 hover:text-red-500 p-1 rounded transition-colors"
                                      title="Delete Note"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* PORTAL TAB 3: RANDOM MCQ QUIZ CHALLENGE */}
                  {dashboardTab === "quiz" && (
                    <div className="space-y-6">
                      <div className="border-b pb-4">
                        <h2 className="font-display font-extrabold text-xl md:text-2xl flex items-center gap-2">
                          <Trophy className="w-6 h-6 text-amber-500 animate-pulse" />
                          <span>रैंडम साप्ताहिक ज्ञान परीक्षा (BCA MCQ Quiz Challenge)</span>
                        </h2>
                        <p className="text-xs text-slate-400 mt-1">पूरे पाठ्यक्रम से चयनित बहुविकल्पीय प्रश्नों के साथ अपने ज्ञान को परखें और लीडरबोर्ड पर जगह बनाएं!</p>
                      </div>

                      {!randomQuizActive ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          
                          {/* Left: Start configuration card */}
                          <div className={`p-6 rounded-2xl border space-y-4 md:col-span-2 ${
                            isDark ? "bg-slate-900 border-slate-800 text-slate-300" : "bg-white border-slate-200 text-slate-700 shadow-sm"
                          }`}>
                            <h3 className="font-display font-bold text-base border-b pb-2 dark:border-slate-800">परीक्षा विन्यास (Quiz Config)</h3>
                            <div className="space-y-4 text-xs">
                              <div className="space-y-1.5">
                                <label className="font-semibold block text-slate-500">विद्यार्थी का नाम (Student Name):</label>
                                <input 
                                  type="text" 
                                  placeholder="अपना नाम दर्ज करें"
                                  value={studentName}
                                  onChange={(e) => setStudentName(e.target.value)}
                                  className={`w-full px-4 py-2.5 rounded-xl border focus:outline-none focus:border-blue-600 ${
                                    isDark ? "bg-slate-950 border-slate-800 text-white" : "bg-slate-50 border-slate-200"
                                  }`}
                                />
                              </div>

                              <div className="space-y-1.5">
                                <label className="font-semibold block text-slate-500">प्रश्नों की संख्या (Number of Questions):</label>
                                <div className="flex gap-2">
                                  {[5, 10, 15].map((cnt) => (
                                    <button
                                      key={cnt}
                                      onClick={() => setQuizQuestionCount(cnt)}
                                      className={`px-4 py-2 rounded-lg border font-mono font-bold transition-all ${
                                        quizQuestionCount === cnt 
                                          ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-600/10" 
                                          : isDark 
                                            ? "border-slate-800 bg-slate-950 hover:bg-slate-850" 
                                            : "border-slate-200 hover:bg-slate-100"
                                      }`}
                                    >
                                      {cnt} प्रश्न
                                    </button>
                                  ))}
                                </div>
                              </div>

                              <div className="pt-3 border-t dark:border-slate-800">
                                <button
                                  onClick={() => {
                                    if (!studentName.trim()) {
                                      alert("कृपया परीक्षा शुरू करने से पहले अपना नाम दर्ज करें।");
                                      return;
                                    }
                                    // Shuffle mock questions
                                    const shuffled = [...fallbackMcqs].sort(() => 0.5 - Math.random()).slice(0, quizQuestionCount);
                                    setRandomQuizQuestions(shuffled);
                                    setRandomQuizAnswers({});
                                    setRandomQuizSubmitted(false);
                                    setRandomQuizScore(0);
                                    setRandomQuizActive(true);
                                  }}
                                  className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl font-bold shadow-lg shadow-blue-600/20 text-xs transition-all cursor-pointer"
                                >
                                  क्विज़ टेस्ट शुरू करें
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Right: Leadboard list */}
                          <div className={`p-6 rounded-2xl border space-y-4 ${
                            isDark ? "bg-slate-900 border-slate-800 text-slate-300" : "bg-white border-slate-200 text-slate-700 shadow-sm"
                          }`}>
                            <h3 className="font-display font-bold text-base border-b pb-2 dark:border-slate-800 flex items-center gap-1.5 text-amber-500">
                              <Trophy className="w-4 h-4" />
                              <span>लीडरबोर्ड (Leaderboard)</span>
                            </h3>
                            <div className="space-y-3 font-sans">
                              {localLeaderboard.map((entry, idx) => (
                                <div key={entry.id} className="flex justify-between items-center text-xs pb-2 border-b dark:border-slate-800 last:border-0 last:pb-0">
                                  <div className="flex gap-2.5 items-center">
                                    <span className={`w-5 h-5 rounded-full font-bold font-mono flex items-center justify-center text-[10px] ${
                                      idx === 0 ? "bg-amber-100 text-amber-800" : idx === 1 ? "bg-slate-200 text-slate-800" : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                                    }`}>
                                      {idx + 1}
                                    </span>
                                    <span className="font-semibold text-slate-900 dark:text-slate-100 leading-none">{entry.name}</span>
                                  </div>
                                  <span className="font-mono font-bold text-blue-600 dark:text-blue-400 text-[11px]">{entry.score} / {entry.total}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                        </div>
                      ) : (
                        /* ACTIVE RANDOM MCQ QUIZ CHALLENGE PANEL */
                        <div className="space-y-6">
                          <div className="flex justify-between items-center border-b pb-3 dark:border-slate-800">
                            <div>
                              <span className="text-[10px] bg-blue-100 dark:bg-blue-900/30 text-blue-700 px-2 py-0.5 rounded font-bold uppercase tracking-wider font-sans">चल रही परीक्षा</span>
                              <h3 className="text-sm font-bold mt-1 text-slate-900 dark:text-white">परीक्षार्थी: {studentName}</h3>
                            </div>
                            <button
                              onClick={() => setRandomQuizActive(false)}
                              className="text-xs font-semibold text-red-500 hover:underline"
                            >
                              क्विज रद्द करें (Quit)
                            </button>
                          </div>

                          {/* Render Shuffled List of Questions */}
                          <div className="space-y-6">
                            {randomQuizQuestions.map((mcq, mIdx) => {
                              const answerKey = `rq_${mcq.id}`;
                              const isAnswered = randomQuizAnswers[answerKey] !== undefined;
                              const selectedAns = randomQuizAnswers[answerKey];
                              return (
                                <div key={mcq.id} className={`p-5 rounded-xl border space-y-3 ${
                                  isDark ? "bg-slate-900 border-slate-800" : "bg-slate-50 border-slate-200 shadow-sm"
                                }`}>
                                  <span className="text-[9px] text-slate-400 font-mono block">प्रश्न {mIdx + 1} of {randomQuizQuestions.length}</span>
                                  <p className="text-xs font-bold text-slate-900 dark:text-white leading-relaxed text-justify">{mcq.question}</p>
                                  
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                                    {mcq.options.map((opt, oIdx) => {
                                      const isSelected = selectedAns === oIdx;
                                      let btnStyles = "";
                                      if (randomQuizSubmitted) {
                                        if (oIdx === mcq.correctIndex) {
                                          btnStyles = "bg-emerald-50 border-emerald-300 text-emerald-800 dark:bg-emerald-950/20 dark:border-emerald-800 dark:text-emerald-300 font-semibold";
                                        } else if (isSelected) {
                                          btnStyles = "bg-rose-50 border-rose-300 text-rose-800 dark:bg-rose-950/20 dark:border-rose-800 dark:text-rose-300";
                                        } else {
                                          btnStyles = "bg-white border-slate-200 dark:bg-slate-950 dark:border-slate-850 opacity-60 text-slate-500";
                                        }
                                      } else {
                                        if (isSelected) {
                                          btnStyles = "bg-blue-50 border-blue-400 text-blue-800 dark:bg-blue-950/40 dark:border-blue-700 dark:text-blue-300 font-semibold";
                                        } else {
                                          btnStyles = "bg-white border-slate-200 dark:bg-slate-950 dark:border-slate-850 text-slate-700 dark:text-slate-350 hover:bg-slate-100 dark:hover:bg-slate-850";
                                        }
                                      }

                                      return (
                                        <button
                                          key={oIdx}
                                          disabled={randomQuizSubmitted}
                                          onClick={() => setRandomQuizAnswers(prev => ({ ...prev, [answerKey]: oIdx }))}
                                          className={`text-left p-3 rounded-lg text-xs font-medium border transition-all flex items-center justify-between ${btnStyles}`}
                                        >
                                          <span>{opt}</span>
                                          {randomQuizSubmitted ? (
                                            oIdx === mcq.correctIndex ? (
                                              <Check className="w-4 h-4 text-emerald-600" />
                                            ) : isSelected ? (
                                              <X className="w-4 h-4 text-rose-600" />
                                            ) : null
                                          ) : isSelected ? (
                                            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                                          ) : null}
                                        </button>
                                      );
                                    })}
                                  </div>

                                  {/* Explanation block */}
                                  {randomQuizSubmitted && (
                                    <div className="mt-3 p-3 bg-blue-100/50 dark:bg-blue-900/20 text-[11px] text-blue-800 dark:text-blue-300 rounded-lg leading-relaxed text-justify">
                                      <strong>स्पष्टीकरण:</strong> {mcq.explanation}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>

                          {/* Submit & Result Panel */}
                          <div className={`p-5 rounded-2xl border flex flex-col md:flex-row justify-between items-center gap-4 ${
                            isDark ? "bg-slate-900 border-slate-800" : "bg-blue-50 border-blue-150"
                          }`}>
                            <div className="space-y-1">
                              <h4 className="text-xs font-bold text-slate-950 dark:text-white leading-none">
                                {randomQuizSubmitted ? "ज्ञान परीक्षा समाप्त!" : "सभी प्रश्नों के उत्तर जाँचें!"}
                              </h4>
                              <p className="text-[10px] text-slate-500 mt-1">
                                {randomQuizSubmitted 
                                  ? "आपका स्कोर लीडरबोर्ड पर जोड़ दिया गया है।" 
                                  : "सबमिट बटन पर क्लिक करते ही परिणाम और विस्तृत विश्लेषण प्रदर्शित हो जाएगा।"}
                              </p>
                            </div>

                            <div className="flex items-center gap-2.5 shrink-0">
                              {randomQuizSubmitted ? (
                                <div className="flex items-center gap-3">
                                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                                    प्राप्तांक: <strong className="text-blue-600 dark:text-blue-400 text-sm font-mono">{randomQuizScore} / {randomQuizQuestions.length}</strong>
                                  </span>
                                  <button
                                    onClick={() => setRandomQuizActive(false)}
                                    className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2 rounded-lg transition-all"
                                  >
                                    परीक्षण बंद करें
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => {
                                    // Calculate score
                                    let calculatedScore = 0;
                                    randomQuizQuestions.forEach(mcq => {
                                      const ansKey = `rq_${mcq.id}`;
                                      if (randomQuizAnswers[ansKey] === mcq.correctIndex) {
                                        calculatedScore += 1;
                                      }
                                    });
                                    setRandomQuizScore(calculatedScore);
                                    setRandomQuizSubmitted(true);

                                    // Push to local leaderboard list
                                    const newEntry: LeaderboardEntry = {
                                      id: "entry_" + Date.now(),
                                      name: studentName,
                                      score: calculatedScore,
                                      total: randomQuizQuestions.length,
                                      date: new Date().toLocaleDateString("hi-IN")
                                    };
                                    setLocalLeaderboard(prev => [newEntry, ...prev].slice(0, 8));
                                  }}
                                  className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-5 py-2.5 rounded-lg shadow-md transition-all cursor-pointer"
                                >
                                  सबमिट करें
                                </button>
                              )}
                            </div>
                          </div>

                        </div>
                      )}
                    </div>
                  )}

                  {/* PORTAL TAB 4: PROFESSOR BIOGRAPHY & BIO */}
                  {dashboardTab === "author" && (
                    <div className="space-y-6">
                      <div className="border-b pb-4">
                        <h2 className="font-display font-extrabold text-xl md:text-2xl flex items-center gap-2">
                          <GraduationCap className="w-6 h-6 text-blue-500" />
                          <span>लेखक प्रोफ़ाइल विवरण (Author Profile Bio)</span>
                        </h2>
                        <p className="text-xs text-slate-400 mt-1">पुस्तक के रचयिता वरिष्ठ कंप्यूटर विज्ञान शिक्षाविद् का आधिकारिक बायोडाटा एवं विवरण।</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                        {/* Profile Photo Placeholder Block */}
                        <div className={`p-6 rounded-2xl border text-center space-y-3 ${
                          isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-sm"
                        }`}>
                          <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-blue-500/30 mx-auto shadow shadow-blue-500/10 relative group bg-blue-50">
                            <img
                              src={jitendraProfile}
                              alt="जितेन्द्र बिश्नोई"
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                            />
                          </div>
                          <div>
                            <h3 className="font-display font-bold text-slate-900 dark:text-white leading-none">{authorBioData.name}</h3>
                            <span className="text-[10px] text-slate-400 mt-1 font-mono block">Senior Computer Science Author</span>
                          </div>
                          <span className="text-[10px] bg-blue-100/50 dark:bg-blue-900/30 text-blue-750 dark:text-blue-300 px-3 py-1 rounded-full font-bold block">
                            25+ वर्ष अध्यापन अनुभव
                          </span>
                        </div>

                        {/* Biography content details */}
                        <div className="md:col-span-2 space-y-5">
                          <div className="space-y-2 text-xs">
                            <h4 className="font-display font-bold text-sm text-blue-600">परिचय और कार्यवृत्ति (Career Profile)</h4>
                            <p className="text-slate-500 dark:text-slate-300 leading-relaxed text-justify">{authorBioData.bio}</p>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1.5 text-xs">
                              <h4 className="font-bold text-slate-900 dark:text-white border-b pb-1">हमारा लक्ष्य (Mission)</h4>
                              <p className="text-slate-500 leading-relaxed text-justify">{authorBioData.mission}</p>
                            </div>
                            <div className="space-y-1.5 text-xs">
                              <h4 className="font-bold text-slate-900 dark:text-white border-b pb-1">दूरदर्शिता (Vision)</h4>
                              <p className="text-slate-500 leading-relaxed text-justify">{authorBioData.vision}</p>
                            </div>
                          </div>

                          <div className={`p-4 rounded-xl border text-[11px] leading-relaxed italic ${
                            isDark ? "bg-slate-900/50 border-slate-800 text-slate-300" : "bg-slate-50 border-slate-150 text-slate-600"
                          }`}>
                            📌 <strong>एआई एवं तकनीक घोषणा:</strong> {authorBioData.aiDeclaration}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* PORTAL TAB 5: ABOUT THE BCA SYLLABUS COURSE */}
                  {dashboardTab === "about" && (
                    <div className="space-y-6">
                      <div className="border-b pb-4">
                        <h2 className="font-display font-extrabold text-xl md:text-2xl flex items-center gap-2">
                          <Info className="w-6 h-6 text-blue-500" />
                          <span>कंप्यूटर बेसिक्स और सी पाठ्यक्रम (BCA Course Overview)</span>
                        </h2>
                        <p className="text-xs text-slate-400 mt-1">BCA प्रथम सेमेस्टर पाठ्यक्रम के विषयों का संक्षिप्त परिचय और मूल्य।</p>
                      </div>

                      <div className="space-y-4 text-xs">
                        <div className="space-y-1.5">
                          <h3 className="font-bold text-slate-900 dark:text-white text-sm">पाठ्यपुस्तक प्रस्तावना (Textbook Introduction)</h3>
                          <p className="text-slate-500 dark:text-slate-300 leading-relaxed text-justify">{aboutContent.intro}</p>
                        </div>
                        <div className="space-y-1.5">
                          <h3 className="font-bold text-slate-900 dark:text-white text-sm">प्रौद्योगिकी समाकलन का महत्व (Value of Interactivity)</h3>
                          <p className="text-slate-500 dark:text-slate-300 leading-relaxed text-justify">{aboutContent.importance}</p>
                        </div>
                        <div className="space-y-1.5">
                          <h3 className="font-bold text-slate-900 dark:text-white text-sm">लक्षित विद्यार्थी (Target Audience)</h3>
                          <p className="text-slate-500 dark:text-slate-300 leading-relaxed text-justify">{aboutContent.targetAudience}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* PORTAL TAB 6: DISCLAIMER AND POLICIES */}
                  {dashboardTab === "disclaimer" && (
                    <div className="space-y-6">
                      <div className="border-b pb-4">
                        <h2 className="font-display font-extrabold text-xl md:text-2xl flex items-center gap-2">
                          <AlertTriangle className="w-6 h-6 text-blue-500" />
                          <span>कानूनी अस्वीकरण (Legal Disclaimer)</span>
                        </h2>
                        <p className="text-xs text-slate-400 mt-1">इस डिजिटल पाठ्यक्रम सामग्री के उपयोग से संबंधित वैधानिक नियम और नीतियां।</p>
                      </div>

                      <div className="space-y-4 text-xs">
                        <div className="space-y-1.5">
                          <h3 className="font-bold text-slate-900 dark:text-white text-sm">1. उपयोग का उद्देश्य (Purpose of Usage)</h3>
                          <p className="text-slate-500 dark:text-slate-300 leading-relaxed text-justify">{disclaimerContent.purpose}</p>
                        </div>
                        <div className="space-y-1.5">
                          <h3 className="font-bold text-slate-900 dark:text-white text-sm">2. दायित्व की सीमा (Warranties Limitations)</h3>
                          <p className="text-slate-500 dark:text-slate-300 leading-relaxed text-justify">{disclaimerContent.warranties}</p>
                        </div>
                        <div className="space-y-1.5">
                          <h3 className="font-bold text-slate-900 dark:text-white text-sm">3. विश्वविद्यालय परीक्षा सामग्री (University Exams Policy)</h3>
                          <p className="text-slate-500 dark:text-slate-300 leading-relaxed text-justify">{disclaimerContent.examDisclaimer}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* PORTAL TAB 7: CONTACT US SUPPORT PAGE */}
                  {dashboardTab === "contact" && (
                    <div className="space-y-6">
                      <div className="border-b pb-4">
                        <h2 className="font-display font-extrabold text-xl md:text-2xl flex items-center gap-2">
                          <MessageSquare className="w-6 h-6 text-blue-500" />
                          <span>लेखक एवं सहायता टीम से संपर्क (Contact Us)</span>
                        </h2>
                        <p className="text-xs text-slate-400 mt-1">यदि आपके पास कोई शैक्षणिक प्रश्न, व्यावसायिक सुझाव या प्रतिक्रिया है, तो बेझिझक हमसे संपर्क करें।</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Interactive contact form */}
                        <div className={`p-6 rounded-2xl border space-y-4 ${
                          isDark ? "bg-slate-900 border-slate-800 text-slate-300" : "bg-white border-slate-200 text-slate-700 shadow-sm"
                        }`}>
                          <h3 className="font-display font-bold text-base dark:border-slate-800">संदेश भेजें (Send Message)</h3>
                          {contactSubmitted ? (
                            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 rounded-xl space-y-3 text-center">
                              <CheckCircle className="w-10 h-10 text-emerald-500 mx-auto" />
                              <h4 className="text-sm font-bold text-emerald-800 dark:text-emerald-300">आपका संदेश प्राप्त हो गया है!</h4>
                              <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal">हम आपकी प्रतिक्रिया के लिए आभारी हैं और 48 घंटों के भीतर आपसे संपर्क करेंगे।</p>
                              <button 
                                onClick={() => { setContactSubmitted(false); setContactName(""); setContactEmail(""); setContactMsg(""); }}
                                className="text-xs font-bold text-blue-600 hover:underline pt-2 inline-block"
                              >
                                नया संदेश लिखें
                              </button>
                            </div>
                          ) : (
                            <div className="space-y-4 text-xs">
                              <div className="space-y-1">
                                <label className="font-semibold block text-slate-500">आपका नाम (Your Name):</label>
                                <input 
                                  type="text" 
                                  placeholder="अपना नाम दर्ज करें"
                                  value={contactName}
                                  onChange={(e) => setContactName(e.target.value)}
                                  className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:border-blue-600 ${
                                    isDark ? "bg-slate-950 border-slate-800 text-white" : "bg-slate-50 border-slate-200"
                                  }`}
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="font-semibold block text-slate-500">ईमेल पता (Email Address):</label>
                                <input 
                                  type="email" 
                                  placeholder="example@email.com"
                                  value={contactEmail}
                                  onChange={(e) => setContactEmail(e.target.value)}
                                  className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:border-blue-600 ${
                                    isDark ? "bg-slate-950 border-slate-800 text-white" : "bg-slate-50 border-slate-200"
                                  }`}
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="font-semibold block text-slate-500">विवरण (Message Detail):</label>
                                <textarea 
                                  placeholder="अपना प्रश्न या प्रतिक्रिया विस्तार से यहाँ लिखें..."
                                  value={contactMsg}
                                  onChange={(e) => setContactMsg(e.target.value)}
                                  rows={4}
                                  className={`w-full px-4 py-2.5 rounded-lg border focus:outline-none focus:border-blue-600 ${
                                    isDark ? "bg-slate-950 border-slate-800 text-white" : "bg-slate-50 border-slate-200"
                                  }`}
                                ></textarea>
                              </div>
                              <button
                                onClick={() => {
                                  if (!contactName.trim() || !contactEmail.trim() || !contactMsg.trim()) {
                                    alert("कृपया फॉर्म के सभी फ़ील्ड भरें।");
                                    return;
                                  }
                                  setContactSubmitted(true);
                                }}
                                className="w-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all cursor-pointer"
                              >
                                संदेश भेजें
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Address and Social details card */}
                        <div className="space-y-5 text-xs">
                          <div className={`p-6 rounded-2xl border space-y-4.5 ${
                            isDark ? "bg-slate-900 border-slate-800 text-slate-300" : "bg-white border-slate-200 text-slate-700 shadow-sm"
                          }`}>
                            <h3 className="font-display font-bold text-base">सम्पर्क सूत्र (Contact Information)</h3>
                            <div className="space-y-3 font-sans leading-relaxed">
                              <p>
                                <strong>सम्पर्क नंबर:</strong> +91 9351692300
                              </p>
                              <p>
                                <strong>आधिकारिक ईमेल:</strong> naveenbishnoibanar2007@gmail.com
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* PREMIUM PLATFORM FOOTER */}
                  <footer className="border-t pt-6 text-center text-xs text-slate-400 font-sans mt-12 dark:border-slate-800">
                    <p className="font-semibold text-slate-900 dark:text-white leading-normal">
                      BCA कंप्यूटर बेसिक्स & सी प्रोग्रामिंग डिजिटल पाठ्यपुस्तक
                    </p>
                    <p className="mt-1 leading-normal">
                      राष्ट्रीय शिक्षा नीति (NEP 2020) के अनुरूप विशेष डिजिटल संकलन | प्रो. जितेन्द्र बिश्नोई द्वारा रचित
                    </p>
                    <div className="flex flex-wrap justify-center gap-4 mt-3 text-[10px] text-blue-500">
                      <button onClick={() => setDashboardTab("about")} className="hover:underline">हमारे बारे में</button>
                      <span>•</span>
                      <button onClick={() => setDashboardTab("disclaimer")} className="hover:underline">अस्वीकरण</button>
                      <span>•</span>
                      <button onClick={() => setDashboardTab("contact")} className="hover:underline">सहायता संपर्क</button>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-4 leading-none">
                      {authorBioData.copyright}
                    </p>
                  </footer>

                </motion.div>
              ) : (
                /* DETAIL VIEW: READER AND INTERACTIVE MODULES */
              <motion.div
                key="reader"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-4 md:p-6 lg:p-8 max-w-5xl mx-auto space-y-6"
              >
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center py-24 space-y-4">
                    <div className="relative">
                      <div className="w-12 h-12 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
                      <Cpu className="w-6 h-6 text-blue-600 absolute inset-0 m-auto animate-pulse" />
                    </div>
                    <div className="text-center">
                      <h4 className="text-sm font-semibold text-slate-800 font-display">अध्याय तैयार हो रहा है...</h4>
                      <p className="text-xs text-slate-400 mt-1">AI ट्यूटर आपके लिए सम्पूर्ण अध्ययन सामग्री और प्रश्नोत्तरी तैयार कर रहा है।</p>
                    </div>
                  </div>
                ) : errorMsg ? (
                  <div className="p-6 bg-red-50 border border-red-200 rounded-2xl max-w-lg mx-auto text-center space-y-4">
                    <XCircle className="w-12 h-12 text-red-500 mx-auto" />
                    <div>
                      <h4 className="font-display font-bold text-red-800 text-lg">कनेक्टिविटी समस्या</h4>
                      <p className="text-xs text-red-600 mt-2 leading-relaxed">{errorMsg}</p>
                    </div>
                    <div className="bg-white border border-red-100 p-3 rounded-lg text-left text-xs text-slate-600 space-y-2">
                      <p className="font-semibold text-slate-850">आप अभी क्या कर सकते हैं?</p>
                      <ul className="list-disc list-inside space-y-1 text-slate-500">
                        <li><strong>अध्याय 1</strong> को पूरी तरह से पढ़ें, यह स्थानीय रूप से बिना इंटरनेट के उपलब्ध है।</li>
                        <li>सुनिश्चित करें कि आपने AI Studio के <strong>Settings &gt; Secrets</strong> में <strong>GEMINI_API_KEY</strong> जोड़ दिया है।</li>
                      </ul>
                    </div>
                    <div className="pt-2">
                      <button
                        onClick={() => loadChapter(1)}
                        className="bg-red-600 hover:bg-red-700 text-white text-xs px-4 py-2 rounded-lg font-semibold transition-all inline-flex items-center gap-1.5"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        अध्याय 1 पर वापस जाएँ
                      </button>
                    </div>
                  </div>
                ) : currentChapter ? (
                  /* THE ACTUAL TEXTBOOK WRITTEN DATA & NAVIGATION TABS */
                  <div className="space-y-6">
                    {/* Chapter Header */}
                    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div>
                        <div className="text-xs font-bold text-blue-600 font-mono tracking-wider">अध्याय {currentChapter.number}</div>
                        <h2 className="font-display font-extrabold text-2xl text-slate-900 mt-1">{currentChapter.title}</h2>
                        <p className="text-sm text-slate-400 font-mono mt-0.5">{currentChapter.englishTitle}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] bg-slate-100 text-slate-600 border border-slate-200 px-2.5 py-1 rounded-full font-semibold">
                          BCA Semester I Sessional Notes
                        </span>
                      </div>
                    </div>

                    {/* Navigation Tabs */}
                    <div className="flex overflow-x-auto border-b border-slate-200 gap-1 pb-px no-scrollbar">
                      {[
                        { id: "syllabus", label: "पाठ्यक्रम एवं परिचय", icon: ListOrdered },
                        { id: "theory", label: "विस्तृत थ्योरी", icon: FileText },
                        { id: "diagrams", label: "ब्लॉक आरेख / चित्र", icon: Cpu },
                        { id: "tables", label: "तुलनात्मक तालिकाएं", icon: Table },
                        { id: "examples", label: "वास्तविक उदाहरण", icon: Lightbulb },
                        { id: "code", label: "प्रोग्रामिंग & लैब", icon: Code },
                        { id: "quiz", label: "प्रश्नोत्तरी (MCQ Test)", icon: HelpCircle },
                        { id: "ai-tutor", label: "AI ट्यूटर (Doubts Chat)", icon: MessageSquare },
                      ].map((t) => {
                        const Icon = t.icon;
                        const isActive = activeTab === t.id;
                        return (
                          <button
                            key={t.id}
                            onClick={() => setActiveTab(t.id)}
                            className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold whitespace-nowrap transition-all border-b-2 ${
                              isActive
                                ? "border-blue-600 text-blue-600"
                                : "border-transparent text-slate-500 hover:text-slate-800"
                            }`}
                          >
                            <Icon className="w-4 h-4 shrink-0" />
                            <span>{t.label}</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* TAB WINDOWS */}
                    <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm">
                      
                      {/* TAB 1: SYLLABUS & INTRODUCTION */}
                      {activeTab === "syllabus" && (
                        <div className="space-y-6">
                          <div>
                            <h3 className="font-display font-bold text-slate-900 text-lg mb-4 flex items-center gap-2 text-blue-700">
                              <ListOrdered className="w-5 h-5 text-blue-600" />
                              सीखने के उद्देश्य (Learning Objectives)
                            </h3>
                            <ul className="space-y-3">
                              {currentChapter.learningObjectives.map((obj, i) => (
                                <li key={i} className="flex gap-3 text-slate-700 text-sm leading-relaxed items-start">
                                  <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 text-[10px] font-bold flex items-center justify-center mt-0.5 shrink-0">
                                    {i + 1}
                                  </span>
                                  <span>{obj}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <hr className="border-slate-100" />

                          <div>
                            <h3 className="font-display font-bold text-slate-900 text-lg mb-4 flex items-center gap-2 text-blue-700">
                              <Bookmark className="w-5 h-5 text-blue-600" />
                              प्रस्तावना / परिचय (Introduction)
                            </h3>
                            <p className="text-sm text-slate-700 leading-relaxed font-sans text-justify">
                              {currentChapter.introduction}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* TAB 2: THEORY SECTIONS */}
                      {activeTab === "theory" && (
                        <div className="space-y-8">
                          {currentChapter.theorySections.map((sec) => (
                            <div key={sec.id} className="space-y-4">
                              <div className="border-l-4 border-blue-600 pl-4 py-1.5 bg-slate-50/50 pr-4 rounded-r-lg">
                                <h3 className="font-display font-bold text-slate-900 text-lg">
                                  {sec.title}
                                </h3>
                                {sec.englishTitle && (
                                  <p className="text-xs text-slate-400 font-mono mt-0.5">{sec.englishTitle}</p>
                                )}
                              </div>
                              <div className="text-sm text-slate-700 leading-relaxed space-y-4 text-justify pl-4">
                                {sec.content.split("\n\n").map((para, pIdx) => {
                                  const trimmed = para.trim();
                                  let boxStyle = "";
                                  
                                  if (trimmed.startsWith("📌")) {
                                    boxStyle = "bg-indigo-50/80 border-l-4 border-indigo-600 p-4 my-4 rounded-r-xl shadow-sm text-indigo-950 font-sans";
                                  } else if (trimmed.startsWith("💡")) {
                                    boxStyle = "bg-amber-50/80 border-l-4 border-amber-500 p-4 my-4 rounded-r-xl shadow-sm text-amber-950 font-sans";
                                  } else if (trimmed.startsWith("⚠️")) {
                                    boxStyle = "bg-rose-50/80 border-l-4 border-rose-500 p-4 my-4 rounded-r-xl shadow-sm text-rose-950 font-sans";
                                  } else if (trimmed.startsWith("📝")) {
                                    boxStyle = "bg-slate-50 border-l-4 border-slate-500 p-4 my-4 rounded-r-xl shadow-sm text-slate-800 font-sans";
                                  } else if (trimmed.startsWith("⭐")) {
                                    boxStyle = "bg-emerald-50/80 border-l-4 border-emerald-500 p-4 my-4 rounded-r-xl shadow-sm text-emerald-950 font-sans";
                                  } else if (trimmed.startsWith("👉")) {
                                    boxStyle = "bg-sky-50/80 border-l-4 border-sky-500 p-4 my-4 rounded-r-xl shadow-sm text-sky-950 font-sans";
                                  }

                                  const parts = para.split("**").map((part, i) => (
                                    i % 2 === 1 ? <strong key={i} className="text-blue-900 font-extrabold">{part}</strong> : part
                                  ));

                                  if (boxStyle) {
                                    return (
                                      <div key={pIdx} className={boxStyle}>
                                        {parts}
                                      </div>
                                    );
                                  }

                                  return (
                                    <p key={pIdx} className="text-justify text-slate-700 leading-relaxed font-sans">
                                      {parts}
                                    </p>
                                  );
                                })}
                              </div>

                              {/* Subsections if any */}
                              {sec.subsections && sec.subsections.length > 0 && (
                                <div className="pl-8 space-y-6 mt-4 border-l border-slate-200">
                                  {sec.subsections.map((sub, sIdx) => (
                                    <div key={sIdx} className="space-y-2">
                                      <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                                        <ChevronRight className="w-4 h-4 text-slate-400" />
                                        <span>{sub.title}</span>
                                        {sub.englishTitle && (
                                          <span className="text-xs text-slate-400 font-mono">({sub.englishTitle})</span>
                                        )}
                                      </h4>
                                      <p className="text-xs text-slate-600 leading-relaxed pl-6">
                                        {sub.content}
                                      </p>
                                      {sub.code && (
                                        <div className="pl-6 pt-2">
                                          <pre className="p-4 bg-slate-900 text-slate-100 rounded-lg text-xs font-mono overflow-x-auto shadow-md">
                                            {sub.code}
                                          </pre>
                                          {sub.codeExplanation && (
                                            <p className="text-[11px] text-slate-500 italic mt-1.5 pl-2 border-l-2 border-slate-300">
                                              {sub.codeExplanation}
                                            </p>
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* TAB 3: DIAGRAMS */}
                      {activeTab === "diagrams" && (
                        <div className="space-y-8">
                          {currentChapter.diagrams.map((diag) => (
                            <div key={diag.id} className="space-y-4">
                              <h3 className="font-display font-bold text-slate-900 text-lg text-blue-700">
                                {diag.title}
                              </h3>
                              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-inner overflow-x-auto">
                                <pre className="font-mono text-xs text-slate-300 leading-relaxed whitespace-pre">
                                  {diag.ascii}
                                </pre>
                              </div>
                              <p className="text-xs text-slate-500 leading-relaxed italic border-l-2 border-blue-500 pl-3">
                                <strong>चित्र विवरण:</strong> {diag.description}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* TAB 4: COMPARISON TABLES */}
                      {activeTab === "tables" && (
                        <div className="space-y-8">
                          {currentChapter.tables.map((table) => (
                            <div key={table.id} className="space-y-4">
                              <h3 className="font-display font-bold text-slate-900 text-lg text-blue-700">
                                {table.title}
                              </h3>
                              <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                                <table className="w-full text-left text-xs">
                                  <thead className="bg-slate-100 text-blue-800 font-bold border-b border-slate-200">
                                    <tr>
                                      {table.headers.map((hdr, hIdx) => (
                                        <th key={hIdx} className="p-3 font-semibold uppercase">{hdr}</th>
                                      ))}
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-slate-200">
                                    {table.rows.map((row, rIdx) => (
                                      <tr key={rIdx} className="hover:bg-slate-50">
                                        <td className="p-3 font-bold text-slate-900 border-r border-slate-200">{row.parameter}</td>
                                        <td className="p-3 text-slate-700 border-r border-slate-200 leading-relaxed">{row.col1}</td>
                                        <td className="p-3 text-slate-700 border-r border-slate-200 leading-relaxed">{row.col2}</td>
                                        {row.col3 && <td className="p-3 text-slate-700 border-r border-slate-200 leading-relaxed">{row.col3}</td>}
                                        {row.col4 && <td className="p-3 text-slate-700 leading-relaxed">{row.col4}</td>}
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          ))}

                          {currentChapter.shortcutKeys && currentChapter.shortcutKeys.length > 0 && (
                            <div className="space-y-4 pt-6 border-t border-slate-200 mt-6">
                              <h3 className="font-display font-bold text-slate-900 text-lg text-indigo-750 flex items-center gap-2">
                                <Keyboard className="w-5 h-5 text-indigo-600" />
                                महत्वपूर्ण शॉर्टकट कुंजियाँ (Essential Keyboard Shortcuts)
                              </h3>
                              <p className="text-xs text-slate-500 italic font-sans pl-1">
                                परीक्षा और प्रयोगशाला (Lab) कार्यों में गति बढ़ाने के लिए इन शॉर्टकट कुंजियों का अभ्यास अवश्य करें।
                              </p>
                              <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                                <table className="w-full text-left text-xs">
                                  <thead className="bg-indigo-50/70 text-indigo-900 font-bold border-b border-slate-200">
                                    <tr>
                                      <th className="p-3 font-semibold uppercase">शॉर्टकट की (Shortcut Key)</th>
                                      <th className="p-3 font-semibold uppercase">कार्य / क्रिया (Action Perform)</th>
                                      <th className="p-3 font-semibold uppercase">विवरण (Description)</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-slate-200 bg-white">
                                    {currentChapter.shortcutKeys.map((sh, sIdx) => (
                                      <tr key={sIdx} className="hover:bg-indigo-50/20 font-sans">
                                        <td className="p-3 font-mono font-bold text-blue-600 border-r border-slate-200 select-all">
                                          <kbd className="px-2 py-1 bg-slate-150 border border-slate-300 rounded shadow-sm text-[11px] font-mono">{sh.key}</kbd>
                                        </td>
                                        <td className="p-3 font-bold text-slate-900 border-r border-slate-200">{sh.action}</td>
                                        <td className="p-3 text-slate-600 leading-relaxed">{sh.description || "-"}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* TAB 5: ANALOGIES & POINTS */}
                      {activeTab === "examples" && (
                        <div className="space-y-8">
                          {/* Analogies */}
                          <div className="space-y-4">
                            <h3 className="font-display font-bold text-slate-900 text-lg flex items-center gap-2 text-blue-700">
                              <Lightbulb className="w-5 h-5 text-blue-600" />
                              दैनिक जीवन के उदाहरण (Real Life Analogies)
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              {currentChapter.realLifeExamples.map((ex) => (
                                <div key={ex.id} className="bg-amber-50/50 border border-amber-200 rounded-xl p-5 shadow-sm space-y-3">
                                  <div className="flex items-center gap-2 text-amber-800 font-semibold text-sm">
                                    <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
                                    <span>अवधारणा: {ex.concept}</span>
                                  </div>
                                  <div className="text-xs bg-amber-100/50 text-amber-900 border border-amber-200/50 px-2.5 py-1 rounded inline-block font-bold">
                                    दैनिक सादृश्य: {ex.analogy}
                                  </div>
                                  <p className="text-xs text-amber-900 leading-relaxed">
                                    {ex.hindiExplanation}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>

                          <hr className="border-slate-100" />

                          {/* Important Points */}
                          <div className="space-y-4">
                            <h3 className="font-display font-bold text-slate-900 text-lg flex items-center gap-2 text-blue-700">
                              <Award className="w-5 h-5 text-blue-600" />
                              स्मरण रखने योग्य महत्वपूर्ण बिंदु (Key Points)
                            </h3>
                            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                              {currentChapter.importantPoints.map((pt, pIdx) => (
                                <div key={pIdx} className="flex gap-2.5 text-xs text-slate-700 leading-relaxed">
                                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                                  <span>{pt}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* TAB 6: CODING & LAB PRACTICALS */}
                      {activeTab === "code" && (
                        <div className="space-y-8">
                          {/* Programming Examples */}
                          {currentChapter.programmingExamples && currentChapter.programmingExamples.length > 0 && (
                            <div className="space-y-4">
                              <h3 className="font-display font-bold text-slate-900 text-lg flex items-center gap-2 text-blue-700">
                                <Code className="w-5 h-5 text-blue-600" />
                                प्रोग्रामिंग उदाहरण (C Programming Examples)
                              </h3>
                              <div className="flex gap-2 overflow-x-auto pb-2 border-b border-slate-100">
                                {currentChapter.programmingExamples.map((ex) => (
                                  <button
                                    key={ex.id}
                                    onClick={() => {
                                      setSelectedProgExample(ex);
                                      setSimulatorOutput("");
                                      setManualSubTab("aim");
                                    }}
                                    className={`px-3 py-1.5 text-xs rounded-lg whitespace-nowrap transition-all border font-semibold ${
                                      selectedProgExample?.id === ex.id
                                        ? "bg-blue-600 text-white border-blue-600"
                                        : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                                    }`}
                                  >
                                    {ex.title}
                                  </button>
                                ))}
                              </div>

                              {selectedProgExample && (
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
                                  {/* Code Block with simulated terminal output */}
                                  <div className="space-y-3">
                                    <div className="bg-slate-950 border border-slate-800 rounded-xl shadow-lg overflow-hidden flex flex-col h-[400px]">
                                      <div className="bg-slate-900 border-b border-slate-800 px-4 py-2 flex items-center justify-between">
                                        <span className="text-[10px] text-slate-400 font-mono">GCC Compiler (Virtual)</span>
                                        <button
                                          onClick={() => runCodeSimulation(selectedProgExample.code, selectedProgExample.output)}
                                          disabled={isRunningCode}
                                          className="bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-800 text-white text-[11px] font-semibold px-2.5 py-1 rounded flex items-center gap-1.5 transition-all"
                                        >
                                          <Play className="w-3 h-3 fill-white" />
                                          <span>{isRunningCode ? "कंपाइल हो रहा..." : "रन करें (Run)"}</span>
                                        </button>
                                      </div>
                                      <div className="flex-1 overflow-auto p-4">
                                        <pre className="font-mono text-xs text-slate-200 leading-normal">
                                          {selectedProgExample.code}
                                        </pre>
                                      </div>
                                    </div>

                                    {/* Terminal simulator output */}
                                    <div className="bg-slate-950 border border-slate-900 rounded-xl p-4 h-[120px] shadow-inner overflow-y-auto">
                                      <div className="text-[10px] text-emerald-500 font-mono uppercase mb-1 flex items-center gap-1.5">
                                        <Terminal className="w-3.5 h-3.5" />
                                        <span>कमांड कंसोल आउटपुट (Terminal Output)</span>
                                      </div>
                                      <pre className="font-mono text-[11px] text-slate-300 whitespace-pre-wrap leading-tight">
                                        {simulatorOutput || "रन बटन पर क्लिक कर आउटपुट परिणाम देखें।"}
                                      </pre>
                                    </div>
                                  </div>

                                  {/* University Practical Manual with 20 Required Sections */}
                                  <div className="space-y-4">
                                    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                                      {/* Header banner */}
                                      <div className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white px-5 py-4">
                                        <div className="text-[10px] font-bold uppercase tracking-wider text-blue-100 font-mono">
                                          BCA UNIVERSITY PRACTICAL MANUAL
                                        </div>
                                        <h4 className="font-display font-black text-sm mt-1 flex items-center gap-2">
                                          <GraduationCap className="w-5 h-5 text-yellow-400" />
                                          <span>व्यावहारिक प्रयोग नियमावली (20-Point Lab Manual)</span>
                                        </h4>
                                      </div>

                                      {/* Sub-tab Selection */}
                                      <div className="bg-slate-50 border-b border-slate-200 flex overflow-x-auto">
                                        <button
                                          onClick={() => setManualSubTab("aim")}
                                          className={`px-4 py-3 text-xs font-bold border-b-2 whitespace-nowrap transition-all flex items-center gap-1.5 ${
                                            manualSubTab === "aim"
                                              ? "border-blue-600 text-blue-600 bg-white"
                                              : "border-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                                          }`}
                                        >
                                          <Target className="w-4 h-4" />
                                          उद्देश्य व फ्लोचार्ट
                                        </button>
                                        <button
                                          onClick={() => setManualSubTab("exec")}
                                          className={`px-4 py-3 text-xs font-bold border-b-2 whitespace-nowrap transition-all flex items-center gap-1.5 ${
                                            manualSubTab === "exec"
                                              ? "border-blue-600 text-blue-600 bg-white"
                                              : "border-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                                          }`}
                                        >
                                          <Cpu className="w-4 h-4" />
                                          व्याख्या व जटिलता
                                        </button>
                                        <button
                                          onClick={() => setManualSubTab("viva")}
                                          className={`px-4 py-3 text-xs font-bold border-b-2 whitespace-nowrap transition-all flex items-center gap-1.5 ${
                                            manualSubTab === "viva"
                                              ? "border-blue-600 text-blue-600 bg-white"
                                              : "border-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                                          }`}
                                        >
                                          <HelpCircle className="w-4 h-4" />
                                          वाइवा व एमसीक्यू
                                        </button>
                                        <button
                                          onClick={() => setManualSubTab("notes")}
                                          className={`px-4 py-3 text-xs font-bold border-b-2 whitespace-nowrap transition-all flex items-center gap-1.5 ${
                                            manualSubTab === "notes"
                                              ? "border-blue-600 text-blue-600 bg-white"
                                              : "border-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                                          }`}
                                        >
                                          <AlertTriangle className="w-4 h-4" />
                                          डिबगिंग व नोट्स
                                        </button>
                                      </div>

                                      {/* Sub-tab Contents */}
                                      <div className="p-5 space-y-5 max-h-[550px] overflow-y-auto">
                                        {/* TAB 1: AIM & DESIGN */}
                                        {manualSubTab === "aim" && (
                                          <div className="space-y-4">
                                            {/* Aim */}
                                            <div className="bg-blue-50/50 border border-blue-100 rounded-lg p-4 space-y-2">
                                              <span className="text-[10px] font-bold text-blue-800 uppercase tracking-wide font-mono">1. उद्देश्य (Aim)</span>
                                              <p className="text-xs font-bold text-slate-800 leading-relaxed text-justify">
                                                {(selectedProgExample as any).aim || "C प्रोग्राम का उद्देश्य"}
                                              </p>
                                            </div>

                                            {/* Chapter Reference */}
                                            {(selectedProgExample as any).chapterReference && (
                                              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 flex justify-between items-center text-xs">
                                                <span className="font-semibold text-slate-600">20. अध्याय संदर्भ (Chapter Reference):</span>
                                                <span className="font-bold text-blue-700 bg-blue-100 px-2.5 py-0.5 rounded-full text-[10px]">
                                                  {(selectedProgExample as any).chapterReference}
                                                </span>
                                              </div>
                                            )}

                                            {/* Theory */}
                                            <div className="space-y-1.5">
                                              <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">2. सिद्धांत (Theory)</h5>
                                              <p className="text-xs text-slate-600 leading-relaxed text-justify whitespace-pre-wrap">
                                                {(selectedProgExample as any).theory}
                                              </p>
                                            </div>

                                            {/* Algorithm */}
                                            <div className="space-y-1.5">
                                              <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">3. एल्गोरिथ्म (Algorithm)</h5>
                                              <div className="bg-slate-950 text-slate-200 rounded-lg p-3 font-mono text-[11px] leading-relaxed whitespace-pre-wrap">
                                                {(selectedProgExample as any).algorithm}
                                              </div>
                                            </div>

                                            {/* Flowchart */}
                                            <div className="space-y-1.5">
                                              <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">4. प्रवाह आरेख (Flowchart)</h5>
                                              <div className="bg-slate-900 text-emerald-400 rounded-lg p-4 font-mono text-[10px] leading-tight overflow-x-auto whitespace-pre">
                                                {(selectedProgExample as any).flowchart}
                                              </div>
                                            </div>

                                            {/* Real Life Example */}
                                            <div className="border border-amber-200 bg-amber-50/30 rounded-lg p-4 space-y-2">
                                              <span className="text-[10px] font-black text-amber-800 uppercase tracking-wide font-mono flex items-center gap-1">
                                                <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
                                                11. वास्तविक जीवन का उदाहरण (Real Life Analogy)
                                              </span>
                                              <p className="text-xs text-slate-700 leading-relaxed text-justify">
                                                {(selectedProgExample as any).realLifeExample}
                                              </p>
                                            </div>
                                          </div>
                                        )}

                                        {/* TAB 2: EXPLANATION & TRACE */}
                                        {manualSubTab === "exec" && (
                                          <div className="space-y-4">
                                            {/* Line-by-line explanation */}
                                            <div className="space-y-2">
                                              <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono flex items-center gap-1">
                                                <Check className="w-4 h-4 text-emerald-500" />
                                                6. लाइन-दर-लाइन व्याख्या (Line-by-line Explanation)
                                              </h5>
                                              <div className="text-xs text-slate-600 leading-relaxed whitespace-pre-wrap text-justify">
                                                {selectedProgExample.explanation}
                                              </div>
                                            </div>

                                            {/* Dry Run */}
                                            <div className="space-y-1.5">
                                              <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">7. ड्राय रन (Dry Run / Trace)</h5>
                                              <div className="bg-indigo-950 text-indigo-200 rounded-lg p-4 font-mono text-[11px] leading-relaxed whitespace-pre-wrap">
                                                {(selectedProgExample as any).dryRun}
                                              </div>
                                            </div>

                                            {/* Output Explanation */}
                                            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-1.5">
                                              <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wider font-mono font-sans">19. परिणाम की व्याख्या (Output Explanation)</span>
                                              <p className="text-xs text-slate-600 leading-relaxed text-justify">
                                                {(selectedProgExample as any).outputExplanation}
                                              </p>
                                            </div>

                                            {/* Complexity Analysis */}
                                            <div className="grid grid-cols-2 gap-4 pt-1">
                                              <div className="border border-slate-200 rounded-lg p-3.5 space-y-1">
                                                <span className="text-[10px] font-bold text-indigo-700 uppercase font-mono">9. समय जटिलता (Time Complexity)</span>
                                                <p className="text-xs text-slate-700 leading-snug">{(selectedProgExample as any).timeComplexity}</p>
                                              </div>
                                              <div className="border border-slate-200 rounded-lg p-3.5 space-y-1">
                                                <span className="text-[10px] font-bold text-indigo-700 uppercase font-mono">10. स्थान जटिलता (Space Complexity)</span>
                                                <p className="text-xs text-slate-700 leading-snug">{(selectedProgExample as any).spaceComplexity}</p>
                                              </div>
                                            </div>
                                          </div>
                                        )}

                                        {/* TAB 3: VIVA & MCQS */}
                                        {manualSubTab === "viva" && (
                                          <div className="space-y-5">
                                            {/* Viva Questions */}
                                            <div className="space-y-3">
                                              <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">12. मौखिकी प्रश्न (Viva Questions)</h5>
                                              <div className="space-y-2.5">
                                                {(selectedProgExample as any).vivaQuestions && (selectedProgExample as any).vivaQuestions.map((vq: any, idx: number) => (
                                                  <div key={idx} className="border border-slate-200 rounded-lg p-3.5 space-y-2 bg-slate-50">
                                                    <div className="text-xs font-bold text-blue-800 flex gap-1.5 text-justify">
                                                      <span>Q{idx+1}:</span>
                                                      <span>{vq.question}</span>
                                                    </div>
                                                    <div className="text-xs text-slate-600 leading-relaxed border-t border-slate-150 pt-2 text-justify pl-1.5">
                                                      <strong>उत्तर (Ans):</strong> {vq.answer}
                                                    </div>
                                                  </div>
                                                ))}
                                              </div>
                                            </div>

                                            {/* Interactive MCQs */}
                                            <div className="space-y-3">
                                              <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">13. बहुविकल्पीय प्रश्न (Interactive MCQs)</h5>
                                              <div className="space-y-4">
                                                {(selectedProgExample as any).mcqs && (selectedProgExample as any).mcqs.map((m: any, mIdx: number) => {
                                                  const mcqKey = `manual_${selectedProgExample.id}_${mIdx}`;
                                                  const selectedAns = manualMcqAnswers[mcqKey];
                                                  const isAnswered = selectedAns !== undefined;
                                                  
                                                  return (
                                                    <div key={mIdx} className="border border-slate-200 rounded-xl p-4 space-y-3">
                                                      <p className="text-xs font-bold text-slate-800 text-justify font-sans">
                                                        Q{mIdx+1}: {m.question}
                                                      </p>
                                                      <div className="grid grid-cols-1 gap-2">
                                                        {m.options.map((opt: string, oIdx: number) => {
                                                          let optColor = "bg-white border-slate-200 hover:bg-slate-50 text-slate-700";
                                                          if (isAnswered) {
                                                            if (oIdx === m.correctIndex) {
                                                              optColor = "bg-emerald-50 border-emerald-300 text-emerald-800 font-semibold";
                                                            } else if (oIdx === selectedAns) {
                                                              optColor = "bg-rose-50 border-rose-300 text-rose-800";
                                                            } else {
                                                              optColor = "bg-slate-50 border-slate-200 opacity-60 text-slate-500";
                                                            }
                                                          }
                                                          return (
                                                            <button
                                                              key={oIdx}
                                                              disabled={isAnswered}
                                                              onClick={() => setManualMcqAnswers(prev => ({ ...prev, [mcqKey]: oIdx }))}
                                                              className={`w-full text-left text-xs p-2.5 rounded-lg border font-medium transition-all ${optColor}`}
                                                            >
                                                              {String.fromCharCode(65 + oIdx)}) {opt}
                                                            </button>
                                                          );
                                                        })}
                                                      </div>
                                                      {isAnswered && (
                                                        <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 text-[11px] text-blue-800 leading-normal text-justify">
                                                          <strong>व्याख्या:</strong> {m.explanation}
                                                        </div>
                                                      )}
                                                    </div>
                                                  );
                                                })}
                                              </div>
                                            </div>

                                            {/* Practice Questions */}
                                            <div className="space-y-2">
                                              <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono font-sans">14. अभ्यास प्रश्न (Practice Questions)</h5>
                                              <ul className="list-disc list-inside space-y-1 text-xs text-slate-600 pl-2">
                                                {(selectedProgExample as any).practiceQuestions && (selectedProgExample as any).practiceQuestions.map((pq: string, pqi: number) => (
                                                  <li key={pqi} className="text-justify font-sans">{pq}</li>
                                                ))}
                                              </ul>
                                            </div>

                                            {/* Expected University Questions */}
                                            <div className="space-y-2">
                                              <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono font-sans">17. संभावित विश्वविद्यालय परीक्षा प्रश्न</h5>
                                              <ul className="list-disc list-inside space-y-1 text-xs text-slate-600 pl-2">
                                                {(selectedProgExample as any).examQuestions && (selectedProgExample as any).examQuestions.map((eq: string, eqi: number) => (
                                                  <li key={eqi} className="text-justify font-sans">{eq}</li>
                                                ))}
                                              </ul>
                                            </div>
                                          </div>
                                        )}

                                        {/* TAB 4: TIPS & NOTES */}
                                        {manualSubTab === "notes" && (
                                          <div className="space-y-4">
                                            {/* Common Errors */}
                                            <div className="bg-rose-50/50 border border-rose-100 rounded-lg p-4 space-y-2">
                                              <span className="text-[10px] font-black text-rose-800 uppercase tracking-wide font-mono flex items-center gap-1">
                                                <AlertOctagon className="w-3.5 h-3.5 text-rose-600" />
                                                15. सामान्य त्रुटियाँ और डिबगिंग टिप्स
                                              </span>
                                              <p className="text-xs text-slate-700 leading-relaxed text-justify whitespace-pre-wrap">
                                                {(selectedProgExample as any).commonErrors}
                                              </p>
                                            </div>

                                            {/* Important Notes */}
                                            <div className="bg-emerald-50/30 border border-emerald-100 rounded-lg p-4 space-y-2">
                                              <span className="text-[10px] font-black text-emerald-800 uppercase tracking-wide font-mono flex items-center gap-1">
                                                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                                                16. महत्वपूर्ण बिंदु (Important Notes)
                                              </span>
                                              <p className="text-xs text-slate-700 leading-relaxed text-justify whitespace-pre-wrap">
                                                {(selectedProgExample as any).importantNotes}
                                              </p>
                                            </div>

                                            {/* Alternative Solution */}
                                            {(selectedProgExample as any).alternativeSolution && (
                                              <div className="space-y-1.5">
                                                <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">18. वैकल्पिक समाधान (Alternative Solution)</h5>
                                                <div className="bg-slate-950 text-slate-300 rounded-lg p-4 font-mono text-[11px] leading-relaxed whitespace-pre-wrap overflow-x-auto">
                                                  {(selectedProgExample as any).alternativeSolution}
                                                </div>
                                              </div>
                                            )}
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}

                          <hr className="border-slate-100" />

                          {/* Lab Practicals */}
                          <div className="space-y-4">
                            <h3 className="font-display font-bold text-slate-900 text-lg flex items-center gap-2 text-blue-700">
                              <Terminal className="w-5 h-5 text-blue-600" />
                              प्रयोगशाला अभ्यास (Lab Exercises & Practicals)
                            </h3>
                            <div className="space-y-4">
                              {currentChapter.practicals.map((prac, pIdx) => (
                                <div key={pIdx} className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-3">
                                  <h4 className="text-sm font-bold text-slate-900">
                                    प्रयोग {pIdx + 1}: {prac.title}
                                  </h4>
                                  <div className="space-y-2 pl-4">
                                    <strong>कदम (Steps):</strong>
                                    <ul className="list-decimal list-inside space-y-1.5 text-xs text-slate-600">
                                      {prac.steps.map((st, sIdx) => (
                                        <li key={sIdx}>{st}</li>
                                      ))}
                                    </ul>
                                  </div>
                                  {prac.expectedOutput && (
                                    <div className="pl-4">
                                      <strong>अपेक्षित परिणाम (Expected Outcome):</strong>
                                      <p className="text-xs text-slate-500 italic mt-1 bg-white p-2 border border-slate-150 rounded">
                                        {prac.expectedOutput}
                                      </p>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* TAB 7: MCQS & SEMESTER QUESTIONS */}
                      {activeTab === "quiz" && (
                        <div className="space-y-8">
                          {/* MCQ Section */}
                          <div className="space-y-6">
                            <h3 className="font-display font-bold text-slate-900 text-lg flex items-center gap-2 text-blue-700">
                              <HelpCircle className="w-5 h-5 text-blue-600" />
                              स्व-मूल्यांकन बहुविकल्पीय प्रश्नोत्तरी (MCQ Test)
                            </h3>
                            <div className="space-y-6">
                              {currentChapter.mcqs.map((mcq, mIdx) => {
                                const isCorrect = quizAnswers[mcq.id] === mcq.correctIndex;
                                return (
                                  <div key={mcq.id} className="space-y-3 p-4 bg-slate-50 border border-slate-200 rounded-xl">
                                    <div className="text-xs font-bold text-slate-500 font-mono">प्रश्न {mIdx + 1} of {currentChapter.mcqs.length}</div>
                                    <p className="text-xs font-bold text-slate-900 leading-relaxed">{mcq.question}</p>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                      {mcq.options.map((opt, oIdx) => {
                                        const isSelected = quizAnswers[mcq.id] === oIdx;
                                        return (
                                          <button
                                            key={oIdx}
                                            disabled={quizSubmitted}
                                            onClick={() => {
                                              setQuizAnswers((prev) => ({ ...prev, [mcq.id]: oIdx }));
                                            }}
                                            className={`text-left p-3 rounded-lg text-xs font-semibold transition-all border flex items-center justify-between ${
                                              quizSubmitted
                                                ? oIdx === mcq.correctIndex
                                                  ? "bg-emerald-50 border-emerald-300 text-emerald-800"
                                                  : isSelected
                                                  ? "bg-red-50 border-red-300 text-red-800"
                                                  : "bg-white border-slate-200 text-slate-500"
                                                : isSelected
                                                ? "bg-blue-50 border-blue-400 text-blue-800"
                                                : "bg-white border-slate-200 hover:bg-slate-100 text-slate-700"
                                            }`}
                                          >
                                            <span>{opt}</span>
                                            {quizSubmitted ? (
                                              oIdx === mcq.correctIndex ? (
                                                <Check className="w-4 h-4 text-emerald-600" />
                                              ) : isSelected ? (
                                                <X className="w-4 h-4 text-red-600" />
                                              ) : null
                                            ) : isSelected ? (
                                              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                                            ) : null}
                                          </button>
                                        );
                                      })}
                                    </div>

                                    {/* Explanation shown after quiz submit */}
                                    {quizSubmitted && (
                                      <div className="mt-3 p-3 bg-blue-50 border border-blue-100 rounded-lg text-[11px] text-blue-800 leading-normal pl-4 border-l-4 border-l-blue-500 font-sans">
                                        <strong>स्पष्टीकरण (Hindi Explanation):</strong> {mcq.explanation}
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>

                            {/* Submit and Quiz Score panel */}
                            <div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-blue-50 border border-blue-100 rounded-2xl gap-4">
                              <div>
                                <h4 className="text-xs font-bold text-blue-900">अपने ज्ञान का परीक्षण करें!</h4>
                                <p className="text-[10px] text-blue-700 mt-1 leading-normal">
                                  सभी बहुविकल्पीय प्रश्नों के उत्तर चुनने के बाद सबमिट बटन पर क्लिक कर स्कोर और विस्तृत विश्लेषण देखें।
                                </p>
                              </div>
                              <div className="flex items-center gap-3 shrink-0">
                                {quizSubmitted ? (
                                  <div className="flex items-center gap-3">
                                    <div className="text-xs font-semibold text-slate-700 font-sans">
                                      स्कोर: <strong className="text-blue-700 text-sm font-mono">{quizScore} / {currentChapter.mcqs.length}</strong>
                                    </div>
                                    <button
                                      onClick={() => {
                                        setQuizAnswers({});
                                        setQuizSubmitted(false);
                                        setQuizScore(0);
                                      }}
                                      className="bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 text-xs px-4 py-2 rounded-lg font-semibold transition-all shadow-sm flex items-center gap-1.5"
                                    >
                                      <RotateCcw className="w-3.5 h-3.5" />
                                      रिसेट करें
                                    </button>
                                  </div>
                                ) : (
                                  <button
                                    onClick={submitQuiz}
                                    className="bg-blue-600 hover:bg-blue-500 text-white text-xs px-5 py-2.5 rounded-lg font-semibold transition-all shadow-md shadow-blue-600/20"
                                  >
                                    क्विज सबमिट करें
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>

                          <hr className="border-slate-100" />

                          {/* Theory Questions & Semester Style */}
                          <div className="space-y-6">
                            <div className="flex items-center justify-between border-b border-slate-150 pb-3">
                              <h3 className="font-display font-bold text-slate-900 text-lg flex items-center gap-2 text-blue-700">
                                <FileText className="w-5 h-5 text-blue-600" />
                                विश्वविद्यालय परीक्षा अभ्यास (Semester Exam Style Questions)
                              </h3>
                              <span className="text-[10px] bg-red-100 text-red-800 font-bold px-2.5 py-1 rounded-full uppercase tracking-wider font-sans">
                                ★ मुख्य परीक्षा प्रश्न
                              </span>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              {/* 1. अति-लघु उत्तरीय प्रश्न */}
                              <div className="border border-slate-200 rounded-xl p-5 bg-gradient-to-br from-white to-slate-50/50 shadow-sm space-y-3">
                                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                                  <h4 className="text-xs font-bold text-blue-700 uppercase tracking-wider flex items-center gap-1.5">
                                    <span className="bg-blue-100 text-blue-800 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono">A</span>
                                    अति-लघु उत्तरीय प्रश्न (Very Short - 2 Marks)
                                  </h4>
                                </div>
                                <ul className="space-y-2 list-disc list-inside text-xs text-slate-600 pl-1">
                                  {(currentChapter.semesterQuestions.veryShort || [
                                    "कंप्यूटर को परिभाषित कीजिए।",
                                    "ALU का पूरा नाम क्या है?",
                                    "GIGO सिद्धांत क्या है?",
                                    "रैम (RAM) और रोम (ROM) में मुख्य अंतर लिखिए।"
                                  ]).map((q, i) => (
                                    <li key={i} className="leading-relaxed hover:text-slate-900 transition-colors">{q}</li>
                                  ))}
                                </ul>
                              </div>

                              {/* 2. लघु उत्तरीय प्रश्न */}
                              <div className="border border-slate-200 rounded-xl p-5 bg-gradient-to-br from-white to-slate-50/50 shadow-sm space-y-3">
                                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                                  <h4 className="text-xs font-bold text-indigo-700 uppercase tracking-wider flex items-center gap-1.5">
                                    <span className="bg-indigo-100 text-indigo-800 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono">B</span>
                                    लघु उत्तरीय प्रश्न (Short Answer - 5 Marks)
                                  </h4>
                                </div>
                                <ul className="space-y-2 list-disc list-inside text-xs text-slate-600 pl-1">
                                  {currentChapter.semesterQuestions.short.map((q, i) => (
                                    <li key={i} className="leading-relaxed hover:text-slate-900 transition-colors">{q}</li>
                                  ))}
                                </ul>
                              </div>

                              {/* 3. दीर्घ उत्तरीय प्रश्न */}
                              <div className="border border-slate-200 rounded-xl p-5 bg-gradient-to-br from-white to-slate-50/50 shadow-sm space-y-3 md:col-span-1">
                                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                                  <h4 className="text-xs font-bold text-purple-700 uppercase tracking-wider flex items-center gap-1.5">
                                    <span className="bg-purple-100 text-purple-800 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono">C</span>
                                    दीर्घ उत्तरीय प्रश्न (Long Answer - 10-15 Marks)
                                  </h4>
                                </div>
                                <ul className="space-y-2 list-disc list-inside text-xs text-slate-600 pl-1">
                                  {currentChapter.semesterQuestions.long.map((q, i) => (
                                    <li key={i} className="leading-relaxed hover:text-slate-900 transition-colors">{q}</li>
                                  ))}
                                </ul>
                              </div>

                              {/* 4. संख्यात्मक एवं तार्किक प्रश्न */}
                              <div className="border border-slate-200 rounded-xl p-5 bg-gradient-to-br from-white to-slate-50/50 shadow-sm space-y-3 md:col-span-1">
                                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                                  <h4 className="text-xs font-bold text-emerald-700 uppercase tracking-wider flex items-center gap-1.5">
                                    <span className="bg-emerald-100 text-emerald-800 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono">D</span>
                                    संख्यात्मक एवं तार्किक अभ्यास (Numerical / Tracing)
                                  </h4>
                                </div>
                                <ul className="space-y-2 list-disc list-inside text-xs text-slate-600 pl-1">
                                  {(currentChapter.semesterQuestions.numerical || [
                                    "बाइनरी संख्या (110111)2 को दशमलव (Decimal) में बदलिए।",
                                    "अष्टक संख्या (Octal) (75)8 को बाइनरी में बदलिए।",
                                    "हेक्साडेसिमल (A4B)16 को दशमलव में बदलिए।",
                                    "कंप्यूटर की स्टोरेज क्षमता (10 GB) को बाइट्स (Bytes) में परिकलित कीजिए।"
                                  ]).map((q, i) => (
                                    <li key={i} className="leading-relaxed hover:text-slate-900 transition-colors font-sans">{q}</li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* TAB 8: CHAT AI TUTOR */}
                      {activeTab === "ai-tutor" && (
                        <div className="space-y-4">
                          <div className="bg-gradient-to-r from-blue-900 to-indigo-900 rounded-xl p-4 text-white flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full overflow-hidden border border-white/20 shrink-0 shadow bg-blue-950">
                                <img
                                  src={jitendraProfile}
                                  alt="Jitendra Bishnoi Avatar"
                                  referrerPolicy="no-referrer"
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div>
                                <h4 className="font-display font-bold text-sm">जितेन्द्र बिश्नोई (AI ट्यूटर)</h4>
                                <span className="text-[10px] text-blue-200">सदा आपके सहयोग हेतु तत्पर</span>
                              </div>
                            </div>
                            <span className="text-[10px] bg-emerald-500 text-white px-2.5 py-0.5 rounded-full font-semibold animate-pulse shrink-0">
                              ऑनलाइन (Online)
                            </span>
                          </div>

                          {/* Chat Box Conversation */}
                          <div className="border border-slate-200 rounded-xl bg-slate-50 h-[380px] overflow-y-auto p-4 space-y-4 shadow-inner flex flex-col justify-between">
                            <div className="space-y-4 flex-1 overflow-y-auto pr-1">
                              {chatHistory.map((msg, index) => {
                                const isUser = msg.role === "user";
                                return (
                                  <div
                                    key={index}
                                    className={`flex items-start gap-2 ${isUser ? "justify-end" : "justify-start"}`}
                                  >
                                    {!isUser && (
                                      <div className="w-7 h-7 rounded-full overflow-hidden border border-slate-200 shrink-0 mt-0.5 shadow-sm bg-blue-50">
                                        <img
                                          src={jitendraProfile}
                                          alt="Jitendra Bishnoi"
                                          referrerPolicy="no-referrer"
                                          className="w-full h-full object-cover"
                                        />
                                      </div>
                                    )}
                                    <div
                                      className={`max-w-[75%] p-3 rounded-2xl text-xs leading-relaxed ${
                                        isUser
                                          ? "bg-blue-600 text-white rounded-br-none shadow-md shadow-blue-600/10"
                                          : "bg-white border border-slate-200 text-slate-800 rounded-bl-none shadow-sm"
                                      }`}
                                    >
                                      {!isUser && (
                                        <div className="text-[9px] font-bold text-blue-600 mb-1 font-display">जितेन्द्र बिश्नोई</div>
                                      )}
                                      <div className="whitespace-pre-wrap">{msg.content}</div>
                                    </div>
                                  </div>
                                );
                              })}
                              {isTyping && (
                                <div className="flex items-start gap-2 justify-start">
                                  <div className="w-7 h-7 rounded-full overflow-hidden border border-slate-200 shrink-0 mt-0.5 shadow-sm bg-blue-50">
                                    <img
                                      src={jitendraProfile}
                                      alt="Jitendra Bishnoi"
                                      referrerPolicy="no-referrer"
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                  <div className="bg-white border border-slate-200 p-3 rounded-2xl text-xs rounded-bl-none shadow-sm text-slate-400 italic flex items-center gap-2">
                                    <span>जितेन्द्र सोच रहे हैं...</span>
                                    <div className="flex gap-1">
                                      <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></div>
                                      <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                                      <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                                    </div>
                                  </div>
                                </div>
                              )}
                              <div ref={chatEndRef}></div>
                            </div>
                          </div>

                          {/* Message inputs */}
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={chatInput}
                              onChange={(e) => setChatInput(e.target.value)}
                              onKeyDown={(e) => e.key === "Enter" && askTutor()}
                              placeholder="प्रोफेसर से पूछें (उदा. 'मशीन भाषा क्या है?' या 'सी में लूप क्या काम करता है?')..."
                              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-600 transition-all shadow-sm"
                            />
                            <button
                              onClick={askTutor}
                              className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl text-xs font-semibold shadow-md shadow-blue-600/15 flex items-center gap-1.5 transition-all"
                            >
                              <span>भेजें</span>
                              <ChevronRight className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      )}

                    </div>

                    {/* CHAPTER SUMMARY FOOTER */}
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white shadow-md space-y-3">
                      <h4 className="font-display font-bold text-sm text-blue-400 border-b border-slate-800 pb-1.5 flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-blue-400" />
                        <span>अध्याय सारांश (Chapter Summary)</span>
                      </h4>
                      <p className="text-xs text-slate-300 leading-relaxed text-justify">
                        {currentChapter.summary}
                      </p>
                    </div>

                  </div>
                ) : null}
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>

      </div>
    </div>
  );
}
