/**
 * TranslationState Types
 * TASK11 - File Skeleton Stub
 * 
 * TODO: Define translation state management
 * - Translation status
 * - Progress tracking
 * - Error handling
 * - Artifact URLs
 */

export type OutputMode = 'subtitles' | 'voice' | 'both';

export type TranslationStatus = 
  | 'idle'
  | 'processing'
  | 'stt'
  | 'translating'
  | 'generating'
  | 'complete'
  | 'error';

export interface TranslationProgress {
  step: string;
  percentage: number;
}

export interface TranslationArtifacts {
  srt?: string;
  vtt?: string;
  tts?: string;
  json?: string;
}

export interface TranslationState {
  status: TranslationStatus;
  progress: TranslationProgress | null;
  artifacts: TranslationArtifacts | null;
  error: string | null;
  sourceLang: string;
  targetLang: string;
  mode: OutputMode;
}

export const initialTranslationState: TranslationState = {
  status: 'idle',
  progress: null,
  artifacts: null,
  error: null,
  sourceLang: 'auto',
  targetLang: 'ru',
  mode: 'both',
};

// TODO: Add translation action creators
// TODO: Add translation reducer
// TODO: Add translation context
