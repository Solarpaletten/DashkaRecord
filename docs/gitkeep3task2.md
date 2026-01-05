leanid@MacBook-Pro-LeanidHamburg DashkaRecord % pnpm build               

> dashka-record@2.0.0-alpha build /Users/leanid/Documents/ITproject/DashkaRecord
> next build

   ▲ Next.js 14.1.0
   - Environments: .env.local

   Creating an optimized production build ...
Failed to compile.

./app/layout.tsx
Module not found: Can't resolve '@app/globals.css'

https://nextjs.org/docs/messages/module-not-found

./lib/processing.ts
Module not found: Can't resolve '@/scripts/transcribe'

https://nextjs.org/docs/messages/module-not-found

Import trace for requested module:
./app/api/upload/route.ts


> Build failed because of webpack errors
 ELIFECYCLE  Command failed with exit code 1.
leanid@MacBook-Pro-LeanidHamburg DashkaRecord % cat app/layout.tsx
import type { Metadata } from "next";
import "@app/globals.css";

export const metadata: Metadata = {
  title: "Solar Recorder - Local Screen Recording",
  description: "AI-powered screen recording with automatic transcription and translation",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
leanid@MacBook-Pro-LeanidHamburg DashkaRecord % cat app/globals.css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --solar-blue: #2563eb;
  --solar-blue-dark: #1e40af;
  --solar-blue-light: #3b82f6;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
}

@layer utilities {
  .text-balance {
    text-wrap: balance;
  }
}
leanid@MacBook-Pro-LeanidHamburg DashkaRecord % cat lib/processing.ts
/**
 * Background Processing Orchestrator
 * DashkaRecord v2.0.0-alpha - Phase 3
 * 
 * Handles async processing of recordings:
 * 1. Transcribe (Whisper)
 * 2. Convert to MP4
 * 3. Update metadata
 */

import { RecordingMetadata } from '@/types/api';
import {
  readMetadata,
  updateMetadata,
  updateProcessingStatus,
  recordProcessingError,
  getRecordingPaths,
} from '@/lib/storage';
import { transcribe } from '@/scripts/transcribe';
import { webmToMp4 } from '@/lib/convert';

/**
 * Process recording in background
 * Called asynchronously after upload
 */
export async function processRecording(recordingId: string): Promise<void> {
  console.log(`\n🎬 Starting background processing: ${recordingId}`);
  console.log('='.repeat(60));

  try {
    const metadata = await readMetadata(recordingId);
    if (!metadata) {
      throw new Error('Recording metadata not found');
    }

    // STEP 1: Transcribe
    await updateProcessingStatus(
      recordingId,
      'transcribing',
      'Transcribing audio with Whisper',
      1
    );

    let transcriptPath: string;
    let language: string;
    let confidence: number;

    try {
      const transcribeResult = await transcribe(
        recordingId,
        metadata.videoPath
      );

      transcriptPath = transcribeResult.textPath;
      language = transcribeResult.language;
      confidence = transcribeResult.confidence;

      await updateMetadata(recordingId, {
        transcriptPath,
        language,
        languageConfidence: confidence,
        status: 'transcribed',
      });

      console.log(`✅ Step 1/3 complete: Transcription (${language})`);
    } catch (error) {
      await recordProcessingError(
        recordingId,
        'transcribe',
        (error as Error).message
      );
      throw error;
    }

    // STEP 2: Convert to MP4
    await updateProcessingStatus(
      recordingId,
      'converting_mp4',
      'Converting to MP4 for compatibility',
      2
    );

    let mp4Path: string | null = null;

    try {
      mp4Path = await webmToMp4(recordingId);

      if (mp4Path) {
        await updateMetadata(recordingId, {
          mp4Path,
        });
        console.log(`✅ Step 2/3 complete: MP4 conversion`);
      } else {
        console.warn(`⚠️ MP4 conversion returned null, continuing`);
      }
    } catch (error) {
      await recordProcessingError(
        recordingId,
        'mp4_conversion',
        (error as Error).message
      );
      // MP4 is non-critical, continue
      console.warn(`⚠️ MP4 conversion failed, continuing: ${(error as Error).message}`);
    }

    // STEP 3: Mark as complete
    await updateProcessingStatus(
      recordingId,
      'complete',
      'Processing complete',
      3,
      'All steps completed successfully'
    );

    console.log('='.repeat(60));
    console.log(`🎉 Background processing complete: ${recordingId}\n`);
  } catch (error) {
    console.error('='.repeat(60));
    console.error(`❌ Background processing failed: ${recordingId}`);
    console.error(`Error: ${(error as Error).message}\n`);

    // Ensure error is recorded
    try {
      const currentMetadata = await readMetadata(recordingId);
      if (currentMetadata && currentMetadata.status !== 'error') {
        await recordProcessingError(
          recordingId,
          'unknown',
          (error as Error).message
        );
      }
    } catch {
      // Ignore metadata errors
    }
  }
}

/**
 * Get processing status for recording
 */
export async function getProcessingStatus(recordingId: string): Promise<{
  status: string;
  progress: number;
  message?: string;
  error?: string;
} | null> {
  const metadata = await readMetadata(recordingId);
  if (!metadata) {
    return null;
  }

  return {
    status: metadata.status,
    progress: metadata.progress?.stepNumber || 0,
    message: metadata.progress?.message,
    error: metadata.error?.message,
  };
}

/**
 * Retry failed processing
 */
export async function retryProcessing(recordingId: string): Promise<boolean> {
  try {
    const metadata = await readMetadata(recordingId);
    if (!metadata) {
      return false;
    }

    // Reset error state
    await updateMetadata(recordingId, {
      status: 'uploaded',
      error: undefined,
      progress: {
        step: 'uploaded',
        stepNumber: 1,
        totalSteps: 3,
        message: 'Retrying processing',
      },
    });

    // Start processing again
    processRecording(recordingId).catch((error) => {
      console.error(`Retry failed for ${recordingId}:`, error);
    });

    return true;
  } catch {
    return false;
  }
}%                                                                                                   
leanid@MacBook-Pro-LeanidHamburg DashkaRecord % cat lib/transcribe.ts
/**
 * Whisper Transcription Adapter
 * DashkaRecord v2.0.0-alpha - Phase 3
 * 
 * Supports multiple modes:
 * - subprocess: Call Python script with Whisper
 * - node: Use whisper-node (if available)
 * - cloud: Use OpenAI Whisper API
 */

import { exec } from 'child_process';
import { promises as fs } from 'fs';
import path from 'path';
import { promisify } from 'util';
import { TranscribeResult, WhisperConfig, WhisperMode } from '@/types/api';

const execPromise = promisify(exec);

// Configuration from environment
const WHISPER_MODE: WhisperMode = (process.env.WHISPER_MODE as WhisperMode) || 'subprocess';
const WHISPER_MODEL = process.env.WHISPER_MODEL || 'base';

/**
 * Main transcription function
 */
export async function transcribe(
  recordingId: string,
  videoPath: string,
  language?: string
): Promise<{ textPath: string; segmentsPath: string; language: string; confidence: number }> {
  console.log(`🎙️ Starting transcription for ${recordingId} (mode: ${WHISPER_MODE})`);

  const config: WhisperConfig = {
    mode: WHISPER_MODE,
    model: WHISPER_MODEL,
    language,
  };

  let result: TranscribeResult;

  switch (config.mode) {
    case 'subprocess':
      result = await transcribeSubprocess(videoPath, config);
      break;
    case 'node':
      result = await transcribeNode(videoPath, config);
      break;
    case 'cloud':
      result = await transcribeCloud(videoPath, config);
      break;
    default:
      throw new Error(`Unknown Whisper mode: ${config.mode}`);
  }

  // Save results to files
  const paths = getRecordingPaths(recordingId);

  // Save main transcript
  await fs.writeFile(
    paths.transcript,
    `[Language: ${result.language}]\n[Confidence: ${(result.languageConfidence * 100).toFixed(1)}%]\n\n${result.text}`,
    'utf-8'
  );

  // Save segments with timestamps
  const segmentsText = result.segments
    .map(s => `[${formatTime(s.start)} --> ${formatTime(s.end)}] ${s.text}`)
    .join('\n');

  await fs.writeFile(paths.transcriptSegments, segmentsText, 'utf-8');

  console.log(`✅ Transcription complete: ${result.language} (${result.segments.length} segments)`);

  return {
    textPath: paths.transcript,
    segmentsPath: paths.transcriptSegments,
    language: result.language,
    confidence: result.languageConfidence,
  };
}

/**
 * Subprocess mode: Call Python script
 */
async function transcribeSubprocess(
  videoPath: string,
  config: WhisperConfig
): Promise<TranscribeResult> {
  const scriptPath = path.join(process.cwd(), 'scripts/transcribe.py');

  // Check if script exists
  try {
    await fs.access(scriptPath);
  } catch {
    throw new Error(`Python transcribe script not found: ${scriptPath}`);
  }

  const outTextPath = `${videoPath}.transcript.json`;

  let command = `python3 ${scriptPath} --input "${videoPath}" --output "${outTextPath}" --model ${config.model}`;

  if (config.language) {
    command += ` --language ${config.language}`;
  }

  console.log(`🐍 Executing: ${command}`);

  try {
    const { stdout, stderr } = await execPromise(command, {
      timeout: 600000, // 10 minutes timeout
    });

    if (stderr) {
      console.warn('Python stderr:', stderr);
    }

    // Read result from JSON file
    const resultContent = await fs.readFile(outTextPath, 'utf-8');
    const result = JSON.parse(resultContent);

    // Clean up temp file
    await fs.unlink(outTextPath).catch(() => { });

    return {
      text: result.text,
      language: result.language,
      languageConfidence: result.language_probability || 0.9,
      segments: result.segments || [],
      durationSeconds: result.duration || 0,
    };
  } catch (error) {
    console.error('❌ Subprocess transcription error:', error);
    throw new Error(`Transcription failed: ${(error as Error).message}`);
  }
}

/**
 * Node mode: Use whisper-node (if installed)
 */
async function transcribeNode(
  videoPath: string,
  config: WhisperConfig
): Promise<TranscribeResult> {
  // This would require whisper-node package
  // For now, throw error with instructions
  throw new Error(
    'whisper-node mode not implemented. Install whisper-node or use subprocess mode.\n' +
    'Set WHISPER_MODE=subprocess in .env.local'
  );

  /* Future implementation:
  const { WhisperModel } = await import('whisper-node');
  const whisper = new WhisperModel({ modelName: config.model });
  const result = await whisper.transcribe(videoPath);
  return result;
  */
}

/**
 * Cloud mode: Use OpenAI Whisper API
 */
async function transcribeCloud(
  videoPath: string,
  config: WhisperConfig
): Promise<TranscribeResult> {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error(
      'OpenAI API key not found. Set OPENAI_API_KEY in .env.local or use subprocess mode.'
    );
  }

  try {
    // Read file
    const fileBuffer = await fs.readFile(videoPath);
    const filename = path.basename(videoPath);

    // Create FormData
    const formData = new FormData();
    formData.append('file', new Blob([fileBuffer]), filename);
    formData.append('model', 'whisper-1');

    if (config.language) {
      formData.append('language', config.language);
    }

    formData.append('response_format', 'verbose_json');

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenAI API error: ${response.status} ${errorText}`);
    }

    const result = await response.json();

    return {
      text: result.text,
      language: result.language || 'unknown',
      languageConfidence: 0.95, // OpenAI doesn't provide this
      segments: result.segments || [],
      durationSeconds: result.duration || 0,
    };
  } catch (error) {
    console.error('❌ Cloud transcription error:', error);
    throw new Error(`Cloud transcription failed: ${(error as Error).message}`);
  }
}

/**
 * Format seconds to HH:MM:SS
 */
function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hours > 0) {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Get supported languages
 */
export function getSupportedLanguages() {
  return {
    en: 'English',
    ru: 'Russian',
    lt: 'Lithuanian',
    de: 'German',
    fr: 'French',
    es: 'Spanish',
    it: 'Italian',
    pl: 'Polish',
    uk: 'Ukrainian',
    auto: 'Auto-detect',
  };
}

/**
 * Check Whisper availability
 */
export async function checkWhisperAvailability(): Promise<{
  available: boolean;
  mode: WhisperMode;
  message: string;
}> {
  switch (WHISPER_MODE) {
    case 'subprocess':
      try {
        const scriptPath = path.join(process.cwd(), 'scripts/transcribe.py');
        await fs.access(scriptPath);

        // Try to run python
        await execPromise('python3 --version');

        return {
          available: true,
          mode: 'subprocess',
          message: 'Python + Whisper script available',
        };
      } catch {
        return {
          available: false,
          mode: 'subprocess',
          message: 'Python or transcribe.py not found. Install Python 3 and create scripts/transcribe.py',
        };
      }

    case 'node':
      return {
        available: false,
        mode: 'node',
        message: 'whisper-node not implemented yet. Use subprocess mode.',
      };

    case 'cloud':
      return {
        available: !!process.env.OPENAI_API_KEY,
        mode: 'cloud',
        message: process.env.OPENAI_API_KEY
          ? 'OpenAI API key configured'
          : 'OPENAI_API_KEY not set in environment',
      };

    default:
      return {
        available: false,
        mode: WHISPER_MODE,
        message: 'Unknown Whisper mode',
      };
  }
}
leanid@MacBook-Pro-LeanidHamburg DashkaRecord % cat types/api.ts
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

export interface RecorderSyncResponse {
  status: SyncStatus;
  recordingId: string;
  timestamp: string;
  solarCoreId?: string;
  message?: string;
  error?: string;
}

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

export interface TranslateRequest {
  recordingId: string;
  targetLanguage: string;
}

export interface TranslateResult {
  translatedText: string;
  translationPath: string;
}

export type WhisperMode = 'subprocess' | 'node' | 'cloud';

export interface WhisperConfig {
  mode: WhisperMode;
  model: string;
  language?: string;
}

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
leanid@MacBook-Pro-LeanidHamburg DashkaRecord % 

error task3