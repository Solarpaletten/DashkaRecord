import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { createRecording, updateRecording } from '@/lib/recordings';

const STORAGE_DIR = process.env.STORAGE_DIR || path.join(process.cwd(), 'recordings');

async function ensureDir(dir: string) {
  await fs.mkdir(dir, { recursive: true });
}

export async function POST(req: NextRequest) {
  console.log('📤 Upload request received');

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // 1️⃣ Create DB record
    const recording = await createRecording({
      filename: 'source.webm',
      webmPath: '',
      fileSizeBytes: BigInt(file.size),
      status: 'uploaded',
    });

    const recordingId = recording.id;
    const recordingDir = path.join(STORAGE_DIR, recordingId);
    const webmPath = path.join(recordingDir, 'source.webm');

    // 2️⃣ Create directory
    await ensureDir(recordingDir);

    // 3️⃣ Save WebM file
    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(webmPath, buffer);

    // 4️⃣ Update DB with real path
    await updateRecording(recordingId, {
      webmPath,
    });

    console.log(`✅ Upload completed: ${recordingId}`);

    return NextResponse.json({
      success: true,
      recordingId,
    });
  } catch (error) {
    console.error('❌ Upload error', error);
    return NextResponse.json(
      { error: 'Upload failed' },
      { status: 500 }
    );
  }
}
