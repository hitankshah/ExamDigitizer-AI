
import React, { ReactNode } from 'react';
import { BookOpenCheck, BrainCircuit, Github } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2 rounded-lg shadow-md">
              <BookOpenCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 tracking-tight">
                ExamDigitizer AI
              </h1>
            </div>
          </div>
          
          <div className="flex items-center space-x-6 text-sm">
             <div className="hidden md:flex items-center text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
               <BrainCircuit className="w-3.5 h-3.5 mr-1.5 text-indigo-500" />
               <span className="font-medium">Gemini 2.5 Flash</span>
             </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col relative w-full">
        {children}
      </main>

       {/* Footer */}
       <footer className="bg-white border-t border-slate-200 py-8 mt-auto">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center text-slate-500 text-sm">
            <p>&copy; {new Date().getFullYear()} ExamDigitizer AI. All rights reserved.</p>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <span className="hover:text-indigo-600 cursor-pointer transition-colors">Privacy Policy</span>
              <span className="hover:text-indigo-600 cursor-pointer transition-colors">Terms of Service</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
