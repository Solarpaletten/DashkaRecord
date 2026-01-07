/**
 * AI Artifacts Download API
 * DashkaRecord v2.0.0-beta - TASK10 Phase 1
 * 
 * GET /api/ai/download/[id]/[type]
 * Download translation artifacts: srt, vtt, tts, json
 */

import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { getSubtitlePath, readSubtitle } from '@/lib/ai/subtitles';
import { getTTSPath } from '@/lib/ai/tts';
import path from 'path';

// ✅ Правильная типизация
type RouteParams = {
  params: Promise<{
    id: string;
    type: string;
  }>;
};

export async function GET(
  req: NextRequest,
  context: RouteParams
) {
  try {
    // ✅ Правильная деструктуризация
    const { id, type } = await context.params;

    switch (type) {
      case 'srt': {
        const content = await readSubtitle(id, 'srt'); // ✅ Используется id
        return new Response(content, {
          headers: {
            'Content-Type': 'text/plain; charset=utf-8',
            'Content-Disposition': `attachment; filename="${id}.srt"`,
            'Access-Control-Allow-Origin': '*', // ✅ CORS
          },
        });
      }

      case 'vtt': {
        const content = await readSubtitle(id, 'vtt'); // ✅ Используется id
        return new Response(content, {
          headers: {
            'Content-Type': 'text/vtt; charset=utf-8',
            'Content-Disposition': `attachment; filename="${id}.vtt"`,
            'Access-Control-Allow-Origin': '*', // ✅ CORS
          },
        });
      }

      case 'tts': {
        const ttsPath = getTTSPath(id); // ✅ Используется id
        const audioBuffer = await readFile(ttsPath);

        return new Response(audioBuffer, {
          headers: {
            'Content-Type': 'audio/mpeg',
            'Content-Disposition': `attachment; filename="${id}_voiceover.mp3"`,
            'Content-Length': audioBuffer.length.toString(),
            'Access-Control-Allow-Origin': '*', // ✅ CORS
          },
        });
      }

      case 'json': {
        const jsonPath = path.join(
          process.cwd(),
          'uploads/processed',
          `${id}.translation.json` // ✅ Используется id
        );
        const content = await readFile(jsonPath, 'utf-8');

        return new Response(content, {
          headers: {
            'Content-Type': 'application/json',
            'Content-Disposition': `attachment; filename="${id}_translation.json"`,
            'Access-Control-Allow-Origin': '*', // ✅ CORS
          },
        });
      }

      default:
        return NextResponse.json(
          { error: `Invalid artifact type: ${type}. Must be: srt, vtt, tts, or json` },
          {
            status: 400,
            headers: {
              'Access-Control-Allow-Origin': '*', // ✅ CORS
            },
          }
        );
    }

  } catch (error) {
    console.error('Download artifact error:', error);
    return NextResponse.json(
      {
        error: 'Artifact not found',
        details: (error as Error).message,
      },
      {
        status: 404,
        headers: {
          'Access-Control-Allow-Origin': '*', // ✅ CORS
        },
      }
    );
  }
}