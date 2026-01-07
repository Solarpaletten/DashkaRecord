import {
  getRecording,
  updateRecording,
  markRecordingError,
} from '@/lib/recordings';

export async function processRecording(recordingId: string) {
  try {
    const recording = await getRecording(recordingId);
    if (!recording) throw new Error('Recording not found');

    // 1. Transcribe
    await updateRecording(recordingId, {
      status: 'transcribing',
    });

    // 2. Convert MP4
    await updateRecording(recordingId, {
      status: 'processing',
    });

    // 3. Done
    await updateRecording(recordingId, {
      status: 'ready',
    });

  } catch (error) {
    await markRecordingError(
      recordingId,
      'processing',
      (error as Error).message
    );
    throw error;
  }
}
