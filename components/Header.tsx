import React, { useState, useEffect } from 'react';
import { Box, Layers, Globe, Settings, X } from 'lucide-react';
import { Language } from '../types';
import { getTranslation } from '../utils/i18n';

interface HeaderProps {
  lang: Language;
  setLang: (lang: Language) => void;
}

const Header: React.FC<HeaderProps> = ({ lang, setLang }) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const t = getTranslation(lang);

  useEffect(() => {
    const savedKey = localStorage.getItem('customGeminiKey') || '';
    setApiKey(savedKey);
  }, []);

  const toggleLang = () => {
    setLang(lang === 'en' ? 'ar' : 'en');
  };

  const saveSettings = () => {
    if (apiKey.trim()) {
      localStorage.setItem('customGeminiKey', apiKey.trim());
    } else {
      localStorage.removeItem('customGeminiKey');
    }
    setIsSettingsOpen(false);
  };

  return (
    <>
      <header className="border-b border-arch-700 bg-arch-900/50 backdrop-blur-md sticky top-0 z-40">
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
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <button 
              onClick={() => setIsSettingsOpen(true)}
              className="p-2 rounded-lg border border-arch-700 bg-arch-800 hover:bg-arch-700 text-gray-400 hover:text-white transition-colors"
              title={t.aiSettings}
            >
              <Settings className="w-4 h-4" />
            </button>
            
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

      {/* Settings Modal */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
          <div className="bg-arch-900 border border-arch-700 rounded-2xl w-full max-w-md shadow-2xl relative overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-arch-800 bg-arch-900/50">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Settings className="w-5 h-5 text-arch-accent" />
                {t.aiSettings}
              </h3>
              <button 
                onClick={() => setIsSettingsOpen(false)}
                className="text-gray-400 hover:text-white p-1 rounded-md hover:bg-arch-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Body */}
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {t.customApiKey}
                </label>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="AIzaSy..."
                  className="w-full bg-arch-800 border border-arch-700 rounded-lg px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-arch-accent focus:border-transparent transition-all"
                />
                <p className="mt-2 text-xs text-gray-400 leading-relaxed">
                  {t.apiKeyDesc}
                </p>
              </div>
            </div>
            
            {/* Footer */}
            <div className="p-5 border-t border-arch-800 bg-arch-900/30 flex justify-end gap-3">
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="px-5 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-arch-800 transition-colors"
              >
                {t.close}
              </button>
              <button
                onClick={saveSettings}
                className="px-5 py-2 bg-arch-accent hover:bg-arch-accent/90 text-white rounded-lg text-sm font-medium shadow-lg shadow-arch-accent/20 transition-all active:scale-95"
              >
                {t.save}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
