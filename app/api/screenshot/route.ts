import { NextRequest, NextResponse } from 'next/server';
import { saveScreenshot } from '@/lib/storage';

export async function POST(req: NextRequest) {
  try {
    // Parse multipart form data
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const recordingId = formData.get('recording_id') as string;
    const timestamp = parseInt(formData.get('timestamp') as string) || 0;

    if (!file || !recordingId) {
      return NextResponse.json(
        { error: 'File and recording_id required' },
        { status: 400 }
      );
    }

    console.log(`📸 Screenshot upload: ${recordingId} @ ${timestamp}s`);

    // Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Generate filename
    const timestampMs = Date.now();
    const filename = `screenshot_${timestamp}_${timestampMs}.png`;

    // Save screenshot (only 3 parameters)
    const screenshotPath = await saveScreenshot(
      recordingId,
      filename,
      buffer
    );

    return NextResponse.json({
      status: 'success',
      message: 'Screenshot saved successfully',
      recording_id: recordingId,
      filename: filename,
      timestamp,
      url: `/api/static/frames/${recordingId}/${filename}`,
    });
  } catch (error) {
    console.error('❌ Screenshot upload error:', error);
    return NextResponse.json(
      {
        error: 'Screenshot upload failed',
        details: (error as Error).message,
      },
      { status: 500 }
    );
  }
}