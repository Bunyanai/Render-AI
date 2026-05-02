import React from 'react';
import { Box, Layers, Globe } from 'lucide-react';
import { Language } from '../types';

interface HeaderProps {
  lang: Language;
  setLang: (lang: Language) => void;
}

const Header: React.FC<HeaderProps> = ({ lang, setLang }) => {
  const toggleLang = () => {
    setLang(lang === 'en' ? 'ar' : 'en');
  };

  return (
    <header className="border-b border-arch-700 bg-arch-900/50 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          <div className="bg-gradient-to-tr from-arch-accent to-blue-600 p-2 rounded-lg">
            <Box className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              RENDER<span className="text-arch-accent">AI</span>
            </h1>
            <p className="text-xs text-arch-700 font-mono uppercase tracking-widest hidden sm:block">
              Architectural Vision Systems
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-4 rtl:space-x-reverse">
           <button 
            onClick={toggleLang}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-arch-700 bg-arch-800 hover:bg-arch-700 text-white transition-colors"
          >
            <Globe className="w-4 h-4 text-arch-accent" />
            <span className="text-xs font-mono font-bold">{lang.toUpperCase()}</span>
          </button>
          
          <div className="hidden md:flex items-center space-x-1 rtl:space-x-reverse px-3 py-1 rounded-full bg-arch-800 border border-arch-700">
            <Layers className="w-3 h-3 text-arch-gold" />
            <span className="text-xs font-mono text-gray-400">V2.5 CORE</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
