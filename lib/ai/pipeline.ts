/**
 * AI Translation Pipeline Orchestrator
 * DashkaRecord v2.0.0-beta - TASK10 Phase 1
 * 
 * Coordinates: STT → Translation → Subtitles → TTS
 */

import { promises as fs } from 'fs';
import path from 'path';
import {
  getRecording,
  updateRecording,
  markRecordingError,
  markRecordingTranslated,
} from '@/lib/recordings';
import { transcribeAudio, STTResult } from './stt';
import { translateSegments, TranslationResult } from './translate';
import { generateSubtitles } from './subtitles';
import { generateSpeech } from './tts';

export interface PipelineConfig {
  recordingId: string;
  sourceLang: string;      // 'auto' or specific language code
  targetLang: string;      // Target language code
  mode: 'subtitles' | 'voice' | 'both';
}

export interface PipelineResult {
  recordingId: string;
  sourceLang: string;
  targetLang: string;
  sttResult: STTResult;
  translation: TranslationResult;
  artifacts: {
    srtPath?: string;
    vttPath?: string;
    ttsPath?: string;
    jsonPath?: string;
  };
}

const PROCESSED_DIR = path.join(process.cwd(), 'uploads/processed');

/**
 * Ensure processed directory exists
 */
async function ensureProcessedDir(): Promise<void> {
  await fs.mkdir(PROCESSED_DIR, { recursive: true });
}

/**
 * Run full translation pipeline
 */
export async function runTranslationPipeline(
  config: PipelineConfig
): Promise<PipelineResult> {
  console.log('\n🚀 Starting Translation Pipeline');
  console.log('='.repeat(60));
  console.log(`Recording: ${config.recordingId}`);
  console.log(`Languages: ${config.sourceLang} → ${config.targetLang}`);
  console.log(`Mode: ${config.mode}`);
  console.log('='.repeat(60));

  try {
    // Get recording metadata
    const recording = await getRecording(config.recordingId);
    if (!recording) {
      throw new Error('Recording not found');
    }

    const videoPath = recording.webmPath;

    // STEP 1: Speech-to-Text (STT)
    console.log('\n📊 Step 1/4: Speech-to-Text...');
    const sttResult = await transcribeAudio(
      videoPath,
      config.sourceLang === 'auto' ? undefined : config.sourceLang
    );

    const detectedLanguage = sttResult.language;
    const sourceLanguage = config.sourceLang === 'auto' ? detectedLanguage : config.sourceLang;

    console.log(`✅ STT Complete: ${sttResult.segments.length} segments, language: ${sourceLanguage}`);

    // STEP 2: Translation
    console.log('\n📊 Step 2/4: Translation...');
    const translation = await translateSegments(
      sttResult.segments,
      sourceLanguage,
      config.targetLang
    );

    console.log(`✅ Translation Complete: ${translation.segments.length} segments translated`);

    // STEP 3: Generate Subtitles (if requested)
    let srtPath: string | undefined;
    let vttPath: string | undefined;

    if (config.mode === 'subtitles' || config.mode === 'both') {
      console.log('\n📊 Step 3/4: Generating Subtitles...');
      const subtitles = await generateSubtitles(
        config.recordingId,
        translation.segments
      );
      srtPath = subtitles.srtPath;
      vttPath = subtitles.vttPath;
      console.log(`✅ Subtitles Generated: .srt and .vtt`);
    } else {
      console.log('\n⏭️ Step 3/4: Subtitles skipped (mode: voice only)');
    }

    // STEP 4: Generate Voice Over (if requested)
    let ttsPath: string | undefined;

    if (config.mode === 'voice' || config.mode === 'both') {
      console.log('\n📊 Step 4/4: Generating Voice Over...');
      ttsPath = await generateSpeech(config.recordingId, translation);
      console.log(`✅ Voice Over Generated: ${ttsPath}`);
    } else {
      console.log('\n⏭️ Step 4/4: Voice Over skipped (mode: subtitles only)');
    }

    // STEP 5: Save pipeline result JSON
    console.log('\n📊 Saving pipeline results...');
    const jsonPath = await savePipelineResult(
      config.recordingId,
      sourceLanguage,
      config.targetLang,
      sttResult,
      translation
    );

    // Update metadata with translation info
    try {
      await markRecordingTranslated(
        config.recordingId,
        srtPath || undefined
      );
    } catch (error) {
      await markRecordingError(
        config.recordingId,
        'pipeline',
        (error as Error).message
      );
      throw error;
    }

    const result: PipelineResult = {
      recordingId: config.recordingId,
      sourceLang: sourceLanguage,
      targetLang: config.targetLang,
      sttResult,
      translation,
      artifacts: {
        srtPath,
        vttPath,
        ttsPath,
        jsonPath,
      },
    };

    console.log('='.repeat(60));
    console.log('🎉 Pipeline Complete!');
    console.log(`Source: ${sourceLanguage} → Target: ${config.targetLang}`);
    console.log(`Artifacts: ${Object.keys(result.artifacts).filter(k => result.artifacts[k as keyof typeof result.artifacts]).length}`);
    console.log('='.repeat(60) + '\n');

    return result;

  } catch (error) {
    console.error('='.repeat(60));
    console.error('❌ Pipeline Failed');
    console.error(`Error: ${(error as Error).message}`);
    console.error('='.repeat(60) + '\n');
    throw error;
  }
}

/**
 * Save pipeline result as JSON artifact
 */
async function savePipelineResult(
  recordingId: string,
  sourceLang: string,
  targetLang: string,
  sttResult: STTResult,
  translation: TranslationResult
): Promise<string> {
  await ensureProcessedDir();

  const result = {
    recordingId,
    timestamp: new Date().toISOString(),
    sourceLang,
    targetLang,
    stt: {
      language: sttResult.language,
      duration: sttResult.duration,
      fullText: sttResult.text,
      segmentsCount: sttResult.segments.length,
    },
    translation: {
      fullOriginalText: translation.fullOriginalText,
      fullTranslatedText: translation.fullTranslatedText,
      segments: translation.segments.map(seg => ({
        id: seg.id,
        start: seg.start,
        end: seg.end,
        original: seg.originalText,
        translated: seg.translatedText,
      })),
    },
  };

  const jsonPath = path.join(PROCESSED_DIR, `${recordingId}.translation.json`);
  await fs.writeFile(jsonPath, JSON.stringify(result, null, 2), 'utf-8');

  console.log(`✅ Saved pipeline result: ${jsonPath}`);

  return jsonPath;
}

/**
 * Check if translation exists for recording
 */
export async function hasTranslation(recordingId: string): Promise<boolean> {
  const jsonPath = path.join(PROCESSED_DIR, `${recordingId}.translation.json`);
  try {
    await fs.access(jsonPath);
    return true;
  } catch {
    return false;
  }
}

/**
 * Get translation result from JSON
 */
export async function getTranslationResult(recordingId: string): Promise<any> {
  const jsonPath = path.join(PROCESSED_DIR, `${recordingId}.translation.json`);
  const content = await fs.readFile(jsonPath, 'utf-8');
  return JSON.parse(content);
}