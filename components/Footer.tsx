import React from 'react';
import { MessageCircle, Linkedin } from 'lucide-react';
import { Language } from '../types';
import { getTranslation } from '../utils/i18n';

interface FooterProps {
  lang: Language;
}

const Footer: React.FC<FooterProps> = ({ lang }) => {
  const t = getTranslation(lang);

  return (
    <footer className="mt-20 border-t border-arch-800 bg-arch-900/50 py-12 px-4">
      <div className="max-w-4xl mx-auto flex flex-col items-center justify-center text-center">
        
        {/* Products List Section */}
        <div className="mb-10 w-full">
          <h4 className="text-white font-bold text-lg mb-6 flex items-center justify-center gap-2">
            <span className="h-px w-6 bg-arch-accent/40"></span>
            {t.productsTitle}
            <span className="h-px w-6 bg-arch-accent/40"></span>
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 text-left rtl:text-right max-w-3xl mx-auto">
            {[t.product1, t.product2, t.product3, t.product4, t.product5, t.product6, t.product7, t.product8, t.product9].map((product, idx) => (
              <div key={idx} className="flex items-start gap-2 group">
                <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-arch-accent/60 group-hover:bg-arch-accent transition-colors flex-shrink-0"></div>
                <span className="text-gray-400 text-xs sm:text-sm leading-relaxed group-hover:text-gray-300 transition-colors">{product}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-gray-400 text-sm mb-1">
          {t.footerRights}
        </p>
        <p className="text-arch-accent/60 text-xs mb-4 font-mono">
          {t.poweredBy}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <a 
            href="https://wa.me/201099019464" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-green-600/10 hover:bg-green-600/20 text-green-400 rounded-full border border-green-600/30 transition-all duration-300"
          >
            <MessageCircle className="w-4 h-4" />
            <span className="font-mono text-sm font-bold tracking-wider">{t.whatsapp}</span>
          </a>

          <a 
            href="https://www.linkedin.com/in/hassanabdulhamid/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 rounded-full border border-blue-600/30 transition-all duration-300"
          >
            <Linkedin className="w-4 h-4" />
            <span className="font-mono text-sm font-bold tracking-wider">{t.linkedin}</span>
          </a>

          <a 
            href="https://youtu.be/SwaLXIBu8f4?si=QMXnyQvw5gK4KS0s" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-red-600/10 hover:bg-red-600/20 text-red-400 rounded-full border border-red-600/30 transition-all duration-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-youtube"><path d="M2.5 7.1c.3-1.4 1.4-2.5 2.8-2.8C8.5 4 12 4 12 4s3.5 0 6.7.3c1.4.3 2.5 1.4 2.8 2.8.3 3.1.3 4.9.3 4.9s0 1.8-.3 4.9c-.3 1.4-1.4 2.5-2.8 2.8-3.2.3-6.7.3-6.7.3s-3.5 0-6.7-.3c-1.4-.3-2.5-1.4-2.8-2.8C2 13.8 2 12 2 12s0-1.8.5-4.9z"/><path d="m10 15 5-3-5-3v6z"/></svg>
            <span className="font-mono text-sm font-bold tracking-wider">{t.youtube}</span>
          </a>
        </div>
        
        <div className="mt-8 flex items-center gap-2 opacity-30 grayscale pointer-events-none">
           <div className="h-px w-8 bg-arch-accent"></div>
           <span className="text-[10px] font-mono tracking-tighter text-white">ARCH-VIS CORE V2.5</span>
           <div className="h-px w-8 bg-arch-accent"></div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
