import React from 'react';
import { ExamQuestion } from '../types';
import { CheckCircle2, XCircle, AlertTriangle, Download, RefreshCcw } from 'lucide-react';

interface GradedResultProps {
  questions: ExamQuestion[];
  examTitle: string;
  onRetake: () => void;
}

const GradedResult: React.FC<GradedResultProps> = ({ questions, examTitle, onRetake }) => {
  const total = questions.length;
  const attempted = questions.filter(q => q.userSelection).length;
  const correct = questions.filter(q => q.userSelection && q.userSelection === q.correctAnswer).length;
  const percentage = Math.round((correct / total) * 100) || 0;

  const getScoreColor = (p: number) => {
    if (p >= 80) return 'text-emerald-600';
    if (p >= 60) return 'text-indigo-600';
    if (p >= 40) return 'text-amber-600';
    return 'text-red-600';
  };

  const exportResults = () => {
    const report = questions.map(q => ({
      id: q.id,
      question: q.question,
      userAnswer: q.userSelection,
      correctAnswer: q.correctAnswer,
      isCorrect: q.userSelection === q.correctAnswer
    }));
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${examTitle.replace(/\s+/g, '_')}_results.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="container mx-auto px-4 pb-20 max-w-5xl">
      <div className="text-center py-10">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">{examTitle} Results</h1>
        <p className="text-slate-500">Here is how you performed</p>
      </div>

      {/* Score Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 mb-8 flex flex-col md:flex-row items-center justify-around gap-8">
        <div className="text-center">
          <div className={`text-6xl font-black mb-2 ${getScoreColor(percentage)}`}>
            {percentage}%
          </div>
          <p className="text-slate-400 font-medium uppercase tracking-wider text-xs">Total Score</p>
        </div>
        
        <div className="h-16 w-px bg-slate-200 hidden md:block"></div>

        <div className="grid grid-cols-2 gap-x-12 gap-y-4 text-center">
          <div>
            <p className="text-2xl font-bold text-slate-800">{correct}</p>
            <p className="text-slate-400 text-xs uppercase">Correct</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-800">{total - correct}</p>
            <p className="text-slate-400 text-xs uppercase">Incorrect</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-800">{attempted}</p>
            <p className="text-slate-400 text-xs uppercase">Attempted</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-800">{total}</p>
            <p className="text-slate-400 text-xs uppercase">Total Questions</p>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-slate-800">Detailed Review</h3>
        <div className="flex gap-3">
          <button 
            onClick={exportResults}
            className="flex items-center px-4 py-2 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 text-slate-700 font-medium transition-colors text-sm"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
          <button 
            onClick={onRetake}
            className="flex items-center px-4 py-2 bg-indigo-600 rounded-lg hover:bg-indigo-700 text-white font-medium transition-colors text-sm"
          >
            <RefreshCcw className="w-4 h-4 mr-2" />
            New Exam
          </button>
        </div>
      </div>

      {/* Question Review */}
      <div className="space-y-6">
        {questions.map((q, idx) => {
          const isCorrect = q.userSelection === q.correctAnswer;
          const isMissingKey = !q.correctAnswer;
          const userUnanswered = !q.userSelection;

          let statusColor = isCorrect ? 'border-emerald-200 bg-emerald-50/30' : 'border-red-200 bg-red-50/30';
          if (isMissingKey) statusColor = 'border-amber-200 bg-amber-50/30';

          return (
            <div key={q.id} className={`rounded-xl p-6 border ${statusColor}`}>
              <div className="flex items-start gap-4 mb-4">
                 <div className="flex-shrink-0">
                    {isCorrect ? (
                      <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                    ) : isMissingKey ? (
                      <AlertTriangle className="w-8 h-8 text-amber-500" />
                    ) : (
                      <XCircle className="w-8 h-8 text-red-500" />
                    )}
                 </div>
                <div className="flex-grow">
                  <div className="flex justify-between">
                    <h4 className="font-bold text-slate-700">Question {idx + 1}</h4>
                    {!isCorrect && !isMissingKey && (
                       <span className="text-xs font-bold text-red-600 bg-red-100 px-2 py-1 rounded">Incorrect</span>
                    )}
                    {isCorrect && (
                       <span className="text-xs font-bold text-emerald-600 bg-emerald-100 px-2 py-1 rounded">Correct</span>
                    )}
                  </div>
                  <p className="text-lg text-slate-800 mt-1">{q.question}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-12">
                {(['A', 'B', 'C', 'D'] as const).map((optKey) => {
                  const isSelected = q.userSelection === optKey;
                  const isActuallyCorrect = q.correctAnswer === optKey;
                  
                  let optClass = "border-slate-200 bg-white opacity-70";
                  if (isActuallyCorrect) optClass = "border-emerald-500 bg-emerald-50 ring-1 ring-emerald-500 font-medium opacity-100";
                  else if (isSelected && !isActuallyCorrect) optClass = "border-red-400 bg-red-50 ring-1 ring-red-400 opacity-100";
                  
                  return (
                    <div
                      key={optKey}
                      className={`flex items-center p-3 rounded-lg border ${optClass}`}
                    >
                      <span className={`w-6 font-bold mr-2 ${isActuallyCorrect ? 'text-emerald-700' : 'text-slate-400'}`}>
                        {optKey}.
                      </span>
                      <span className={isActuallyCorrect ? 'text-emerald-900' : 'text-slate-600'}>
                        {q.options[optKey]}
                      </span>
                      {isSelected && (
                        <span className="ml-auto text-xs font-bold px-2 py-0.5 rounded bg-slate-200 text-slate-600">
                          Your Answer
                        </span>
                      )}
                      {isActuallyCorrect && !isSelected && (
                        <span className="ml-auto text-xs font-bold px-2 py-0.5 rounded bg-emerald-200 text-emerald-700">
                          Correct Answer
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
              
              {isMissingKey && (
                <div className="mt-4 pl-12 text-sm text-amber-700 flex items-center">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  AI could not identify the correct answer for grading from the source document.
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GradedResult;