import React, { useCallback, useState } from 'react';
import { Upload, FileText, Loader2, AlertCircle } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  isProcessing: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, isProcessing }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    setError(null);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      validateAndProcess(files[0]);
    }
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    if (e.target.files && e.target.files.length > 0) {
      validateAndProcess(e.target.files[0]);
    }
  };

  const validateAndProcess = (file: File) => {
    if (file.type !== 'application/pdf') {
      setError('Please upload a valid PDF file.');
      return;
    }
    // Limit size if necessary, but PDF logic handles reasonably large files
    if (file.size > 20 * 1024 * 1024) { // 20MB limit warning
       setError('File is large. Processing might take a while.');
       // Still allow it, just warn
    }
    onFileSelect(file);
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-8">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300
          ${isDragging 
            ? 'border-primary bg-indigo-50 scale-[1.02]' 
            : 'border-slate-300 hover:border-primary hover:bg-slate-50 bg-white'
          }
          ${isProcessing ? 'opacity-50 pointer-events-none' : ''}
        `}
      >
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="p-4 bg-indigo-100 rounded-full">
            {isProcessing ? (
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            ) : (
              <Upload className="w-8 h-8 text-primary" />
            )}
          </div>
          
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-slate-800">
              {isProcessing ? 'Processing Exam Paper...' : 'Upload Exam PDF'}
            </h3>
            <p className="text-slate-500 max-w-sm mx-auto">
              Drag and drop your PDF exam paper here, or click to browse.
              We'll automatically extract questions and answers.
            </p>
          </div>

          {!isProcessing && (
            <div className="mt-4">
               <label 
                htmlFor="file-upload" 
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary hover:bg-indigo-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
              >
                Browse Files
                <input 
                  id="file-upload" 
                  name="file-upload" 
                  type="file" 
                  className="sr-only" 
                  accept=".pdf"
                  onChange={handleFileInput}
                />
              </label>
            </div>
          )}
          
          {error && (
            <div className="flex items-center space-x-2 text-red-500 mt-4 bg-red-50 px-4 py-2 rounded-lg">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm font-medium">{error}</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-slate-600 text-sm">
        <div className="flex items-center space-x-2 p-3 bg-white rounded-lg shadow-sm">
          <FileText className="w-4 h-4 text-secondary" />
          <span>Upload PDF Exam</span>
        </div>
        <div className="flex items-center space-x-2 p-3 bg-white rounded-lg shadow-sm">
          <Loader2 className="w-4 h-4 text-secondary" />
          <span>AI Extraction</span>
        </div>
        <div className="flex items-center space-x-2 p-3 bg-white rounded-lg shadow-sm">
          <FileText className="w-4 h-4 text-secondary" />
          <span>Export JSON</span>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
