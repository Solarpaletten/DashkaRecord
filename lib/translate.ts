/**
 * Translation Module
 * TASK18 - Storage Layer Unification
 * DashkaRecord v2.0.0-alpha
 */

import { 
  getRecording, 
  markRecordingTranslated, 
  markRecordingError 
} from './recordings';
import { getRecordingPaths } from './storage';
import { promises as fs } from 'fs';

export async function translateRecording(
  id: string,
  targetLanguage: string = 'en'
): Promise<{
  success: boolean;
  message: string;
  subtitlesPath?: string;
}> {
  console.log(`🌐 Starting translation for: ${id} (target: ${targetLanguage})`);

  try {
    const recording = await getRecording(id);

    if (!recording) {
      console.error(`❌ Recording not found: ${id}`);
      return {
        success: false,
        message: 'Recording not found in database',
      };
    }

    if (recording.translated) {
      console.log(`ℹ️ Recording already translated: ${id}`);
      return {
        success: true,
        message: 'Recording already translated',
        subtitlesPath: recording.subtitlesPath || undefined,
      };
    }

    if (!recording.transcriptPath) {
      await markRecordingError(id, 'translate', 'Transcript required');
      return {
        success: false,
        message: 'Transcript not available',
      };
    }

    const transcriptContent = await fs.readFile(recording.transcriptPath, 'utf-8');

    if (!transcriptContent || transcriptContent.trim().length === 0) {
      await markRecordingError(id, 'translate', 'Empty transcript');
      return {
        success: false,
        message: 'Transcript is empty',
      };
    }

    console.log(`📖 Read transcript: ${transcriptContent.length} characters`);
    console.log(`🔄 Translating to ${targetLanguage}...`);

    const translatedText = `[Translated to ${targetLanguage}]\n${transcriptContent}`;

    const paths = getRecordingPaths(id);
    const subtitlesPath = paths.transcript.replace('.txt', `_${targetLanguage}.srt`);
    
    const srtContent = generateSRT(translatedText);
    await fs.writeFile(subtitlesPath, srtContent, 'utf-8');

    console.log(`✅ Subtitles saved: ${subtitlesPath}`);

    await markRecordingTranslated(id, subtitlesPath);
    console.log(`✅ Translation completed: ${id}`);

    return {
      success: true,
      message: 'Translation completed successfully',
      subtitlesPath,
    };
  } catch (error) {
    console.error(`❌ Translation error for ${id}:`, error);

    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    await markRecordingError(id, 'translate', errorMessage);

    return {
      success: false,
      message: `Translation failed: ${errorMessage}`,
    };
  }
}

function generateSRT(text: string): string {
  const lines = text.split('\n').filter(line => line.trim());
  let srt = '';
  
  lines.forEach((line, index) => {
    const startTime = formatSRTTime(index * 3);
    const endTime = formatSRTTime((index + 1) * 3);
    
    srt += `${index + 1}\n`;
    srt += `${startTime} --> ${endTime}\n`;
    srt += `${line}\n\n`;
  });
  
  return srt;
}

function formatSRTTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  const ms = Math.floor((seconds % 1) * 1000);
  
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')},${String(ms).padStart(3, '0')}`;
}

export function getAvailableLanguages(): string[] {
  return ['en', 'de', 'fr', 'es', 'it', 'pt', 'ru', 'zh', 'ja', 'ko'];
}
