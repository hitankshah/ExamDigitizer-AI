
import React, { useState } from 'react';
import Layout from './components/Layout';
import SetupScreen from './components/SetupScreen';
import ExamInterface from './components/ExamInterface';
import GradedResult from './components/GradedResult';
import { convertPdfToImages } from './services/pdfService';
import { analyzeExamImages } from './services/geminiService';
import { ProcessingStatus, ExamQuestion, ExamConfig } from './types';

const App: React.FC = () => {
  const [status, setStatus] = useState<ProcessingStatus>({ step: 'setup' });
  const [questions, setQuestions] = useState<ExamQuestion[]>([]);
  const [examConfig, setExamConfig] = useState<ExamConfig>({ durationMinutes: 30, examTitle: '' });

  const handleStartProcess = async (file: File, duration: number, title: string) => {
    try {
      setExamConfig({ durationMinutes: duration, examTitle: title });

      // 1. Convert PDF to Images
      setStatus({ step: 'converting', progress: 0, message: 'Processing PDF pages...' });
      
      const images = await convertPdfToImages(file, (current, total) => {
        setStatus(prev => ({ 
          ...prev, 
          progress: Math.round((current / total) * 100) 
        }));
      });

      // 2. Analyze with Gemini
      setStatus({ step: 'analyzing', message: 'AI is extracting questions & answer key...' });
      const extractedQuestions = await analyzeExamImages(images);

      if (extractedQuestions.length === 0) {
        throw new Error("No questions could be extracted from this document.");
      }

      setQuestions(extractedQuestions);
      setStatus({ step: 'exam_active' });

    } catch (error: any) {
      console.error(error);
      setStatus({ 
        step: 'error', 
        message: error.message || 'An unexpected error occurred during processing.' 
      });
    }
  };

  const handleExamSubmit = (userAnswers: Record<string | number, 'A' | 'B' | 'C' | 'D' | null>) => {
    // Merge user answers into questions
    const gradedQuestions = questions.map(q => ({
      ...q,
      userSelection: userAnswers[q.id] || null
    }));
    setQuestions(gradedQuestions);
    setStatus({ step: 'results' });
  };

  const reset = () => {
    setStatus({ step: 'setup' });
    setQuestions([]);
    setExamConfig({ durationMinutes: 30, examTitle: '' });
  };

  return (
    <Layout>
      {/* 1. SETUP SCREEN */}
      {status.step === 'setup' && (
        <div className="flex-grow flex flex-col justify-center animate-fade-in">
            <div className="text-center mb-8 px-4 mt-8">
              <h2 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
                Turn any PDF into an <span className="text-indigo-600">Online Exam</span>
              </h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
                Upload your question paper. Our AI extracts the questions, sets the timer, and auto-grades your performance instantly.
              </p>
            </div>
            <SetupScreen onStart={handleStartProcess} isProcessing={false} />
        </div>
      )}

      {/* 2. PROCESSING STATES */}
      {(status.step === 'converting' || status.step === 'analyzing') && (
        <div className="flex-grow flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl text-center border border-slate-100">
              <div className="mb-8 relative">
                <div className="w-20 h-20 border-[6px] border-indigo-50 border-t-indigo-600 rounded-full animate-spin mx-auto"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-bold text-indigo-600 animate-pulse">AI</span>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-2">
                {status.step === 'converting' ? 'Reading Document' : 'Generating Exam'}
              </h3>
              <p className="text-slate-500 mb-8">{status.message}</p>
              
              {status.step === 'converting' && (
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-indigo-600 h-2 rounded-full transition-all duration-500 ease-out" 
                    style={{ width: `${status.progress}%` }}
                  ></div>
                </div>
              )}
            </div>
        </div>
      )}

      {/* 3. ACTIVE EXAM */}
      {status.step === 'exam_active' && (
        <ExamInterface 
          questions={questions}
          durationMinutes={examConfig.durationMinutes}
          examTitle={examConfig.examTitle}
          onSubmit={handleExamSubmit}
        />
      )}

      {/* 4. RESULTS */}
      {status.step === 'results' && (
        <GradedResult 
          questions={questions}
          examTitle={examConfig.examTitle}
          onRetake={reset}
        />
      )}

      {/* ERROR STATE */}
      {status.step === 'error' && (
        <div className="flex-grow flex flex-col items-center justify-center p-4">
          <div className="max-w-md text-center bg-white p-8 rounded-2xl shadow-lg border border-red-100">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">⚠️</span>
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Processing Failed</h3>
            <p className="text-slate-600 mb-6">{status.message}</p>
            <button 
              onClick={reset}
              className="px-6 py-3 bg-slate-900 text-white font-medium rounded-xl hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl active:scale-95"
            >
              Try Again
            </button>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default App;
