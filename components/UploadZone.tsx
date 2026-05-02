import React, { useCallback, useState } from 'react';
import { Upload, X, AlertCircle } from 'lucide-react';
import { FileError, Language } from '../types';
import { getTranslation } from '../utils/i18n';

interface UploadZoneProps {
  onFileSelect: (file: File) => void;
  selectedFile: File | null;
  onClear: () => void;
  isProcessing: boolean;
  lang: Language;
}

const UploadZone: React.FC<UploadZoneProps> = ({ onFileSelect, selectedFile, onClear, isProcessing, lang }) => {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const t = getTranslation(lang);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const validateAndSetFile = (file: File) => {
    setError(null);
    if (file.size > 5 * 1024 * 1024) {
      setError(FileError.TOO_LARGE);
      return;
    }
    if (!file.type.startsWith('image/')) {
      setError(FileError.INVALID_TYPE);
      return;
    }
    onFileSelect(file);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onFileSelect]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  if (selectedFile) {
    return (
      <div className="w-full relative group">
        <div className="relative rounded-lg overflow-hidden border border-arch-700 bg-arch-800 shadow-2xl">
          <img
            src={URL.createObjectURL(selectedFile)}
            alt="Upload preview"
            className="w-full h-auto max-h-[500px] object-contain mx-auto"
          />
          {!isProcessing && (
            <button
              onClick={onClear}
              className="absolute top-4 right-4 rtl:right-auto rtl:left-4 p-2 bg-red-500/80 hover:bg-red-600 text-white rounded-full transition-all backdrop-blur-sm"
            >
              <X className="w-5 h-5" />
            </button>
          )}
          <div className="absolute bottom-0 inset-x-0 bg-black/60 backdrop-blur-md p-3 flex items-center justify-between border-t border-white/10">
             <span className="text-xs font-mono text-gray-300 truncate max-w-[200px]">{selectedFile.name}</span>
             <span className="text-xs font-mono text-arch-accent">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <label
        htmlFor="file-upload"
        className={`
          relative flex flex-col items-center justify-center w-full h-80 
          rounded-xl border-2 border-dashed transition-all cursor-pointer overflow-hidden
          ${dragActive 
            ? 'border-arch-accent bg-arch-accent/5' 
            : 'border-arch-700 bg-arch-800/30 hover:border-arch-600 hover:bg-arch-800/50'
          }
          ${error ? 'border-red-500/50 bg-red-500/5' : ''}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
          {error ? (
             <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
          ) : (
            <div className={`p-4 rounded-full mb-4 transition-transform duration-300 ${dragActive ? 'scale-110 bg-arch-accent/20' : 'bg-arch-800'}`}>
               <Upload className={`w-8 h-8 ${dragActive ? 'text-arch-accent' : 'text-gray-400'}`} />
            </div>
          )}
          
          <p className="mb-2 text-lg font-medium text-gray-200">
            {error ? <span className="text-red-400">{error}</span> : t.dropText}
          </p>
          <p className="text-sm text-gray-500">
            {t.clickText}
          </p>
          <p className="mt-4 text-xs font-mono text-gray-600">
            {t.supportsText}
          </p>
        </div>
        <input
          id="file-upload"
          type="file"
          className="hidden"
          accept="image/png, image/jpeg, image/jpg"
          onChange={handleChange}
        />
      </label>
    </div>
  );
};

export default UploadZone;
