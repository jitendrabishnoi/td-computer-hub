export interface LearningObjective {
  id: string;
  point: string;
}

export interface TheorySection {
  id: string;
  title: string;
  englishTitle?: string;
  content: string; // detailed Hindi text (supports markdown or rich text style)
  subsections?: {
    title: string;
    englishTitle?: string;
    content: string;
    code?: string;
    codeExplanation?: string;
  }[];
}

export interface DiagramData {
  id: string;
  title: string;
  ascii: string;
  description: string;
}

export interface TableRow {
  parameter: string;
  col1: string;
  col2: string;
  col3?: string;
  col4?: string;
}

export interface TableData {
  id: string;
  title: string;
  headers: string[];
  rows: TableRow[];
}

export interface RealLifeExample {
  id: string;
  concept: string;
  analogy: string;
  hindiExplanation: string;
}

export interface QAItem {
  question: string;
  answer: string;
}

export interface MCQ {
  id: string;
  question: string;
  options: string[]; // 4 options
  correctIndex: number; // 0-3
  explanation: string;
}

export interface ProgrammingExample {
  id: string;
  title: string;
  code: string;
  explanation: string; // Line-by-line explanation in Hindi
  output: string;
}

export interface Chapter {
  number: number;
  title: string;
  englishTitle: string;
  learningObjectives: string[];
  introduction: string;
  theorySections: TheorySection[];
  diagrams: DiagramData[];
  tables: TableData[];
  realLifeExamples: RealLifeExample[];
  importantPoints: string[];
  interviewQuestions: QAItem[];
  vivaQuestions: QAItem[];
  semesterQuestions: {
    veryShort?: string[];
    short: string[];
    long: string[];
    numerical?: string[];
  };
  practicals: {
    title: string;
    steps: string[];
    expectedOutput?: string;
  }[];
  shortNotes: string[];
  revisionNotes: string[];
  previousYearQuestions: string[];
  mcqs: MCQ[];
  programmingExamples: ProgrammingExample[];
  assignments: string[];
  summary: string;
  shortcutKeys?: { key: string; action: string; description?: string }[];
}
