/**
 * Text-to-Speech Module
 * DashkaRecord v2.0.0-beta - TASK10 Phase 1
 * 
 * Generates voice over using OpenAI TTS API
 */

import { promises as fs } from 'fs';
import path from 'path';
import { TranslationResult } from './translate';

const TTS_DIR = path.join(process.cwd(), 'uploads/tts');

/**
 * Ensure TTS directory exists
 */
async function ensureTTSDir(): Promise<void> {
  await fs.mkdir(TTS_DIR, { recursive: true });
}

/**
 * Get voice for target language
 */
function getVoiceForLanguage(language: string): string {
  const voiceMap: Record<string, string> = {
    en: 'alloy',    // English - neutral
    ru: 'shimmer',  // Russian - female
    de: 'echo',     // German - male
    fr: 'nova',     // French - female
    es: 'onyx',     // Spanish - male
    it: 'fable',    // Italian - male
  };

  return voiceMap[language] || 'alloy'; // Default to alloy
}

/**
 * Generate speech from translated text
 * 
 * MVP: Full narration mode (one audio file for entire text)
 */
export async function generateSpeech(
  recordingId: string,
  translation: TranslationResult
): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error('OPENAI_API_KEY not configured');
  }

  await ensureTTSDir();

  console.log(`🗣️ Generating TTS for ${recordingId} (${translation.targetLanguage})...`);

  try {
    const voice = getVoiceForLanguage(translation.targetLanguage);
    const text = translation.fullTranslatedText;

    // Call OpenAI TTS API
    const response = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'tts-1',  // Use tts-1-hd for better quality (costs more)
        voice,
        input: text,
        response_format: 'mp3',
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenAI TTS API error: ${response.status} ${errorText}`);
    }

    // Save audio file
    const audioBuffer = Buffer.from(await response.arrayBuffer());
    const audioPath = path.join(TTS_DIR, `${recordingId}.mp3`);
    await fs.writeFile(audioPath, audioBuffer);

    console.log(`✅ TTS generated: ${audioPath} (${audioBuffer.length} bytes)`);

    return audioPath;

  } catch (error) {
    console.error('❌ TTS error:', error);
    throw new Error(`Text-to-speech failed: ${(error as Error).message}`);
  }
}

/**
 * Generate segmented speech (advanced - for Phase 2)
 * 
 * Creates separate audio files for each segment, with pauses
 * Can be merged later with FFmpeg
 */
export async function generateSegmentedSpeech(
  recordingId: string,
  translation: TranslationResult
): Promise<string[]> {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error('OPENAI_API_KEY not configured');
  }

  await ensureTTSDir();

  console.log(`🗣️ Generating segmented TTS for ${recordingId}...`);

  const segmentPaths: string[] = [];
  const voice = getVoiceForLanguage(translation.targetLanguage);

  for (let i = 0; i < translation.segments.length; i++) {
    const segment = translation.segments[i];

    try {
      const response = await fetch('https://api.openai.com/v1/audio/speech', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'tts-1',
          voice,
          input: segment.translatedText,
          response_format: 'mp3',
        }),
      });

      if (!response.ok) {
        console.warn(`⚠️ Segment ${i} TTS failed, skipping`);
        continue;
      }

      const audioBuffer = Buffer.from(await response.arrayBuffer());
      const segmentPath = path.join(TTS_DIR, `${recordingId}_segment_${i}.mp3`);
      await fs.writeFile(segmentPath, audioBuffer);

      segmentPaths.push(segmentPath);

    } catch (error) {
      console.warn(`⚠️ Segment ${i} error:`, error);
    }
  }

  console.log(`✅ Generated ${segmentPaths.length}/${translation.segments.length} segment audio files`);

  return segmentPaths;
}

/**
 * Get TTS file path
 */
export function getTTSPath(recordingId: string): string {
  return path.join(TTS_DIR, `${recordingId}.mp3`);
}

/**
 * Get supported TTS voices
 */
export function getSupportedVoices() {
  return {
    alloy: 'Alloy (Neutral)',
    echo: 'Echo (Male)',
    fable: 'Fable (Male)',
    onyx: 'Onyx (Male)',
    nova: 'Nova (Female)',
    shimmer: 'Shimmer (Female)',
  };
}