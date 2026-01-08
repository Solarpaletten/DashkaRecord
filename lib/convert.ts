import ffmpeg from 'fluent-ffmpeg';
import { promises as fs } from 'fs';
import path from 'path';
import { getRecording } from '@/lib/recordings';

// Try to use @ffmpeg-installer if available
try {
  const ffmpegInstaller = require('@ffmpeg-installer/ffmpeg');
  ffmpeg.setFfmpegPath(ffmpegInstaller.path);
} catch {
  console.warn('⚠️ @ffmpeg-installer not found, using system ffmpeg');
}

/**
 * Convert WebM to MP4
 */
export async function webmToMp4(recordingId: string): Promise<string | null> {
  const recording = await getRecording(recordingId);

  if (!recording) {
    throw new Error('Recording not found in database');
  }

  const srcPath = recording.webmPath;

  const dstPath =
    recording.mp4Path ??
    path.join(
      path.dirname(srcPath),
      '../mp4',
      `${recording.id}.mp4`
    );

  // Ensure source exists
  await fs.access(srcPath);

  // Ensure output directory exists
  await fs.mkdir(path.dirname(dstPath), { recursive: true });

  console.log(`🔄 Converting WebM → MP4: ${srcPath}`);

  await new Promise<void>((resolve, reject) => {
    ffmpeg(srcPath)
      .videoCodec('libx264')
      .audioCodec('aac')
      .outputOptions(['-movflags +faststart'])
      .output(dstPath)
      .on('end', () => {
        console.log(`✅ MP4 created: ${dstPath}`);
        resolve();
      })
      .on('error', (err) => reject(err))
      .run();
  });

  return dstPath;
}

/**
 * Get video info
 */
export async function getVideoInfo(recordingId: string): Promise<{
  webmExists: boolean;
  mp4Exists: boolean;
  webmSizeMB?: number;
  mp4SizeMB?: number;
  webmHasAudio?: boolean;
  mp4HasAudio?: boolean;
  durationSeconds?: number;
}> {
  const recording = await getRecording(recordingId);

  if (!recording) {
    return {
      webmExists: false,
      mp4Exists: false,
    };
  }

  const videoPath = recording.webmPath;
  const mp4Path =
    recording.mp4Path ??
    path.join(
      path.dirname(videoPath),
      '../mp4',
      `${recording.id}.mp4`
    );

  const info: any = {
    webmExists: false,
    mp4Exists: false,
  };

  try {
    const s = await fs.stat(videoPath);
    info.webmExists = true;
    info.webmSizeMB = s.size / (1024 * 1024);
  } catch { }

  try {
    const s = await fs.stat(mp4Path);
    info.mp4Exists = true;
    info.mp4SizeMB = s.size / (1024 * 1024);
  } catch { }

  return info;
}

/**
 * Probe audio track
 */
async function probeAudioTrack(videoPath: string): Promise<{
  hasAudio: boolean;
  duration?: number;
}> {
  return new Promise((resolve) => {
    ffmpeg.ffprobe(videoPath, (err, metadata) => {
      if (err) return resolve({ hasAudio: false });

      const audio = metadata.streams?.find(
        (s) => s.codec_type === 'audio'
      );

      resolve({
        hasAudio: !!audio,
        duration: metadata.format?.duration,
      });
    });
  });
}
