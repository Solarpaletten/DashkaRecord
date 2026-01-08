import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import ffmpeg from 'fluent-ffmpeg';

import { getRecordingPaths } from '@/lib/storage';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const { video, mp4 } = getRecordingPaths(id);

  try {
    // 1️⃣ Проверяем WebM
    if (!fs.existsSync(video)) {
      return NextResponse.json(
        { error: 'WebM not found', path: video },
        { status: 404 }
      );
    }

    // 2️⃣ Если MP4 нет — создаём
    if (!fs.existsSync(mp4)) {
      await new Promise<void>((resolve, reject) => {
        ffmpeg(video)
          .outputOptions('-movflags faststart')
          .toFormat('mp4')
          .save(mp4)
          .on('end', () => resolve())
          .on('error', (err) => reject(err));
      });
    }

    // 3️⃣ Отдаём MP4
    const stream = fs.createReadStream(mp4);

    return new NextResponse(stream as any, {
      headers: {
        'Content-Type': 'video/mp4',
        'Content-Disposition': `attachment; filename="${id}.mp4"`,
      },
    });
  } catch (error: any) {
    console.error('❌ MP4 download error:', error);
    return NextResponse.json(
      {
        error: 'Failed to download MP4 file',
        details: error?.message,
      },
      { status: 500 }
    );
  }
}
