/**
 * Storage & File I/O Operations
 * TASK18 - Storage Layer Unification
 * DashkaRecord v2.0.0-alpha
 * 
 * This module handles ONLY file system operations.
 * Metadata is stored in PostgreSQL via lib/recordings.ts
 */

import { promises as fs } from 'fs';
import path from 'path';

// Directories
const UPLOAD_BASE = path.join(process.cwd(), 'uploads');
export const VIDEO_DIR = path.join(UPLOAD_BASE, 'video');
export const MP4_DIR = path.join(UPLOAD_BASE, 'mp4');
export const TRANSCRIPT_DIR = path.join(UPLOAD_BASE, 'transcripts');
export const SYNC_LOGS_DIR = path.join(UPLOAD_BASE, 'sync_logs');
export const FRAMES_DIR = path.join(UPLOAD_BASE, 'frames');

/**
 * Ensure all upload directories exist
 */
export async function ensureDirs(): Promise<void> {
  const dirs = [
    VIDEO_DIR,
    MP4_DIR,
    TRANSCRIPT_DIR,
    SYNC_LOGS_DIR,
    FRAMES_DIR,
  ];

  for (const dir of dirs) {
    await fs.mkdir(dir, { recursive: true });
  }
}

/**
 * Create unique recording ID
 * Format: YYYYMMDD_HHMMSS (e.g., 20260107_183045)
 */
export function createRecordingId(): string {
  const now = new Date();
  return now.toISOString()
    .replace(/[-:]/g, '')
    .replace('T', '_')
    .split('.')[0];
}

/**
 * Save WebM file to storage
 * 
 * @param id - Recording ID
 * @param fileBuffer - File buffer
 * @returns File path
 */
export async function saveWebm(
  id: string,
  fileBuffer: Buffer
): Promise<string> {
  await ensureDirs();

  const filename = `${id}.webm`;
  const filepath = path.join(VIDEO_DIR, filename);

  await fs.writeFile(filepath, fileBuffer);

  console.log(`✅ Saved WebM: ${filepath} (${fileBuffer.length} bytes)`);

  return filepath;
}

/**
 * Save screenshot file
 * Note: Metadata is NOT stored, only the file is saved
 * 
 * @param recordingId - Recording ID
 * @param filename - Screenshot filename
 * @param fileBuffer - File buffer
 * @returns File path
 */
export async function saveScreenshot(
  recordingId: string,
  filename: string,
  fileBuffer: Buffer
): Promise<string> {
  await ensureDirs();

  const recordingFramesDir = path.join(FRAMES_DIR, recordingId);
  await fs.mkdir(recordingFramesDir, { recursive: true });

  const filepath = path.join(recordingFramesDir, filename);
  await fs.writeFile(filepath, fileBuffer);

  console.log(`✅ Screenshot saved: ${filepath} (${fileBuffer.length} bytes)`);

  return filepath;
}

/**
 * Get file stats
 * 
 * @param filepath - Path to file
 * @returns File stats or default values if not found
 */
export async function getFileStats(filepath: string) {
  try {
    const stats = await fs.stat(filepath);
    return {
      exists: true,
      sizeBytes: stats.size,
      sizeMB: stats.size / (1024 * 1024),
      createdAt: stats.birthtime,
      modifiedAt: stats.mtime,
    };
  } catch {
    return {
      exists: false,
      sizeBytes: 0,
      sizeMB: 0,
    };
  }
}

/**
 * Get paths for recording files
 * 
 * @param id - Recording ID
 * @returns Object with file paths
 */
export function getRecordingPaths(id: string) {
  return {
    video: path.join(VIDEO_DIR, `${id}.webm`),
    mp4: path.join(MP4_DIR, `${id}.mp4`),
    transcript: path.join(TRANSCRIPT_DIR, `${id}.txt`),
    transcriptSegments: path.join(TRANSCRIPT_DIR, `${id}_segments.txt`),
    framesDir: path.join(FRAMES_DIR, id),
    syncLog: path.join(SYNC_LOGS_DIR, `${id}_sync.json`),
  };
}

/**
 * Delete a single file
 * 
 * @param filepath - Path to file
 * @returns True if deleted, false if not found
 */
export async function deleteFile(filepath: string): Promise<boolean> {
  try {
    await fs.unlink(filepath);
    console.log(`  ✓ Deleted: ${filepath}`);
    return true;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      console.log(`  ⚠ File not found: ${filepath}`);
      return false;
    }
    console.error(`  ❌ Error deleting file: ${filepath}`, error);
    throw error;
  }
}

/**
 * Delete directory recursively
 * 
 * @param dirpath - Path to directory
 * @returns True if deleted, false if not found
 */
export async function deleteDirectory(dirpath: string): Promise<boolean> {
  try {
    await fs.rm(dirpath, { recursive: true, force: true });
    console.log(`  ✓ Deleted directory: ${dirpath}`);
    return true;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      console.log(`  ⚠ Directory not found: ${dirpath}`);
      return false;
    }
    console.error(`  ❌ Error deleting directory: ${dirpath}`, error);
    throw error;
  }
}

/**
 * Delete all files associated with a recording
 * Note: This does NOT touch the database!
 * Use deleteRecordingWithFiles() from lib/recordings.ts for complete deletion
 * 
 * @param id - Recording ID
 * @param filePaths - Object containing paths to delete
 */
export async function deleteRecordingFiles(
  id: string,
  filePaths: {
    webmPath?: string | null;
    mp4Path?: string | null;
    transcriptPath?: string | null;
    subtitlesPath?: string | null;
  }
): Promise<void> {
  console.log(`🗑️ Deleting files for recording: ${id}`);

  const paths = getRecordingPaths(id);

  // Delete video files
  if (filePaths.webmPath) {
    await deleteFile(filePaths.webmPath);
  }
  if (filePaths.mp4Path) {
    await deleteFile(filePaths.mp4Path);
  }
  if (filePaths.transcriptPath) {
    await deleteFile(filePaths.transcriptPath);
  }
  if (filePaths.subtitlesPath) {
    await deleteFile(filePaths.subtitlesPath);
  }

  // Delete transcripts segments if exists
  await deleteFile(paths.transcriptSegments);

  // Delete sync log if exists
  await deleteFile(paths.syncLog);

  // Delete screenshots directory
  await deleteDirectory(paths.framesDir);

  console.log(`✅ Files deleted for recording: ${id}`);
}
