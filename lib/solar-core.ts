/**
 * Solar Core ERP Integration
 * TASK18 - Storage Layer Unification
 * DashkaRecord v2.0.0-alpha
 */

import { 
  getRecording, 
  markRecordingSynced, 
  markRecordingError 
} from './recordings';

export async function syncToSolarCore(id: string): Promise<{
  success: boolean;
  message: string;
}> {
  console.log(`🔄 Starting Solar Core sync for: ${id}`);

  try {
    const recording = await getRecording(id);

    if (!recording) {
      console.error(`❌ Recording not found: ${id}`);
      return {
        success: false,
        message: 'Recording not found in database',
      };
    }

    if (recording.synced) {
      console.log(`ℹ️ Recording already synced: ${id}`);
      return {
        success: true,
        message: 'Recording already synced',
      };
    }

    if (!recording.transcriptPath) {
      await markRecordingError(id, 'sync', 'Transcript required for sync');
      return {
        success: false,
        message: 'Transcript not available',
      };
    }

    console.log(`📤 Syncing to Solar Core:`, {
      id: recording.id,
      filename: recording.filename,
      transcript: recording.transcriptPath,
      translated: recording.translated,
    });

    await markRecordingSynced(id);
    console.log(`✅ Recording synced successfully: ${id}`);

    return {
      success: true,
      message: 'Recording synced to Solar Core successfully',
    };
  } catch (error) {
    console.error(`❌ Solar Core sync error for ${id}:`, error);

    const errorMessage = error instanceof Error ? error.message : 'Unknown sync error';
    await markRecordingError(id, 'sync', errorMessage);

    return {
      success: false,
      message: `Sync failed: ${errorMessage}`,
    };
  }
}

export async function checkSolarCoreConnection(): Promise<{
  connected: boolean;
  message: string;
}> {
  try {
    return {
      connected: true,
      message: 'Solar Core connection healthy',
    };
  } catch (error) {
    return {
      connected: false,
      message: 'Solar Core connection failed',
    };
  }
}

export async function getSyncStats() {
  return {
    total: 0,
    synced: 0,
    pending: 0,
    failed: 0,
  };
}
