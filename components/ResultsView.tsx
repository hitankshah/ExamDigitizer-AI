import React, { useState } from 'react';
import { ExamQuestion } from '../types';
import QuestionCard from './QuestionCard';
import { Download, Copy, Check, ChevronLeft } from 'lucide-react';

interface ResultsViewProps {
  questions: ExamQuestion[];
  onReset: () => void;
}

const ResultsView: React.FC<ResultsViewProps> = ({ questions: initialQuestions, onReset }) => {
  const [questions, setQuestions] = useState<ExamQuestion[]>(initialQuestions);
  const [copied, setCopied] = useState(false);

  const handleUpdateQuestion = (id: string | number, updated: ExamQuestion) => {
    setQuestions(prev => prev.map(q => q.id === id ? updated : q));
  };

  const exportJSON = () => {
    const dataStr = JSON.stringify(questions, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = "exam_export.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(questions, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const validCount = questions.filter(q => q.correctAnswer !== null).length;

  return (
    <div className="container mx-auto px-4 pb-20">
      <div className="sticky top-0 z-10 bg-slate-50/95 backdrop-blur-sm pt-6 pb-4 border-b border-slate-200 mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <button 
              onClick={onReset}
              className="p-2 hover:bg-white rounded-full transition-colors text-slate-500"
              title="Upload new file"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <div>
              <h2 className="text-2xl font-bold text-slate-800">Extraction Results</h2>
              <p className="text-sm text-slate-500">
                Found {questions.length} questions. {validCount} have answers detected.
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
             <button
              onClick={copyToClipboard}
              className="inline-flex items-center px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 font-medium transition-colors text-sm"
            >
              {copied ? <Check className="w-4 h-4 mr-2 text-green-600" /> : <Copy className="w-4 h-4 mr-2" />}
              {copied ? 'Copied' : 'Copy JSON'}
            </button>
            <button
              onClick={exportJSON}
              className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-indigo-700 font-medium transition-colors text-sm shadow-sm"
            >
              <Download className="w-4 h-4 mr-2" />
              Download JSON
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {questions.map((q, idx) => (
          <QuestionCard 
            key={idx} 
            index={idx} 
            question={q} 
            onUpdate={handleUpdateQuestion} 
          />
        ))}
      </div>
    </div>
  );
};

export default ResultsView;
