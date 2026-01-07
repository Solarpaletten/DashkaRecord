/**
 * MP4 Download API Route
 * TASK18 - Storage Layer Unification
 * DashkaRecord v2.0.0-alpha
 */

import { NextRequest, NextResponse } from 'next/server';
import { readFile, access } from 'fs/promises';
import { getRecording, updateRecording } from '@/lib/recordings';
import { webmToMp4 } from '@/lib/convert';

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

    let mp4Path: string | null = recording.mp4Path ?? null;

    if (!mp4Path) {
      console.log(`🔄 On-demand MP4 conversion for: ${id}`);
      mp4Path = await webmToMp4(id);
      
      if (!mp4Path) {
        return NextResponse.json(
          { error: 'MP4 conversion failed' },
          { status: 500 }
        );
      }

      await updateRecording(id, { mp4Path });
      console.log(`✅ Updated MP4 path in DB: ${id}`);
    } else {
      try {
        await access(mp4Path);
      } catch {
        console.log(`⚠️ MP4 file missing, reconverting: ${id}`);
        mp4Path = await webmToMp4(id);
        
        if (!mp4Path) {
          return NextResponse.json(
            { error: 'MP4 conversion failed' },
            { status: 404 }
          );
        }

        await updateRecording(id, { mp4Path });
      }
    }

    const fileBuffer = await readFile(mp4Path);
    console.log(`📥 Downloading MP4: ${id} (${fileBuffer.length} bytes)`);

    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': 'video/mp4',
        'Content-Disposition': `attachment; filename="recording_${id}.mp4"`,
        'Content-Length': fileBuffer.length.toString(),
      },
    });
  } catch (error) {
    console.error(`❌ MP4 download error for ${id}:`, error);
    return NextResponse.json(
      {
        error: 'Failed to download MP4 file',
        details: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
