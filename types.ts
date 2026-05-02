export interface AnalysisResult {
  category: 'Interior' | 'Exterior';
  features: string[];
  perspective: string;
  lighting: string;
  materials: string[];
  suggestedEngine: string;
  generativePrompt: string;
  motionPrompt: string;
}

export interface ProcessingState {
  status: 'idle' | 'analyzing' | 'complete' | 'error';
  error?: string;
}

export enum FileError {
  TOO_LARGE = "File is too large (max 5MB)",
  INVALID_TYPE = "Invalid file type. Please upload a JPEG or PNG.",
}

export type Language = 'en' | 'ar';
