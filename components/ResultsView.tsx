import React, { useState } from 'react';
import { AnalysisResult, Language } from '../types';
import { Copy, Check, Terminal, Lightbulb, Box, Maximize, Zap } from 'lucide-react';
import { getTranslation } from '../utils/i18n';

interface ResultsViewProps {
  result: AnalysisResult;
  lang: Language;
}

const ResultsView: React.FC<ResultsViewProps> = ({ result, lang }) => {
  const [copied, setCopied] = useState(false);
  const t = getTranslation(lang);

  const handleCopy = () => {
    navigator.clipboard.writeText(result.generativePrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const displayCategory = result.category === 'Interior' ? t.Interior : t.Exterior;

  return (
    <div className="w-full space-y-6 animate-fade-in-up">
      {/* Header Stat Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-arch-800/50 border border-arch-700 p-3 rounded-lg flex flex-col">
          <span className="text-xs uppercase tracking-widest text-gray-500 font-mono mb-1">{t.category}</span>
          <div className="flex items-center gap-2 text-arch-accent font-bold">
            <Box className="w-4 h-4" />
            {displayCategory}
          </div>
        </div>
        <div className="bg-arch-800/50 border border-arch-700 p-3 rounded-lg flex flex-col">
          <span className="text-xs uppercase tracking-widest text-gray-500 font-mono mb-1">{t.engine}</span>
          <div className="flex items-center gap-2 text-arch-gold font-bold">
            <Zap className="w-4 h-4" />
            {result.suggestedEngine}
          </div>
        </div>
        <div className="bg-arch-800/50 border border-arch-700 p-3 rounded-lg flex flex-col md:col-span-2">
          <span className="text-xs uppercase tracking-widest text-gray-500 font-mono mb-1">{t.perspective}</span>
          <div className="flex items-center gap-2 text-white font-medium truncate">
            <Maximize className="w-4 h-4 text-gray-400" />
            <span className="truncate">{result.perspective}</span>
          </div>
        </div>
      </div>

      {/* Analysis Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Features & Materials */}
        <div className="bg-arch-800 rounded-xl border border-arch-700 overflow-hidden">
          <div className="px-4 py-3 bg-black/20 border-b border-arch-700 flex items-center gap-2">
            <Terminal className="w-4 h-4 text-arch-accent" />
            <h3 className="text-sm font-bold text-gray-200 font-mono uppercase">{t.geoMat}</h3>
          </div>
          <div className="p-5 space-y-4">
            <div>
              <h4 className="text-xs text-gray-500 uppercase tracking-wider font-mono mb-2">{t.archFeatures}</h4>
              <div className="flex flex-wrap gap-2">
                {result.features.map((feature, idx) => (
                  <span key={idx} className="px-2 py-1 bg-arch-900 border border-arch-700 text-xs text-gray-300 rounded">
                    {feature}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-xs text-gray-500 uppercase tracking-wider font-mono mb-2">{t.texturePalette}</h4>
              <div className="flex flex-wrap gap-2">
                {result.materials.map((mat, idx) => (
                  <span key={idx} className="px-2 py-1 bg-arch-900 border border-arch-700 text-xs text-arch-gold rounded">
                    {mat}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Lighting Info */}
        <div className="bg-arch-800 rounded-xl border border-arch-700 overflow-hidden">
           <div className="px-4 py-3 bg-black/20 border-b border-arch-700 flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-arch-gold" />
            <h3 className="text-sm font-bold text-gray-200 font-mono uppercase">{t.lighting}</h3>
          </div>
          <div className="p-5">
             <p className="text-sm text-gray-300 leading-relaxed font-mono">
               {result.lighting}
             </p>
          </div>
        </div>
      </div>

      {/* The Prompt */}
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-arch-accent to-blue-600 rounded-xl opacity-30 group-hover:opacity-60 transition duration-500 blur"></div>
        <div className="relative bg-black rounded-xl border border-arch-700 overflow-hidden">
          <div className="px-4 py-3 bg-arch-900/50 border-b border-arch-700 flex items-center justify-between">
            <h3 className="text-sm font-bold text-white font-mono uppercase flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              {t.promptOutput}
            </h3>
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-arch-800 hover:bg-arch-700 border border-arch-700 text-xs font-mono text-white transition-all active:scale-95"
            >
              {copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
              {copied ? t.copied : t.copy}
            </button>
          </div>
          <div className="p-6">
            <pre className="whitespace-pre-wrap text-sm text-gray-300 font-mono leading-relaxed break-words text-left" style={{ direction: 'ltr' }}>
              {result.generativePrompt}
            </pre>
          </div>
        </div>
      </div>

      {/* Motion Prompt */}
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-arch-accent/50 to-purple-600/50 rounded-xl opacity-30 group-hover:opacity-60 transition duration-500 blur"></div>
        <div className="relative bg-black rounded-xl border border-arch-700 overflow-hidden">
          <div className="px-4 py-3 bg-arch-900/50 border-b border-arch-700 flex items-center justify-between">
            <h3 className="text-sm font-bold text-white font-mono uppercase flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></span>
              {/* @ts-ignore */}
              {t.motionPromptOutput || "Motion Prompt"}
            </h3>
            <button
              onClick={() => {
                navigator.clipboard.writeText(result.motionPrompt);
                const btn = document.getElementById('copy-motion-btn');
                if (btn) {
                  btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check text-green-400"><polyline points="20 6 9 17 4 12"/></svg> ${t.copied}`;
                  setTimeout(() => {
                    if (btn) btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-copy"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg> ${t.copy}`;
                  }, 2000);
                }
              }}
              id="copy-motion-btn"
              className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-arch-800 hover:bg-arch-700 border border-arch-700 text-xs font-mono text-white transition-all active:scale-95"
            >
              <Copy className="w-3 h-3" />
              {t.copy}
            </button>
          </div>
          <div className="p-6">
            <pre className="whitespace-pre-wrap text-sm text-gray-300 font-mono leading-relaxed break-words text-left" style={{ direction: 'ltr' }}>
              {result.motionPrompt}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsView;
