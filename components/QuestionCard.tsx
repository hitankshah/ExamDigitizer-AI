import React, { memo } from 'react';
import { ExamQuestion } from '../types';
import { CheckCircle2, Circle, AlertTriangle, Edit2 } from 'lucide-react';

interface QuestionCardProps {
  question: ExamQuestion;
  index: number;
  onUpdate: (id: string | number, updated: ExamQuestion) => void;
}

const QuestionCard: React.FC<QuestionCardProps> = memo(({ question, index, onUpdate }) => {
  
  const handleOptionChange = (key: 'A' | 'B' | 'C' | 'D', value: string) => {
    onUpdate(question.id, {
      ...question,
      options: { ...question.options, [key]: value }
    });
  };

  const handleCorrectAnswerChange = (key: 'A' | 'B' | 'C' | 'D') => {
    onUpdate(question.id, {
      ...question,
      correctAnswer: key
    });
  };

  const handleQuestionTextChange = (text: string) => {
    onUpdate(question.id, {
      ...question,
      question: text
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 transition-all hover:shadow-md">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-3">
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 text-slate-600 font-bold text-sm">
            {question.id}
          </span>
          {!question.correctAnswer && (
             <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800">
               <AlertTriangle className="w-3 h-3 mr-1" />
               Missing Answer
             </span>
          )}
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
          Question
        </label>
        <textarea
          className="w-full text-slate-800 font-medium text-lg border-none focus:ring-0 p-0 resize-none bg-transparent placeholder-slate-300"
          value={question.question}
          onChange={(e) => handleQuestionTextChange(e.target.value)}
          rows={2}
          placeholder="Enter question text..."
        />
      </div>

      <div className="space-y-3">
        {(['A', 'B', 'C', 'D'] as const).map((optKey) => {
          const isCorrect = question.correctAnswer === optKey;
          return (
            <div 
              key={optKey} 
              className={`
                group flex items-center p-3 rounded-lg border transition-colors
                ${isCorrect ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-transparent hover:bg-white hover:border-slate-200'}
              `}
            >
              <button
                onClick={() => handleCorrectAnswerChange(optKey)}
                className={`
                  flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mr-3 transition-colors
                  ${isCorrect ? 'text-emerald-600' : 'text-slate-300 group-hover:text-slate-400'}
                `}
                title="Mark as correct answer"
              >
                {isCorrect ? <CheckCircle2 className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
              </button>
              
              <div className="flex-1">
                <div className="flex items-center">
                  <span className={`w-6 font-bold text-sm ${isCorrect ? 'text-emerald-700' : 'text-slate-500'}`}>
                    {optKey}.
                  </span>
                  <input
                    type="text"
                    className={`
                      w-full bg-transparent border-none focus:ring-0 text-sm p-0
                      ${isCorrect ? 'text-emerald-900' : 'text-slate-700'}
                    `}
                    value={question.options[optKey]}
                    onChange={(e) => handleOptionChange(optKey, e.target.value)}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
});

export default QuestionCard;
