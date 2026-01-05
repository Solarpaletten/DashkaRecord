/**
 * TypeScript Types for DashkaRecord v2.0.0-alpha
 * Phase 3: Real Backend Implementation
 */
export interface UploadResponse {
  status: 'success' | 'error';
  recording_id: string;
  message: string;
  video_url?: string;
}

export interface ApiError {
  error: string;
  details?: string;
  timestamp: string;
}

export interface RecorderSyncRequest {
  id: string;
  language: string;
  video: string;
  transcript: string;
  translation?: string;
  createdAt: string;
  duration?: number;
  fileSize?: number;
  segmentsCount?: number;
}

export type SyncStatus = 'pending' | 'syncing' | 'synced' | 'failed';

export interface RecorderSyncResponse {
  status: SyncStatus;
  recordingId: string;
  timestamp: string;
  solarCoreId?: string;
  message?: string;
  error?: string;
}

export interface TranslateRequest {
  recordingId: string;
  targetLanguage: string;
}

export interface TranslateResult {
  translatedText: string;
  translationPath: string;
}
