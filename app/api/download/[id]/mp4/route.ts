import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import ffmpeg from 'fluent-ffmpeg';
import { getRecording, updateRecording } from '@/lib/recordings';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    // 1️⃣ Получаем запись из БД
    const recording = await getRecording(id);

    if (!recording) {
      return NextResponse.json(
        { error: 'Recording not found in database', id },
        { status: 404 }
      );
    }

    const webmPath = recording.webmPath;

    // 2️⃣ Проверяем WebM
    if (!fs.existsSync(webmPath)) {
      return NextResponse.json(
        { error: 'WebM file not found', path: webmPath },
        { status: 404 }
      );
    }

    // 3️⃣ MP4 рядом с WebM
    const mp4Path = recording.mp4Path || webmPath.replace(/\.webm$/, '.mp4').replace('source.webm', 'video.mp4');

    // 4️⃣ Если MP4 нет — создаём
    if (!fs.existsSync(mp4Path)) {
      console.log(`🔄 Converting to MP4: ${webmPath} → ${mp4Path}`);

      await new Promise<void>((resolve, reject) => {
        ffmpeg(webmPath)
          .outputOptions('-movflags faststart')
          .toFormat('mp4')
          .save(mp4Path)
          .on('end', () => resolve())
          .on('error', (err) => reject(err));
      });

      // Сохраняем путь в БД
      await updateRecording(id, { mp4Path });
      console.log(`✅ MP4 created: ${mp4Path}`);
    }

    // 5️⃣ Отдаём MP4
    const stat = fs.statSync(mp4Path);
    const stream = fs.createReadStream(mp4Path);

    return new NextResponse(stream as any, {
      headers: {
        'Content-Type': 'video/mp4',
        'Content-Length': stat.size.toString(),
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