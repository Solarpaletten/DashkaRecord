/**
 * Upload API Route - WITH PRISMA DATABASE
 * TASK15 - Database Integration
 * TASK17 - Fixed: removed unused saveVideoFile import
 * TASK17.1 - Unified: use storage.ts ID generator
 * DashkaRecord v2.0.0-alpha
 * 
 * Handles file uploads and saves metadata to PostgreSQL
 */

import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { createRecording } from '@/lib/recordings';
import { createRecordingId } from '@/lib/storage';

const UPLOAD_DIR = path.join(process.cwd(), 'uploads/video');

/**
 * Ensure upload directory exists
 */
async function ensureUploadDir(): Promise<void> {
  await fs.mkdir(UPLOAD_DIR, { recursive: true });
}

/**
 * POST /api/upload
 * Upload a screen recording and save to database
 */
export async function POST(req: NextRequest) {
  console.log('📤 Upload request received');

  try {
    await ensureUploadDir();

    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      console.error('❌ No file in request');
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    console.log(`📁 File received: ${file.name} (${file.size} bytes)`);

    // Generate recording ID (INSIDE function!)
    const recordingId = createRecordingId();
    const filename = `${recordingId}.webm`;
    const filePath = path.join(UPLOAD_DIR, filename);

    // Save file to disk
    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(filePath, buffer);
    console.log(`💾 File saved to disk: ${filePath}`);

    // Save metadata to PostgreSQL
    try {
      const recording = await createRecording({
        id: recordingId,
        filename,
        webmPath: filePath,
        fileSizeBytes: BigInt(file.size),
        status: 'uploaded',
      });

      console.log(`✅ Recording created in database: ${recording.id}`);

      return NextResponse.json({
        success: true,
        message: 'Recording uploaded! Processing in background.',
        recordingId: recording.id,
        filename: recording.filename,
      });
    } catch (dbError) {
      // If database save fails, delete the file
      console.error(`❌ Database error, cleaning up file:`, dbError);
      try {
        await fs.unlink(filePath);
      } catch (cleanupError) {
        console.error(`⚠️ Failed to cleanup file:`, cleanupError);
      }

      throw new Error(`Database save failed: ${dbError instanceof Error ? dbError.message : 'Unknown error'}`);
    }

  } catch (error) {
    console.error('❌ Upload error:', error);

    return NextResponse.json(
      {
        error: 'Upload failed',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}