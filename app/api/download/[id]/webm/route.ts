/**
 * WebM Download API Route
 * TASK18 - Storage Layer Unification
 * DashkaRecord v2.0.0-alpha
 */

import { NextRequest, NextResponse } from 'next/server';
import { readFile, access } from 'fs/promises';
import { getRecording } from '@/lib/recordings';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const recording = await getRecording(id);
    
    if (!recording) {
      return NextResponse.json(
        { error: 'Recording not found' },
        { status: 404 }
      );
    }

    const webmPath = recording.webmPath;

    if (!webmPath) {
      return NextResponse.json(
        { error: 'WebM file path not found in database' },
        { status: 404 }
      );
    }

    try {
      await access(webmPath);
    } catch {
      return NextResponse.json(
        { error: 'WebM file not found on disk' },
        { status: 404 }
      );
    }

    const fileBuffer = await readFile(webmPath);
    console.log(`📥 Downloading WebM: ${id} (${fileBuffer.length} bytes)`);

    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': 'video/webm',
        'Content-Disposition': `attachment; filename="recording_${id}.webm"`,
        'Content-Length': fileBuffer.length.toString(),
      },
    });
  } catch (error) {
    console.error(`❌ WebM download error for ${id}:`, error);
    return NextResponse.json(
      {
        error: 'Failed to download WebM file',
        details: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
