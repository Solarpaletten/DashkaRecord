/**
 * Recordings Database Module
 * TASK18 - Storage Layer Unification
 * DashkaRecord v2.0.0-alpha
 * 
 * CRUD operations for recordings using Prisma
 * Single source of truth for metadata
 */

import { prisma } from './db';
import { Recording, Prisma } from '@prisma/client';
import { deleteRecordingFiles } from './storage';

/**
 * Create Recording Input (matches old RecordingMetadata interface)
 */
export interface CreateRecordingInput {
  id?: string;
  filename: string;
  webmPath: string;
  mp4Path?: string;
  transcriptPath?: string;
  subtitlesPath?: string;
  fileSizeBytes?: bigint;
  durationSeconds?: number;
  language?: string;
  languageConfidence?: number;
  status?: string;
}

/**
 * Update Recording Input
 */
export type UpdateRecordingInput = Partial<Omit<CreateRecordingInput, 'id'>>;

/**
 * Create a new recording in database
 * 
 * @param data - Recording data
 * @returns Created recording
 */
export async function createRecording(data: CreateRecordingInput): Promise<Recording> {
  console.log(`📝 Creating recording in DB: ${data.id}`);

  try {
    const recording = await prisma.recording.create({
      data: {
        filename: data.filename,
        webmPath: data.webmPath,
        mp4Path: data.mp4Path,
        transcriptPath: data.transcriptPath,
        subtitlesPath: data.subtitlesPath,
        fileSizeBytes: data.fileSizeBytes,
        durationSeconds: data.durationSeconds,
        language: data.language,
        languageConfidence: data.languageConfidence,
        status: data.status || 'uploaded',
      },
    });

    console.log(`✅ Recording created in DB: ${recording.id}`);
    return recording;
  } catch (error) {
    console.error(`❌ Failed to create recording in DB:`, error);
    throw new Error(`Failed to create recording: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * List all recordings
 * 
 * @param options - Query options (limit, offset, orderBy)
 * @returns Array of recordings
 */
export async function listRecordings(options?: {
  limit?: number;
  offset?: number;
  orderBy?: Prisma.RecordingOrderByWithRelationInput;
}): Promise<Recording[]> {
  console.log(`📋 Listing recordings from DB`);

  try {
    const recordings = await prisma.recording.findMany({
      take: options?.limit,
      skip: options?.offset,
      orderBy: options?.orderBy || { createdAt: 'desc' },
    });

    console.log(`✅ Found ${recordings.length} recordings in DB`);
    return recordings;
  } catch (error) {
    console.error(`❌ Failed to list recordings:`, error);
    throw new Error(`Failed to list recordings: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Get a single recording by ID
 * 
 * @param id - Recording ID
 * @returns Recording or null if not found
 */
export async function getRecording(id: string): Promise<Recording | null> {
  console.log(`🔍 Getting recording from DB: ${id}`);

  try {
    const recording = await prisma.recording.findUnique({
      where: { id },
    });

    if (!recording) {
      console.log(`⚠️ Recording not found in DB: ${id}`);
      return null;
    }

    console.log(`✅ Recording found in DB: ${recording.id}`);
    return recording;
  } catch (error) {
    console.error(`❌ Failed to get recording:`, error);
    throw new Error(`Failed to get recording: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Update a recording
 * 
 * @param id - Recording ID
 * @param data - Fields to update
 * @returns Updated recording
 */
export async function updateRecording(
  id: string,
  data: UpdateRecordingInput
): Promise<Recording> {
  console.log(`📝 Updating recording in DB: ${id}`);

  try {
    const recording = await prisma.recording.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });

    console.log(`✅ Recording updated in DB: ${recording.id}`);
    return recording;
  } catch (error) {
    console.error(`❌ Failed to update recording:`, error);
    throw new Error(`Failed to update recording: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Delete a recording from database ONLY
 * Note: This does NOT delete files from disk!
 * Use deleteRecordingWithFiles() for complete deletion.
 * 
 * @param id - Recording ID
 * @returns Deleted recording
 */
export async function deleteRecording(id: string): Promise<Recording> {
  console.log(`🗑️ Deleting recording from DB: ${id}`);

  try {
    const recording = await prisma.recording.delete({
      where: { id },
    });

    console.log(`✅ Recording deleted from DB: ${recording.id}`);
    return recording;
  } catch (error) {
    console.error(`❌ Failed to delete recording:`, error);
    throw new Error(`Failed to delete recording: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Delete recording from database AND all associated files
 * This is the complete deletion operation.
 * 
 * @param id - Recording ID
 * @returns True if successful
 */
export async function deleteRecordingWithFiles(id: string): Promise<boolean> {
  console.log(`🗑️ Deleting recording with files: ${id}`);

  try {
    // 1. Get recording from DB
    const recording = await getRecording(id);
    if (!recording) {
      console.log(`⚠️ Recording not found: ${id}`);
      return false;
    }

    // 2. Delete files from disk
    await deleteRecordingFiles(id, {
      webmPath: recording.webmPath,
      mp4Path: recording.mp4Path,
      transcriptPath: recording.transcriptPath,
      subtitlesPath: recording.subtitlesPath,
    });

    // 3. Delete from database
    await deleteRecording(id);

    console.log(`✅ Recording and files deleted: ${id}`);
    return true;
  } catch (error) {
    console.error(`❌ Failed to delete recording with files:`, error);
    throw error;
  }
}

/**
 * Update processing status
 * 
 * @param id - Recording ID
 * @param step - Current processing step
 * @param message - Status message
 */
export async function updateProcessingStatus(
  id: string,
  step: string,
  message?: string
): Promise<void> {
  await prisma.recording.update({
    where: { id },
    data: {
      processingStep: step,
      processingMessage: message,
      updatedAt: new Date(),
    },
  });
}

/**
 * Mark recording as having error
 * 
 * @param id - Recording ID
 * @param step - Step where error occurred
 * @param message - Error message
 */
export async function markRecordingError(
  id: string,
  step: string,
  message: string
): Promise<void> {
  await prisma.recording.update({
    where: { id },
    data: {
      status: 'error',
      errorStep: step,
      errorMessage: message,
      errorAt: new Date(),
      updatedAt: new Date(),
    },
  });
}

/**
 * Mark recording as translated
 * 
 * @param id - Recording ID
 * @param subtitlesPath - Path to subtitle files
 */
export async function markRecordingTranslated(
  id: string,
  subtitlesPath?: string
): Promise<void> {
  await prisma.recording.update({
    where: { id },
    data: {
      translated: true,
      subtitlesPath,
      status: 'translated',
      updatedAt: new Date(),
    },
  });
}

/**
 * Mark recording as synced with Solar Core
 * 
 * @param id - Recording ID
 */
export async function markRecordingSynced(id: string): Promise<void> {
  await prisma.recording.update({
    where: { id },
    data: {
      synced: true,
      status: 'synced',
      updatedAt: new Date(),
    },
  });
}

/**
 * Get recording statistics
 * 
 * @returns Recording counts by status
 */
export async function getRecordingStats() {
  const [total, uploaded, processing, translated, synced, errors] = await Promise.all([
    prisma.recording.count(),
    prisma.recording.count({ where: { status: 'uploaded' } }),
    prisma.recording.count({ where: { status: 'processing' } }),
    prisma.recording.count({ where: { translated: true } }),
    prisma.recording.count({ where: { synced: true } }),
    prisma.recording.count({ where: { status: 'error' } }),
  ]);

  return {
    total,
    uploaded,
    processing,
    translated,
    synced,
    errors,
  };
}
