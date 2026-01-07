import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { readMetadata } from '@/lib/storage';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const metadata = await readMetadata(id);
    
    if (!metadata) {
      return NextResponse.json(
        { error: 'Recording not found' },
        { status: 404 }
      );
    }

    // Read WebM file
    const fileBuffer = await readFile(metadata.videoPath);

    console.log(`📥 Downloading WebM: ${id} (${fileBuffer.length} bytes)`);

    // Return file with proper headers
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
      { error: 'Failed to download WebM file' },
      { status: 500 }
    );
  }
}
