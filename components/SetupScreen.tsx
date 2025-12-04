import React, { useState } from 'react';
import FileUpload from './FileUpload';
import { Clock, Type } from 'lucide-react';

interface SetupScreenProps {
  onStart: (file: File, duration: number, title: string) => void;
  isProcessing: boolean;
}

const SetupScreen: React.FC<SetupScreenProps> = ({ onStart, isProcessing }) => {
  const [duration, setDuration] = useState<number>(30);
  const [title, setTitle] = useState<string>('General Knowledge Exam');
  const [file, setFile] = useState<File | null>(null);

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
  };

  const handleStart = () => {
    if (file) {
      onStart(file, duration, title);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-8 border-b border-slate-100">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Exam Configuration</h2>
          <p className="text-slate-500">Set up your online test parameters before uploading the question paper.</p>
        </div>

        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Configuration Form */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <div className="flex items-center">
                  <Type className="w-4 h-4 mr-2 text-indigo-500" />
                  Exam Title
                </div>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                placeholder="e.g., Physics Mid-Term"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2 text-indigo-500" />
                  Duration (Minutes)
                </div>
              </label>
              <div className="flex items-center space-x-4">
                <input
                  type="range"
                  min="5"
                  max="180"
                  step="5"
                  value={duration}
                  onChange={(e) => setDuration(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
                <span className="text-lg font-semibold text-slate-900 min-w-[3rem] text-center">
                  {duration}m
                </span>
              </div>
            </div>

            <div className="pt-4">
              <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-100">
                <h4 className="font-medium text-indigo-900 text-sm mb-1">How it works</h4>
                <p className="text-xs text-indigo-700 leading-relaxed">
                  1. Upload your PDF exam paper.<br/>
                  2. AI extracts questions and the hidden answer key.<br/>
                  3. You take the test with a timer.<br/>
                  4. AI grades your answers instantly upon submission.
                </p>
              </div>
            </div>
          </div>

          {/* File Upload Section */}
          <div className="border-l border-slate-100 md:pl-8">
             <label className="block text-sm font-medium text-slate-700 mb-2">
                Upload Question Paper (PDF)
              </label>
            {!file ? (
              <FileUpload onFileSelect={handleFileSelect} isProcessing={isProcessing} />
            ) : (
              <div className="h-full flex flex-col items-center justify-center p-6 border-2 border-indigo-100 border-dashed rounded-xl bg-indigo-50/50">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                  <span className="text-3xl">📄</span>
                </div>
                <h3 className="font-semibold text-slate-900 mb-1 truncate max-w-xs">{file.name}</h3>
                <p className="text-sm text-slate-500 mb-6">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                <div className="flex space-x-3">
                  <button 
                    onClick={() => setFile(null)}
                    className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    Change File
                  </button>
                  <button 
                    onClick={handleStart}
                    disabled={isProcessing}
                    className="px-6 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-md hover:shadow-lg transition-all transform active:scale-95"
                  >
                    Start Exam
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SetupScreen;