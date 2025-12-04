import React, { useEffect, useState } from 'react';
import { ExamQuestion } from '../types';
import { Clock, CheckCircle2, AlertCircle } from 'lucide-react';

interface ExamInterfaceProps {
  questions: ExamQuestion[];
  durationMinutes: number;
  examTitle: string;
  onSubmit: (answers: Record<string | number, 'A' | 'B' | 'C' | 'D' | null>) => void;
}

const ExamInterface: React.FC<ExamInterfaceProps> = ({ 
  questions, 
  durationMinutes, 
  examTitle,
  onSubmit 
}) => {
  const [timeLeft, setTimeLeft] = useState(durationMinutes * 60);
  const [answers, setAnswers] = useState<Record<string | number, 'A' | 'B' | 'C' | 'D' | null>>({});

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit(); // Auto-submit
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSelect = (questionId: string | number, option: 'A' | 'B' | 'C' | 'D') => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: option
    }));
  };

  const handleSubmit = () => {
    onSubmit(answers);
  };

  const answeredCount = Object.keys(answers).length;
  const progress = Math.round((answeredCount / questions.length) * 100);

  return (
    <div className="container mx-auto px-4 pb-20 max-w-5xl">
      {/* Sticky Header */}
      <div className="sticky top-0 z-20 bg-slate-50/95 backdrop-blur-md border-b border-slate-200 py-4 mb-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-800">{examTitle}</h2>
            <div className="text-xs text-slate-500 font-medium mt-1">
              Question {answeredCount} of {questions.length} answered
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <div className={`flex items-center space-x-2 font-mono text-xl font-bold px-4 py-2 rounded-lg ${timeLeft < 300 ? 'bg-red-50 text-red-600' : 'bg-slate-100 text-slate-700'}`}>
              <Clock className="w-5 h-5" />
              <span>{formatTime(timeLeft)}</span>
            </div>
            
            <button
              onClick={handleSubmit}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-sm transition-transform active:scale-95"
            >
              Submit Exam
            </button>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="absolute bottom-0 left-0 w-full h-1 bg-slate-200">
          <div 
            className="h-full bg-indigo-600 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-6">
        {questions.map((q, idx) => (
          <div key={q.id} className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
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
                    relative flex items-center p-4 rounded-lg border-2 text-left transition-all
                    ${answers[q.id] === optKey 
                      ? 'border-indigo-600 bg-indigo-50 ring-1 ring-indigo-600' 
                      : 'border-slate-100 bg-slate-50 hover:bg-white hover:border-slate-300'
                    }
                  `}
                >
                  <div className={`
                    w-6 h-6 rounded-full border-2 mr-3 flex items-center justify-center flex-shrink-0
                    ${answers[q.id] === optKey ? 'border-indigo-600' : 'border-slate-300'}
                  `}>
                    {answers[q.id] === optKey && <div className="w-3 h-3 bg-indigo-600 rounded-full" />}
                  </div>
                  <div>
                    <span className="font-bold text-slate-500 mr-2">{optKey}.</span>
                    <span className="text-slate-700">{q.options[optKey]}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-center">
        <button
          onClick={handleSubmit}
          className="px-12 py-4 bg-indigo-600 hover:bg-indigo-700 text-white text-lg font-bold rounded-xl shadow-lg hover:shadow-xl transition-transform transform hover:-translate-y-1"
        >
          Submit Answers
        </button>
      </div>
    </div>
  );
};

export default ExamInterface;