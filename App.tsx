import React, { useState, useRef, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import UploadZone from './components/UploadZone';
import ResultsView from './components/ResultsView';
import { AnalysisResult, ProcessingState, Language } from './types';
import { analyzeImage } from './services/geminiService';
import { Wand2, RefreshCcw, Loader2, AlertTriangle } from 'lucide-react';
import { getTranslation } from './utils/i18n';

const App: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [processing, setProcessing] = useState<ProcessingState>({ status: 'idle' });
  const [lang, setLang] = useState<Language>('en');
  
  // Use a ref to scroll to results
  const resultsRef = useRef<HTMLDivElement>(null);

  // Update document direction on language change
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }, [lang]);

  const t = getTranslation(lang);

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    setResult(null);
    setProcessing({ status: 'idle' });
  };

  const handleClear = () => {
    setFile(null);
    setResult(null);
    setProcessing({ status: 'idle' });
  };

  const processImage = async () => {
    if (!file) return;

    setProcessing({ status: 'analyzing' });

    try {
      // Convert to Base64
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const base64String = reader.result as string;
        // Remove data URL prefix (e.g., "data:image/jpeg;base64,")
        const base64Data = base64String.split(',')[1];
        
        try {
          const analysis = await analyzeImage(base64Data, file.type, lang);
          setResult(analysis);
          setProcessing({ status: 'complete' });
          // Smooth scroll to results after a short delay to allow rendering
          setTimeout(() => {
            resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 100);
        } catch (err) {
          setProcessing({ status: 'error', error: err instanceof Error ? err.message : "Failed to analyze image" });
        }
      };
      reader.onerror = () => {
        setProcessing({ status: 'error', error: "Failed to read file" });
      };
    } catch (err) {
      setProcessing({ status: 'error', error: "Unknown error occurred" });
    }
  };

  return (
    <div className="min-h-screen grid-bg font-sans selection:bg-arch-accent/30 selection:text-white pb-20">
      <Header lang={lang} setLang={setLang} />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        
        {/* Intro Section */}
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {t.heroTitle} <span className="text-transparent bg-clip-text bg-gradient-to-r from-arch-accent to-blue-500">{t.heroTitleHighlight}</span>
          </h2>
          <p className="text-arch-700/80 text-lg max-w-2xl mx-auto leading-relaxed">
            {t.heroSubtitle}
          </p>
        </div>

        {/* Input Section */}
        <div className="space-y-8">
          <UploadZone 
            onFileSelect={handleFileSelect} 
            selectedFile={file} 
            onClear={handleClear} 
            isProcessing={processing.status === 'analyzing'}
            lang={lang}
          />

          {/* Action Bar */}
          <div className="flex justify-center">
            {processing.status === 'analyzing' ? (
              <button disabled className="flex items-center gap-3 px-8 py-4 bg-arch-800 border border-arch-700 rounded-full text-arch-accent cursor-not-allowed shadow-lg shadow-arch-accent/5">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="font-mono tracking-wider font-bold">{t.analyzing}</span>
              </button>
            ) : result ? (
              <button 
                onClick={handleClear}
                className="flex items-center gap-2 px-6 py-3 bg-arch-800 hover:bg-arch-700 border border-arch-700 text-white rounded-full transition-all"
              >
                <RefreshCcw className="w-4 h-4" />
                <span className="font-medium">{t.newAnalysis}</span>
              </button>
            ) : (
              <button
                onClick={processImage}
                disabled={!file}
                className={`
                  group flex items-center gap-3 px-8 py-4 rounded-full text-lg font-bold tracking-wide transition-all shadow-xl
                  ${!file 
                    ? 'bg-arch-800 text-gray-500 border border-arch-700 cursor-not-allowed opacity-50' 
                    : 'bg-white text-arch-900 hover:bg-arch-accent hover:text-white hover:scale-105 hover:shadow-arch-accent/20'
                  }
                `}
              >
                <Wand2 className={`w-5 h-5 ${file ? 'group-hover:animate-pulse' : ''}`} />
                <span>{t.generate}</span>
              </button>
            )}
          </div>

          {/* Error Display */}
          {processing.status === 'error' && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-lg flex items-center gap-3 justify-center animate-fade-in">
              <AlertTriangle className="w-5 h-5" />
              <span>{t.error} {processing.error || t.defaultError}</span>
            </div>
          )}
        </div>

        {/* Results Section */}
        {result && (
          <div ref={resultsRef} className="mt-16 pt-10 border-t border-arch-800">
             <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-bold text-white">{t.reportTitle}</h3>
                <span className="text-xs font-mono text-arch-gold bg-arch-gold/10 px-2 py-1 rounded border border-arch-gold/20">{t.tier}</span>
             </div>
             <ResultsView result={result} lang={lang} />
          </div>
        )}

      </main>
      
      <Footer lang={lang} />
      
      {/* Background Decor */}
      <div className="fixed top-20 left-10 rtl:left-auto rtl:right-10 w-64 h-64 bg-arch-accent/5 rounded-full blur-3xl -z-10 pointer-events-none"></div>
      <div className="fixed bottom-20 right-10 rtl:right-auto rtl:left-10 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl -z-10 pointer-events-none"></div>
    </div>
  );
};

export default App;
