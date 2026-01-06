/**
 * Translation API Contracts
 * DashkaRecord v2.0.0-beta - TASK12
 * 
 * Types for Translation Pipeline API
 * Used by UI, API routes, and AI modules
 */

// ============================================
// REQUEST TYPES
// ============================================

export type OutputMode = 'subtitles' | 'voice' | 'both';

export interface TranslationRequest {
  id: string;                    // Recording ID
  sourceLang: string;            // Source language code or 'auto'
  targetLang: string;            // Target language code
  mode: OutputMode;              // Output mode
}

// ============================================
// RESPONSE TYPES
// ============================================

export interface TranslationStats {
  segments: number;              // Number of subtitle segments
  duration: number;              // Total duration in seconds
}

export interface TranslationArtifacts {
  srt?: string;                  // URL to .srt file
  vtt?: string;                  // URL to .vtt file
  tts?: string;                  // URL to .mp3 voice file
  json?: string;                 // URL to .json data file
}

export interface TranslationResponse {
  ok: boolean;
  recordingId: string;
  sourceLang: string;            // Detected/specified source language
  targetLang: string;            // Target language
  stats: TranslationStats;
  artifacts: TranslationArtifacts;
}

export interface TranslationError {
  ok: false;
  error: string;
  details?: string;
}

// ============================================
// PROGRESS TYPES
// ============================================

export type TranslationStatus = 
  | 'idle'
  | 'validating'
  | 'stt'                        // Speech-to-text in progress
  | 'translating'                // Translation in progress
  | 'generating-subtitles'       // Subtitle generation
  | 'generating-voice'           // TTS generation
  | 'complete'
  | 'error';

export interface TranslationProgress {
  status: TranslationStatus;
  step: string;                  // Human-readable step description
  percentage: number;            // Progress percentage (0-100)
}

// ============================================
// STATE TYPES
// ============================================

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

// ============================================
// PIPELINE TYPES
// ============================================

export interface PipelineConfig {
  recordingId: string;
  sourceLang: string;
  targetLang: string;
  mode: OutputMode;
}

export interface PipelineResult {
  recordingId: string;
  sourceLang: string;
  targetLang: string;
  stats: TranslationStats;
  artifacts: TranslationArtifacts;
}
