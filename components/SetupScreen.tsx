import React, { useState } from 'react';
import FileUpload from './FileUpload';
import { Clock, Type, ArrowRight, FileText, Sparkles, CirclePlay } from 'lucide-react';

interface SetupScreenProps {
  onStart: (file: File, duration: number, title: string) => void;
  onSample: () => void;
  isProcessing: boolean;
}

const SetupScreen: React.FC<SetupScreenProps> = ({ onStart, onSample, isProcessing }) => {
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
    <div className="w-full max-w-5xl mx-auto p-6 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-8 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Exam Configuration</h2>
            <p className="text-slate-500">Set up your online test parameters before uploading the question paper.</p>
          </div>
          <button
            onClick={onSample}
            disabled={isProcessing}
            className="flex items-center px-5 py-2.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-medium rounded-lg transition-colors text-sm border border-indigo-200"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Try Demo Exam
          </button>
        </div>

        <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Configuration Form */}
          <div className="space-y-8">
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
            </div>

            {/* Visual Guide / Sample Images */}
            <div className="pt-6 border-t border-slate-100">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6 text-center">
                How It Works
              </h4>
              <div className="flex items-center justify-center gap-6">
                
                {/* Mockup: Static PDF Input */}
                <div className="flex flex-col items-center">
                   <div className="w-36 h-48 bg-white border border-slate-300 rounded-lg shadow-sm p-3 relative group overflow-hidden">
                      <div className="absolute top-0 right-0 bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-bl">PDF</div>
                      {/* Fake Header */}
                      <div className="w-20 h-2 bg-slate-200 rounded mb-4 mt-1"></div>
                      
                      {/* Fake Question 1 */}
                      <div className="mb-3">
                        <div className="flex gap-1 mb-1">
                          <span className="text-[8px] font-bold text-slate-700">1.</span>
                          <div className="flex-1">
                            <div className="h-1 bg-slate-200 w-full mb-0.5 rounded-full"></div>
                            <div className="h-1 bg-slate-200 w-2/3 rounded-full"></div>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-1 ml-2">
                           <div className="flex items-center gap-1"><span className="text-[6px] text-slate-500">A)</span> <div className="h-0.5 w-6 bg-slate-100 rounded-full"></div></div>
                           <div className="flex items-center gap-1"><span className="text-[6px] text-slate-500">B)</span> <div className="h-0.5 w-6 bg-slate-100 rounded-full"></div></div>
                           <div className="flex items-center gap-1"><span className="text-[6px] text-slate-500">C)</span> <div className="h-0.5 w-6 bg-slate-100 rounded-full"></div></div>
                           <div className="flex items-center gap-1"><span className="text-[6px] text-slate-500">D)</span> <div className="h-0.5 w-6 bg-slate-100 rounded-full"></div></div>
                        </div>
                      </div>

                       {/* Fake Question 2 */}
                       <div>
                        <div className="flex gap-1 mb-1">
                          <span className="text-[8px] font-bold text-slate-700">2.</span>
                          <div className="flex-1">
                            <div className="h-1 bg-slate-200 w-11/12 mb-0.5 rounded-full"></div>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-1 ml-2">
                           <div className="flex items-center gap-1"><span className="text-[6px] text-slate-500">A)</span> <div className="h-0.5 w-6 bg-slate-100 rounded-full"></div></div>
                           <div className="flex items-center gap-1"><span className="text-[6px] text-slate-500">B)</span> <div className="h-0.5 w-6 bg-slate-100 rounded-full"></div></div>
                        </div>
                      </div>
                   </div>
                   <span className="text-xs font-bold text-slate-500 mt-3 uppercase tracking-wide">Input</span>
                </div>

                <div className="flex flex-col items-center justify-center space-y-1">
                  <ArrowRight className="w-5 h-5 text-indigo-300" />
                  <span className="text-[10px] font-bold text-indigo-500 bg-indigo-50 px-1.5 py-0.5 rounded">AI</span>
                </div>

                {/* Mockup: Interactive UI Output */}
                <div className="flex flex-col items-center">
                   <div className="w-36 h-48 bg-white border-2 border-indigo-500 rounded-lg shadow-md shadow-indigo-100 p-2 relative overflow-hidden">
                      {/* Fake Timer Header */}
                      <div className="bg-indigo-50 p-1.5 rounded mb-3 flex justify-between items-center border border-indigo-100">
                         <div className="w-6 h-1 bg-indigo-200 rounded"></div>
                         <div className="flex gap-1">
                            <div className="w-1.5 h-1.5 rounded-full border border-indigo-300"></div>
                            <div className="w-6 h-1.5 bg-indigo-200 rounded"></div>
                         </div>
                      </div>
                      
                      {/* Interactive Option A */}
                      <div className="space-y-1.5">
                         <div className="flex items-center gap-2 p-1.5 bg-indigo-600 rounded shadow-sm">
                           <div className="w-2 h-2 bg-white rounded-full flex items-center justify-center">
                             <div className="w-1 h-1 bg-indigo-600 rounded-full"></div>
                           </div>
                           <div className="w-16 h-1 bg-indigo-300 rounded opacity-80"></div>
                         </div>
                         {/* Option B */}
                         <div className="flex items-center gap-2 p-1.5 border border-slate-100 rounded">
                           <div className="w-2 h-2 border border-slate-300 rounded-full"></div>
                           <div className="w-12 h-1 bg-slate-100 rounded"></div>
                         </div>
                         {/* Option C */}
                         <div className="flex items-center gap-2 p-1.5 border border-slate-100 rounded">
                           <div className="w-2 h-2 border border-slate-300 rounded-full"></div>
                           <div className="w-10 h-1 bg-slate-100 rounded"></div>
                         </div>
                      </div>
                      
                      {/* Fake Submit Button */}
                      <div className="absolute bottom-2 inset-x-2">
                         <div className="w-full h-4 bg-indigo-600 rounded"></div>
                      </div>
                   </div>
                   <span className="text-xs font-bold text-indigo-600 mt-3 uppercase tracking-wide">Exam</span>
                </div>
              </div>
            </div>
          </div>

          {/* File Upload Section */}
          <div className="flex flex-col h-full">
             <label className="block text-sm font-medium text-slate-700 mb-2">
                Upload Question Paper (PDF)
              </label>
            {!file ? (
              <FileUpload onFileSelect={handleFileSelect} isProcessing={isProcessing} />
            ) : (
              <div className="flex-grow flex flex-col items-center justify-center p-8 border-2 border-indigo-100 border-dashed rounded-xl bg-indigo-50/50 transition-all">
                <div className="w-20 h-20 bg-white rounded-full shadow-sm flex items-center justify-center mb-6">
                  <FileText className="w-10 h-10 text-indigo-600" />
                </div>
                <h3 className="font-semibold text-xl text-slate-900 mb-2 max-w-xs truncate text-center" title={file.name}>
                  {file.name}
                </h3>
                <p className="text-slate-500 mb-8 font-medium">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                
                <div className="flex flex-col w-full max-w-xs space-y-3">
                  <button 
                    onClick={handleStart}
                    disabled={isProcessing}
                    className="w-full flex items-center justify-center px-6 py-3.5 text-base font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all transform active:scale-95 disabled:opacity-70 disabled:transform-none"
                  >
                    Start Exam Creation
                    <CirclePlay className="w-5 h-5 ml-2" />
                  </button>
                  <button 
                    onClick={() => setFile(null)}
                    className="w-full px-4 py-2 text-sm font-medium text-slate-500 hover:text-slate-700 hover:bg-white rounded-lg transition-colors"
                  >
                    Choose a different file
                  </button>
                </div>
              </div>
            )}
            
            <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-100 text-sm text-slate-500 leading-relaxed">
              <p>
                <strong>Note:</strong> Ensure your PDF has clear multiple-choice questions labeled with numbers (1, 2...) and options (A, B, C, D). Our AI also looks for an answer key table at the end to enable auto-grading.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SetupScreen;