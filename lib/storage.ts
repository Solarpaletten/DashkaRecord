
import { promises as fs } from 'fs';
import path from 'path';

// Directories
const UPLOAD_BASE = process.env.UPLOADS_PATH || path.join(process.cwd(), 'uploads');

export const VIDEO_DIR = path.join(UPLOAD_BASE, 'video');
export const MP4_DIR = path.join(UPLOAD_BASE, 'mp4');
export const TRANSCRIPT_DIR = path.join(UPLOAD_BASE, 'transcripts');
export const SYNC_LOGS_DIR = path.join(UPLOAD_BASE, 'sync_logs');
export const FRAMES_DIR = path.join(UPLOAD_BASE, 'frames');

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

export function createRecordingId(): string {
  const now = new Date();
  return now.toISOString()
    .replace(/[-:]/g, '')
    .replace('T', '_')
    .split('.')[0];
}

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
