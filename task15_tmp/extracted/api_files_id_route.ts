/**
 * Single File API Route - WITH PRISMA DATABASE
 * TASK15 - Database Integration
 * DashkaRecord v2.0.0-alpha
 * 
 * Get/Delete individual recordings from PostgreSQL
 */

import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import { getRecording, deleteRecording } from '@/lib/recordings';

/**
 * GET /api/files/[id]
 * Get a single recording by ID
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  
  console.log(`🔍 Getting recording: ${id}`);

  try {
    const recording = await getRecording(id);

    if (!recording) {
      return NextResponse.json(
        { error: 'Recording not found' },
        { status: 404 }
      );
    }

    // Transform to match frontend interface
    const transformed = {
      id: recording.id,
      filename: recording.filename,
      createdAt: recording.createdAt.toISOString(),
      updatedAt: recording.updatedAt.toISOString(),
      videoPath: recording.webmPath,
      mp4Path: recording.mp4Path || undefined,
      transcriptPath: recording.transcriptPath || undefined,
      subtitlesPath: recording.subtitlesPath || undefined,
      fileSizeBytes: recording.fileSizeBytes ? Number(recording.fileSizeBytes) : undefined,
      durationSeconds: recording.durationSeconds || undefined,
      language: recording.language || undefined,
      status: recording.status,
      translated: recording.translated,
      synced: recording.synced,
    };

    return NextResponse.json(transformed);

  } catch (error) {
    console.error(`❌ Error getting recording:`, error);

    return NextResponse.json(
      {
        error: 'Failed to get recording',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/files/[id]
 * Delete a recording and its files
 */
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  
  console.log(`🗑️ Deleting recording: ${id}`);

  try {
    // Get recording to find file paths
    const recording = await getRecording(id);

    if (!recording) {
      return NextResponse.json(
        { error: 'Recording not found' },
        { status: 404 }
      );
    }

    // Delete files from disk
    const filesToDelete = [
      recording.webmPath,
      recording.mp4Path,
      recording.transcriptPath,
      recording.subtitlesPath,
    ].filter(Boolean) as string[];

    console.log(`🗑️ Deleting ${filesToDelete.length} files from disk`);

    for (const filePath of filesToDelete) {
      try {
        await fs.unlink(filePath);
        console.log(`✅ Deleted file: ${filePath}`);
      } catch (error) {
        console.warn(`⚠️ Failed to delete file: ${filePath}`, error);
        // Continue deleting other files even if one fails
      }
    }

    // Delete from database
    await deleteRecording(id);

    console.log(`✅ Recording deleted: ${id}`);

    return NextResponse.json({
      success: true,
      message: 'Recording deleted successfully',
      recordingId: id,
    });

  } catch (error) {
    console.error(`❌ Error deleting recording:`, error);

    return NextResponse.json(
      {
        error: 'Failed to delete recording',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
