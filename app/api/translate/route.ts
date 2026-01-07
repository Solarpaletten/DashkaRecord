import { NextRequest, NextResponse } from 'next/server';
import { translateRecording } from '@/lib/translate';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { recordingId, targetLanguage } = body;

    if (!recordingId) {
      return NextResponse.json(
        { error: 'recordingId is required' },
        { status: 400 }
      );
    }

    const result = await translateRecording(
      recordingId,
      targetLanguage
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error('❌ Translate API error:', error);
    return NextResponse.json(
      {
        error: 'Translation failed',
        details: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
