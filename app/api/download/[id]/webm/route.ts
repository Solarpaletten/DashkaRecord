import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import { getRecording } from '@/lib/recordings';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    const recording = await getRecording(id);

    if (!recording) {
      return NextResponse.json(
        { error: 'Recording not found in database', id },
        { status: 404 }
      );
    }

    const webmPath = recording.webmPath;

    if (!fs.existsSync(webmPath)) {
      return NextResponse.json(
        { error: 'WebM file not found', path: webmPath },
        { status: 404 }
      );
    }

    const stat = fs.statSync(webmPath);
    const stream = fs.createReadStream(webmPath);

    return new NextResponse(stream as any, {
      headers: {
        'Content-Type': 'video/webm',
        'Content-Length': stat.size.toString(),
        'Content-Disposition': `attachment; filename="${id}.webm"`,
      },
    });
  } catch (error: any) {
    console.error('❌ WebM download error:', error);
    return NextResponse.json(
      {
        error: 'Failed to download WebM file',
        details: error?.message,
      },
      { status: 500 }
    );
  }
} 