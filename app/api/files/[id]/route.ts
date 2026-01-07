import { NextRequest, NextResponse } from 'next/server';
import { readMetadata, deleteRecording } from '@/lib/storage';

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

    return NextResponse.json(metadata);
  } catch (error) {
    console.error (`❌ Error getting file ${id}:`, error);
    return NextResponse.json(
      { error: 'Failed to get recording' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    console.log (`🗑️ Deleting recording: ${id}`);
    
    const success = await deleteRecording(id);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Recording not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      status: 'success',
      message: `Recording ${id} deleted successfully`,
    });
  } catch (error) {
    console.error (`❌ Error deleting ${id}:`, error);
    return NextResponse.json(
      { error: 'Failed to delete recording' },
      { status: 500 }
    );
  }
}
