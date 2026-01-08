import { prisma } from './db';
import { Recording, Prisma } from '@prisma/client';
import { deleteRecordingFiles } from './storage';

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

export type UpdateRecordingInput = Partial<Omit<CreateRecordingInput, 'id'>>;

// =========================
// CREATE
// =========================
export async function createRecording(
  data: CreateRecordingInput
): Promise<Recording> {
  console.log(`📝 Creating recording in DB`);

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

    console.log(`✅ Recording created: ${recording.id}`);
    return recording;
  } catch (error) {
    console.error(`❌ Failed to create recording`, error);
    throw error;
  }
}

// =========================
// UPDATE
// =========================
export async function updateRecording(
  id: string,
  data: UpdateRecordingInput
): Promise<Recording> {
  console.log(`📝 Updating recording: ${id}`);

  try {
    const recording = await prisma.recording.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });

    console.log(`✅ Recording updated: ${recording.id}`);
    return recording;
  } catch (error) {
    console.error(`❌ Failed to update recording`, error);
    throw error;
  }
}

// =========================
// READ
// =========================
export async function getRecording(id: string): Promise<Recording | null> {
  return prisma.recording.findUnique({
    where: { id },
  });
}

export async function listRecordings(options?: {
  limit?: number;
  offset?: number;
  orderBy?: Prisma.RecordingOrderByWithRelationInput;
}): Promise<Recording[]> {
  return prisma.recording.findMany({
    take: options?.limit,
    skip: options?.offset,
    orderBy: options?.orderBy || { createdAt: 'desc' },
  });
}

// =========================
// DELETE
// =========================
export async function deleteRecording(id: string): Promise<Recording> {
  return prisma.recording.delete({
    where: { id },
  });
}

export async function deleteRecordingWithFiles(id: string): Promise<boolean> {
  const recording = await getRecording(id);
  if (!recording) return false;

  await deleteRecordingFiles(id, {
    webmPath: recording.webmPath,
    mp4Path: recording.mp4Path,
    transcriptPath: recording.transcriptPath,
    subtitlesPath: recording.subtitlesPath,
  });

  await deleteRecording(id);
  return true;
}

// =========================
// PROCESSING STATES
// =========================
export async function updateProcessingStatus(
  id: string,
  step: string,
  message?: string
) {
  await prisma.recording.update({
    where: { id },
    data: {
      processingStep: step,
      processingMessage: message,
      updatedAt: new Date(),
    },
  });
}

export async function markRecordingError(
  id: string,
  step: string,
  message: string
) {
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

export async function markRecordingTranslated(
  id: string,
  subtitlesPath?: string
) {
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

export async function markRecordingSynced(id: string) {
  await prisma.recording.update({
    where: { id },
    data: {
      synced: true,
      status: 'synced',
      updatedAt: new Date(),
    },
  });
}

// =========================
// STATS
// =========================
export async function getRecordingStats() {
  const [total, uploaded, processing, translated, synced, errors] =
    await Promise.all([
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
