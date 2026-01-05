/**
 * TypeScript Types for DashkaRecord v2.0.0-alpha
 * Phase 3: Real Backend Implementation
 */

export interface RecordingMetadata {
  id: string;
  filename: string;
  createdAt: string;
  updatedAt: string;

  // Paths
  videoPath: string;
  transcriptPath?: string;
  mp4Path?: string;
  translationPath?: string;

  // Processing status
  status: ProcessingStatus;
  progress: ProcessingProgress;

  // Transcription
  language?: string;
  languageConfidence?: number;
  segmentsCount?: number;

  // File info
  fileSizeBytes?: number;
  durationSeconds?: number;

  // Translation
  translated: boolean;
  translationLanguage?: string;

  // Sync
  synced: boolean;
  syncStatus?: SyncStatus;
  solarCoreId?: string;
  syncedAt?: string;

  // Screenshots
  screenshots: Screenshot[];

  // Errors
  error?: ProcessingError;
}

export type ProcessingStatus =
  | 'uploaded'
  | 'transcribing'
  | 'transcribed'
  | 'converting_mp4'
  | 'complete'
  | 'error';

export interface ProcessingProgress {
  step: string;
  stepNumber: number;
  totalSteps: number;
  message?: string;
}

export interface ProcessingError {
  step: string;
  message: string;
  timestamp: string;
}

export interface Screenshot {
  filename: string;
  timestamp: number;
  path: string;
  capturedAt: string;
  sizeBytes: number;
}

export type SyncStatus = 'pending' | 'syncing' | 'synced' | 'failed';

export interface TranscribeResult {
  text: string;
  language: string;
  languageConfidence: number;
  segments: TranscribeSegment[];
  durationSeconds: number;
}

export interface TranscribeSegment {
  start: number;
  end: number;
  text: string;
}

export type WhisperMode = 'subprocess' | 'node' | 'cloud';

export interface WhisperConfig {
  mode: WhisperMode;
  model: string;
  language?: string;
}
