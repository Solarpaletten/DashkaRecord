import { NextRequest, NextResponse } from 'next/server';
import { createRecordingId, saveWebm, createMetadata } from '@/lib/storage';
import { processRecording } from '@/lib/processing';

// Handle CORS preflight
export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    console.log('📤 Upload request received');

    // Parse multipart form data
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    console.log(`📦 File received: ${file.name} (${file.size} bytes)`);

    // Generate recording ID
    const recordingId = createRecordingId();
    const filename = `${recordingId}.webm`;

    // Validate file size (max 500MB)
    const MAX_FILE_SIZE = 500 * 1024 * 1024; // 500MB
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File too large. Max 500MB' },
        {
          status: 413,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
          },
        }
      );
    }

    // Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Save WebM file
    const videoPath = await saveWebm(recordingId, buffer);

    // Create initial metadata
    const metadata = await createMetadata(
      recordingId,
      filename,
      videoPath,
      buffer.length
    );

    console.log(`✅ Upload complete: ${recordingId}`);
    console.log(`   Starting background processing...`);

    // Start background processing (don't await!)
    processRecording(recordingId).catch((error) => {
      console.error(`Background processing error for ${recordingId}:`, error);
    });

    // Return immediately with CORS headers
    return NextResponse.json(
      {
        status: 'success',
        message: 'Video uploaded. Processing in background.',
        recording_id: recordingId,
        video_url: `/api/static/video/${filename}`,
      },
      {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      }
    );
  } catch (error) {
    console.error('❌ Upload error:', error);
    return NextResponse.json(
      {
        error: 'Upload failed',
        details: (error as Error).message,
      },
      {
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      }
    );
  }
}