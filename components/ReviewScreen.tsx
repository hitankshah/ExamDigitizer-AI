import React, { useState } from 'react';
import { ExamQuestion } from '../types';
import QuestionCard from './QuestionCard';
import { CirclePlay, TriangleAlert, FileText, Check, X } from 'lucide-react';

interface ReviewScreenProps {
  questions: ExamQuestion[];
  onUpdateQuestion: (id: string | number, updated: ExamQuestion) => void;
  onConfirmExam: () => void;
}

const ReviewScreen: React.FC<ReviewScreenProps> = ({ questions, onUpdateQuestion, onConfirmExam }) => {
  const [showBulkImport, setShowBulkImport] = useState(false);
  const [bulkText, setBulkText] = useState('');
  const [importStatus, setImportStatus] = useState<{msg: string, type: 'success' | 'error'} | null>(null);

  const missingAnswersCount = questions.filter(q => !q.correctAnswer).length;

  const handleBulkImport = () => {
    // Expected format: "1. A, 2. B" or "1A 2B" or "1-A"
    // Regex looks for a number, optional separators, then A-D
    const regex = /(\d+)[\.\)\s:-]*([A-D])/gi;
    let match;
    let count = 0;
    
    // Create a map for faster updates
    const updates = new Map<string, 'A'|'B'|'C'|'D'>();
    
    while ((match = regex.exec(bulkText)) !== null) {
      const id = match[1]; // Captured number string
      const ans = match[2].toUpperCase() as 'A'|'B'|'C'|'D';
      
      // Attempt to find the question with this ID (assuming numeric match)
      // We compare loosely to handle string "1" vs number 1
      const qIndex = questions.findIndex(q => q.id.toString() === id);
      if (qIndex !== -1) {
        updates.set(questions[qIndex].id.toString(), ans);
        count++;
      }
    }

    if (count === 0) {
      setImportStatus({ msg: "No matching question IDs found. Format: '1. A, 2. B'", type: 'error' });
      return;
    }

    // Apply updates
    questions.forEach(q => {
      if (updates.has(q.id.toString())) {
        onUpdateQuestion(q.id, { ...q, correctAnswer: updates.get(q.id.toString())! });
      }
    });

    setImportStatus({ msg: `Successfully updated ${count} answers!`, type: 'success' });
    setTimeout(() => {
        setImportStatus(null);
        setShowBulkImport(false);
        setBulkText('');
    }, 1500);
  };

  return (
    <div className="container mx-auto px-4 pb-20 max-w-5xl animate-fade-in">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-8 mt-4 sticky top-4 z-20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 flex items-center">
              <span className="bg-indigo-100 text-indigo-700 text-sm font-bold px-3 py-1 rounded-full mr-3">Step 2</span>
              Review & Finalize
            </h2>
            <p className="text-slate-500 mt-1">
              Verify the AI extraction. Ensure the <strong>Answer Key</strong> is correct before distributing.
            </p>
            {missingAnswersCount > 0 && (
               <div className="mt-3 inline-flex items-center text-amber-600 bg-amber-50 px-3 py-1 rounded-lg text-sm font-medium">
                 <TriangleAlert className="w-4 h-4 mr-2" />
                 {missingAnswersCount} questions are missing an answer key. Please select them below.
               </div>
            )}
          </div>
          
          <div className="flex items-center gap-3">
             <button
              onClick={() => setShowBulkImport(!showBulkImport)}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl transition-colors flex items-center"
            >
              <FileText className="w-4 h-4 mr-2" />
              Paste Answer Key
            </button>
            <button
              onClick={onConfirmExam}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center"
            >
              Start Student Exam
              <CirclePlay className="w-5 h-5 ml-2" />
            </button>
          </div>
        </div>

        {/* Bulk Import Drawer */}
        {showBulkImport && (
            <div className="mt-6 pt-6 border-t border-slate-100 animate-slide-down">
                <label className="block text-sm font-bold text-slate-700 mb-2">
                    Paste Answer Key Text
                </label>
                <p className="text-xs text-slate-500 mb-2">
                    Paste text containing question numbers and answers (e.g., from a separate PDF or document). 
                    <br/>Supported formats: <code className="bg-slate-100 px-1 rounded">1. A 2. B</code> or <code className="bg-slate-100 px-1 rounded">1-A, 2-B</code> etc.
                </p>
                <div className="relative">
                    <textarea
                        value={bulkText}
                        onChange={(e) => setBulkText(e.target.value)}
                        className="w-full h-32 p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-mono text-sm"
                        placeholder="1. C&#10;2. A&#10;3. D&#10;..."
                    />
                    {importStatus && (
                        <div className={`absolute bottom-4 right-4 px-3 py-1.5 rounded-lg text-sm font-bold flex items-center shadow-sm ${importStatus.type === 'success' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                            {importStatus.type === 'success' ? <Check className="w-4 h-4 mr-1.5"/> : <X className="w-4 h-4 mr-1.5"/>}
                            {importStatus.msg}
                        </div>
                    )}
                </div>
                <div className="flex justify-end mt-3 gap-2">
                    <button 
                        onClick={() => setShowBulkImport(false)}
                        className="px-4 py-2 text-slate-500 hover:text-slate-700 font-medium"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={handleBulkImport}
                        className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700"
                        disabled={!bulkText.trim()}
                    >
                        Apply Answers
                    </button>
                </div>
            </div>
        )}
      </div>

      {/* Question List */}
      <div className="grid grid-cols-1 gap-6">
        {questions.map((q, idx) => (
          <QuestionCard 
            key={idx} 
            index={idx} 
            question={q} 
            onUpdate={onUpdateQuestion} 
          />
        ))}
      </div>
       
      <div className="flex justify-center mt-12 mb-8">
        <button
            onClick={onConfirmExam}
            className="px-12 py-4 bg-indigo-600 hover:bg-indigo-700 text-white text-xl font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1"
        >
            Everything Looks Good — Start Exam
        </button>
      </div>

    </div>
  );
};

export default ReviewScreen;