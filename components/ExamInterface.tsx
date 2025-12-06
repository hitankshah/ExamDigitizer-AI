import React, { useEffect, useState, useRef, useCallback } from 'react';
import { ExamQuestion } from '../types';
import { Clock, CircleCheck, Cloud, TriangleAlert, X, ChevronLeft, LogOut } from 'lucide-react';

interface ExamInterfaceProps {
  questions: ExamQuestion[];
  durationMinutes: number;
  examTitle: string;
  onSubmit: (answers: Record<string | number, 'A' | 'B' | 'C' | 'D' | null>) => void;
  onExit: () => void;
}

const STORAGE_KEY_PROGRESS = 'exam_progress_data';

const ExamInterface: React.FC<ExamInterfaceProps> = ({ 
  questions, 
  durationMinutes, 
  examTitle,
  onSubmit,
  onExit
}) => {
  // Initialize state from localStorage if available
  const [timeLeft, setTimeLeft] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PROGRESS);
      if (saved) {
        const { timeLeft: savedTime } = JSON.parse(saved);
        if (typeof savedTime === 'number') return savedTime;
      }
    } catch (e) {
      console.error("Error loading time", e);
    }
    return durationMinutes * 60;
  });

  const [answers, setAnswers] = useState<Record<string | number, 'A' | 'B' | 'C' | 'D' | null>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PROGRESS);
      if (saved) {
        const { answers: savedAnswers } = JSON.parse(saved);
        if (savedAnswers) return savedAnswers;
      }
    } catch (e) {
      console.error("Error loading answers", e);
    }
    return {};
  });

  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [activeModal, setActiveModal] = useState<'submit' | 'exit' | null>(null);
  
  // Ref to keep track of answers inside the timer closure without resetting the interval
  const answersRef = useRef(answers);
  
  useEffect(() => {
    answersRef.current = answers;
  }, [answers]);

  // Helper to persist state
  const saveProgress = useCallback((currentAnswers: any, currentTime: number) => {
    localStorage.setItem(STORAGE_KEY_PROGRESS, JSON.stringify({
      answers: currentAnswers,
      timeLeft: currentTime,
      timestamp: new Date().toISOString()
    }));
    setLastSaved(new Date());
  }, []);

  // Timer Effect - Runs once and uses refs for latest state
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        const newTime = prev - 1;
        
        // Auto-save every 30 seconds
        if (newTime % 30 === 0 && newTime > 0) {
           saveProgress(answersRef.current, newTime);
        }

        if (newTime <= 0) {
          clearInterval(timer);
          // Force submit when time runs out
          onSubmit(answersRef.current);
          return 0;
        }
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onSubmit, saveProgress]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSelect = (questionId: string | number, option: 'A' | 'B' | 'C' | 'D') => {
    const newAnswers = {
      ...answers,
      [questionId]: option
    };
    setAnswers(newAnswers);
    // Auto-save immediately on interaction
    saveProgress(newAnswers, timeLeft);
  };

  const handleSubmitClick = () => {
    setActiveModal('submit');
  };

  const handleExitClick = () => {
    setActiveModal('exit');
  };

  const confirmSubmit = () => {
    setActiveModal(null);
    onSubmit(answers);
  };

  const confirmExit = () => {
    setActiveModal(null);
    onExit();
  };

  const answeredCount = Object.keys(answers).length;
  const progress = Math.round((answeredCount / questions.length) * 100);

  return (
    <div className="container mx-auto px-4 pb-20 max-w-5xl relative">
      {/* Sticky Header with Prominent Progress */}
      <div className="sticky top-0 z-20 bg-slate-50/95 backdrop-blur-md border-b border-slate-200 pt-4 pb-6 mb-8 shadow-sm transition-all -mx-4 px-4 md:rounded-b-xl md:mx-0 md:px-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
          <div className="flex items-start gap-3">
            <button 
              onClick={handleExitClick}
              className="mt-1 p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500 hover:text-slate-800"
              title="Exit Exam"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <div>
              <h2 className="text-xl font-bold text-slate-800 leading-tight">{examTitle}</h2>
              <div className="flex items-center mt-1 h-5">
                {lastSaved && (
                  <span className="flex items-center text-xs text-slate-400 animate-fade-in">
                    <Cloud className="w-3 h-3 mr-1" />
                    Auto-saved {lastSaved.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between md:justify-end space-x-4 w-full md:w-auto border-t md:border-t-0 border-slate-100 pt-3 md:pt-0">
            <div className={`flex items-center space-x-2 font-mono text-xl font-bold px-4 py-2 rounded-lg transition-colors ${timeLeft < 300 ? 'bg-red-50 text-red-600 animate-pulse' : 'bg-slate-100 text-slate-700'}`}>
              <Clock className="w-5 h-5" />
              <span>{formatTime(timeLeft)}</span>
            </div>
            
            <button
              onClick={handleSubmitClick}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-sm transition-all hover:shadow-md active:scale-95"
            >
              Finish
            </button>
          </div>
        </div>
        
        {/* Prominent Progress Section */}
        <div className="w-full">
            <div className="flex justify-between items-end mb-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Progress
                </span>
                <div className="text-right">
                    <span className="text-sm font-bold text-indigo-600">{progress}%</span>
                    <span className="text-xs text-slate-400 ml-1 font-medium">({answeredCount}/{questions.length} answered)</span>
                </div>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                <div 
                    className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500 ease-out shadow-[0_0_10px_rgba(79,70,229,0.3)] relative"
                    style={{ width: `${progress}%` }}
                >
                   <div className="absolute inset-0 bg-white/20 animate-[pulse_2s_infinite]"></div>
                </div>
            </div>
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-6">
        {questions.map((q, idx) => (
          <div key={q.id} className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 transition-shadow hover:shadow-md">
            <div className="flex items-start gap-4 mb-4">
              <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 font-bold text-sm">
                {idx + 1}
              </span>
              <p className="text-lg font-medium text-slate-800 pt-0.5">{q.question}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-12">
              {(['A', 'B', 'C', 'D'] as const).map((optKey) => (
                <button
                  key={optKey}
                  onClick={() => handleSelect(q.id, optKey)}
                  className={`
                    relative flex items-center p-4 rounded-lg border-2 text-left transition-all duration-200
                    ${answers[q.id] === optKey 
                      ? 'border-indigo-600 bg-indigo-50 ring-1 ring-indigo-600/20' 
                      : 'border-slate-100 bg-slate-50 hover:bg-white hover:border-slate-300'
                    }
                  `}
                >
                  <div className={`
                    w-6 h-6 rounded-full border-2 mr-3 flex items-center justify-center flex-shrink-0 transition-colors
                    ${answers[q.id] === optKey ? 'border-indigo-600' : 'border-slate-300'}
                  `}>
                    {answers[q.id] === optKey && <div className="w-3 h-3 bg-indigo-600 rounded-full" />}
                  </div>
                  <div>
                    <span className="font-bold text-slate-500 mr-2">{optKey}.</span>
                    <span className={`transition-colors ${answers[q.id] === optKey ? 'text-indigo-900 font-medium' : 'text-slate-700'}`}>
                      {q.options[optKey]}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 flex justify-center">
        <button
          onClick={handleSubmitClick}
          className="px-12 py-4 bg-indigo-600 hover:bg-indigo-700 text-white text-lg font-bold rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 active:translate-y-0"
        >
          Submit Answers
        </button>
      </div>

      {/* Unified Confirmation Modal */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-scale-in">
            <div className="flex justify-between items-start mb-6">
              <div className={`p-3 rounded-full ${activeModal === 'submit' ? 'bg-indigo-100' : 'bg-red-100'}`}>
                {activeModal === 'submit' ? (
                  <CircleCheck className="w-6 h-6 text-indigo-600" />
                ) : (
                  <LogOut className="w-6 h-6 text-red-600" />
                )}
              </div>
              <button 
                onClick={() => setActiveModal(null)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {activeModal === 'submit' ? (
              <>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Ready to submit?</h3>
                <p className="text-slate-500 mb-6">
                  You are about to finalize your exam. You will not be able to change your answers after this.
                </p>
                
                <div className="bg-slate-50 rounded-xl p-4 mb-6 space-y-3 border border-slate-100">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 font-medium">Questions Answered</span>
                    <span className={`font-bold ${answeredCount === questions.length ? 'text-emerald-600' : 'text-amber-600'}`}>
                      {answeredCount} / {questions.length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 font-medium">Time Remaining</span>
                    <span className="font-mono font-bold text-slate-800">{formatTime(timeLeft)}</span>
                  </div>
                  {answeredCount < questions.length && (
                    <div className="flex items-center text-amber-600 text-sm mt-2 bg-amber-50 p-2 rounded-lg">
                      <TriangleAlert className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span>You have {questions.length - answeredCount} unanswered questions.</span>
                    </div>
                  )}
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => setActiveModal(null)}
                    className="flex-1 px-4 py-3 bg-white border border-slate-300 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-colors"
                  >
                    Keep Working
                  </button>
                  <button
                    onClick={confirmSubmit}
                    className="flex-1 px-4 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 shadow-md transition-all hover:shadow-lg active:scale-95"
                  >
                    Submit Exam
                  </button>
                </div>
              </>
            ) : (
              <>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Exit Exam?</h3>
                <p className="text-slate-500 mb-6">
                  Are you sure you want to exit? Your progress and all your answers will be lost permanently.
                </p>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setActiveModal(null)}
                    className="flex-1 px-4 py-3 bg-white border border-slate-300 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmExit}
                    className="flex-1 px-4 py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 shadow-md transition-all hover:shadow-lg active:scale-95"
                  >
                    Exit Exam
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ExamInterface;