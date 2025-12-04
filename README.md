
# ExamDigitizer AI

Turn static PDF exam papers into interactive, auto-graded online tests instantly using AI.

## 🚀 Overview

ExamDigitizer uses **Google Gemini 2.5 Flash** (Vision) to OCR and understand the structure of PDF exam papers. It extracts multiple-choice questions, identifies the correct answer key (from tables or markings), and generates a live testing interface for students.

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript
- **Styling**: Tailwind CSS
- **AI/ML**: Google Gemini 2.5 Flash (via `@google/genai`)
- **PDF Processing**: `pdfjs-dist` (PDF to Image conversion)
- **Icons**: Lucide React

## 📂 Architecture

The project follows a clean "Setup -> Process -> Exam -> Result" workflow.

```
/
├── index.html              # Entry point (Tailwind & PDF.js worker config)
├── index.tsx               # React Bootstrapper
├── App.tsx                 # Main State Machine & Router
├── types.ts                # TypeScript Domain Models
│
├── services/
│   ├── pdfService.ts       # Handles PDF parsing & Canvas rendering
│   └── geminiService.ts    # AI Logic (Prompt Engineering & Schema)
│
└── components/
    ├── Layout.tsx          # Application Shell (Header/Footer)
    ├── SetupScreen.tsx     # Exam Config & File Upload
    ├── ExamInterface.tsx   # Active Testing UI with Timer
    └── GradedResult.tsx    # Scoring & Review UI
```

## 🔑 Key Features

1.  **PDF Parsing**: Converts multi-page PDFs into high-quality JPEG images in the browser.
2.  **AI Extraction**: 
    - Identifies Questions IDs, Text, and Options (A-D).
    - **Answer Key Detection**: Looks for answer tables at the end of PDFs or inline ticks/marks to create the marking scheme.
3.  **Exam Mode**:
    - Countdown Timer.
    - Progress tracking.
    - Distraction-free interface.
4.  **Auto-Grading**:
    - Instant score calculation.
    - Detailed question-by-question review.
    - Export results to JSON.

## 📦 Setup

1.  Clone the repository.
2.  Ensure you have a valid **Google Gemini API Key**.
3.  The app expects the API key to be available in `process.env.API_KEY`.
4.  Run the development server.

## 📝 Usage

1.  **Configure**: Set the exam title and duration (e.g., 30 mins).
2.  **Upload**: Drag & drop a PDF containing MCQs.
3.  **Take Exam**: Select answers within the time limit.
4.  **Review**: See your score and review correct/incorrect answers immediately.
