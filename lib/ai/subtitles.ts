/**
 * Subtitles Generation Module
 * DashkaRecord v2.0.0-beta - TASK10 Phase 1
 * 
 * Generates .srt and .vtt subtitle files from translated segments
 */

import { promises as fs } from 'fs';
import path from 'path';
import { TranslatedSegment } from './translate';

const SUBTITLES_DIR = path.join(process.cwd(), 'uploads/subtitles');

/**
 * Ensure subtitles directory exists
 */
async function ensureSubtitlesDir(): Promise<void> {
  await fs.mkdir(SUBTITLES_DIR, { recursive: true });
}

/**
 * Format time for SRT (HH:MM:SS,mmm)
 */
function formatSRTTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  const milliseconds = Math.floor((seconds % 1) * 1000);

  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')},${milliseconds.toString().padStart(3, '0')}`;
}

/**
 * Format time for VTT (HH:MM:SS.mmm)
 */
function formatVTTTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  const milliseconds = Math.floor((seconds % 1) * 1000);

  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${milliseconds.toString().padStart(3, '0')}`;
}

/**
 * Generate SRT subtitle file
 */
export async function generateSRT(
  recordingId: string,
  segments: TranslatedSegment[]
): Promise<string> {
  await ensureSubtitlesDir();

  let srtContent = '';

  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i];

    // Sequence number
    srtContent += `${i + 1}\n`;

    // Timestamp
    srtContent += `${formatSRTTime(segment.start)} --> ${formatSRTTime(segment.end)}\n`;

    // Subtitle text
    srtContent += `${segment.translatedText}\n`;

    // Blank line between entries
    srtContent += '\n';
  }

  const srtPath = path.join(SUBTITLES_DIR, `${recordingId}.srt`);
  await fs.writeFile(srtPath, srtContent, 'utf-8');

  console.log(`✅ Generated SRT: ${srtPath} (${segments.length} entries)`);

  return srtPath;
}

/**
 * Generate VTT subtitle file
 */
export async function generateVTT(
  recordingId: string,
  segments: TranslatedSegment[]
): Promise<string> {
  await ensureSubtitlesDir();

  // VTT header
  let vttContent = 'WEBVTT\n\n';

  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i];

    // Optional cue identifier
    vttContent += `${i + 1}\n`;

    // Timestamp
    vttContent += `${formatVTTTime(segment.start)} --> ${formatVTTTime(segment.end)}\n`;

    // Subtitle text
    vttContent += `${segment.translatedText}\n`;

    // Blank line between entries
    vttContent += '\n';
  }

  const vttPath = path.join(SUBTITLES_DIR, `${recordingId}.vtt`);
  await fs.writeFile(vttPath, vttContent, 'utf-8');

  console.log(`✅ Generated VTT: ${vttPath} (${segments.length} entries)`);

  return vttPath;
}

/**
 * Generate both SRT and VTT files
 */
export async function generateSubtitles(
  recordingId: string,
  segments: TranslatedSegment[]
): Promise<{ srtPath: string; vttPath: string }> {
  console.log(`📝 Generating subtitles for ${recordingId}...`);

  const [srtPath, vttPath] = await Promise.all([
    generateSRT(recordingId, segments),
    generateVTT(recordingId, segments),
  ]);

  console.log(`✅ Subtitles generated: ${segments.length} segments`);

  return { srtPath, vttPath };
}

/**
 * Read subtitle file
 */
export async function readSubtitle(
  recordingId: string,
  format: 'srt' | 'vtt'
): Promise<string> {
  const filename = `${recordingId}.${format}`;
  const filepath = path.join(SUBTITLES_DIR, filename);

  try {
    return await fs.readFile(filepath, 'utf-8');
  } catch (error) {
    throw new Error(`Subtitle file not found: ${filename}`);
  }
}

/**
 * Get subtitle file path
 */
export function getSubtitlePath(
  recordingId: string,
  format: 'srt' | 'vtt'
): string {
  return path.join(SUBTITLES_DIR, `${recordingId}.${format}`);
}