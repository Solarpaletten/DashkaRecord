/**
 * Speech-to-Text Module
 * DashkaRecord v2.0.0-beta - TASK10 Phase 1
 * 
 * Uses OpenAI Whisper API (cloud) for transcription with timestamps
 */

import { readFile } from 'fs/promises';

export interface STTSegment {
  id: number;
  start: number;  // seconds
  end: number;    // seconds
  text: string;
}

export interface STTResult {
  text: string;           // Full transcript
  language: string;       // Detected language (e.g. 'fr', 'de', 'en')
  duration: number;       // Total duration in seconds
  segments: STTSegment[]; // Timestamped segments
}

/**
 * Transcribe audio using OpenAI Whisper API
 */
export async function transcribeAudio(
  audioPath: string,
  sourceLanguage: string = 'auto'
): Promise<STTResult> {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error('OPENAI_API_KEY not configured');
  }

  console.log(`🎙️ Starting STT: ${audioPath} (lang: ${sourceLanguage})`);

  try {
    // Read audio file
    const audioBuffer = await readFile(audioPath);
    const filename = audioPath.split('/').pop() || 'audio.webm';

    // Create form data
    const formData = new FormData();
    formData.append('file', new Blob([audioBuffer]), filename);
    formData.append('model', 'whisper-1');
    formData.append('response_format', 'verbose_json'); // Get timestamps!

    if (sourceLanguage !== 'auto') {
      formData.append('language', sourceLanguage);
    }

    // Call OpenAI Whisper API
    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenAI Whisper API error: ${response.status} ${errorText}`);
    }

    const result = await response.json();

    // Parse segments
    const segments: STTSegment[] = (result.segments || []).map((seg: any, idx: number) => ({
      id: idx,
      start: seg.start || 0,
      end: seg.end || 0,
      text: seg.text?.trim() || '',
    }));

    // Calculate total duration
    const duration = segments.length > 0
      ? segments[segments.length - 1].end
      : 0;

    const sttResult: STTResult = {
      text: result.text || '',
      language: result.language || 'unknown',
      duration,
      segments,
    };

    console.log(`✅ STT complete: ${segments.length} segments, ${duration.toFixed(1)}s, language: ${sttResult.language}`);

    return sttResult;

  } catch (error) {
    console.error('❌ STT error:', error);
    throw new Error(`Speech-to-text failed: ${(error as Error).message}`);
  }
}

/**
 * Get supported languages for STT
 */
export function getSupportedSTTLanguages() {
  return {
    auto: 'Auto-detect',
    en: 'English',
    fr: 'French',
    de: 'German',
    es: 'Spanish',
    it: 'Italian',
    ru: 'Russian',
    lt: 'Lithuanian',
    pl: 'Polish',
    uk: 'Ukrainian',
    zh: 'Chinese',
    ja: 'Japanese',
    ko: 'Korean',
  };
}