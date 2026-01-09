

import { NextResponse } from 'next/server';
import { listRecordings } from '@/lib/recordings';

export async function GET() {
  console.log('📋 Listing recordings from database');

  try {
    const recordings = await listRecordings({
      orderBy: { createdAt: 'desc' },
    });

    console.log(`✅ Found ${recordings.length} recordings`); // ✅

    // Transform to match frontend interface
    const transformedRecordings = recordings.map((recording) => ({
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
    }));

    return NextResponse.json(transformedRecordings);

  } catch (error) {
    console.error('❌ Error listing recordings:', error);

    return NextResponse.json(
      {
        error: 'Failed to list recordings',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
