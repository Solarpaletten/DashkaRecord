/**
 * useTranslation Hook
 * DashkaRecord v2.0.0-beta - TASK12
 * 
 * React hook for managing translation pipeline
 * Connects UI to /api/ai/pipeline endpoint
 */

import { useState, useCallback } from 'react';
import type {
  TranslationRequest,
  TranslationResponse,
  TranslationError,
  TranslationState,
  OutputMode,
  initialTranslationState as initialState,
} from '@/types/translation';

// Import initial state
const initialTranslationState: TranslationState = {
  status: 'idle',
  progress: null,
  artifacts: null,
  error: null,
  sourceLang: 'auto',
  targetLang: 'ru',
  mode: 'both',
};

export interface UseTranslationResult {
  state: TranslationState;
  startTranslation: (
    recordingId: string,
    sourceLang?: string,
    targetLang?: string,
    mode?: OutputMode
  ) => Promise<void>;
  cancelTranslation: () => void;
  resetState: () => void;
  isProcessing: boolean;
}

export function useTranslation(): UseTranslationResult {
  const [state, setState] = useState<TranslationState>(initialTranslationState);
  const [abortController, setAbortController] = useState<AbortController | null>(null);

  /**
   * Start translation pipeline
   */
  const startTranslation = useCallback(
    async (
      recordingId: string,
      sourceLang: string = 'auto',
      targetLang: string = 'ru',
      mode: OutputMode = 'both'
    ) => {
      // Abort previous request if exists
      if (abortController) {
        abortController.abort();
      }

      const controller = new AbortController();
      setAbortController(controller);

      // Update state: validating
      setState((prev) => ({
        ...prev,
        status: 'validating',
        progress: {
          status: 'validating',
          step: 'Validating request...',
          percentage: 0,
        },
        error: null,
        artifacts: null,
        sourceLang,
        targetLang,
        mode,
      }));

      try {
        // Prepare request
        const request: TranslationRequest = {
          id: recordingId,
          sourceLang,
          targetLang,
          mode,
        };

        // Update state: starting
        setState((prev) => ({
          ...prev,
          status: 'stt',
          progress: {
            status: 'stt',
            step: 'Speech-to-text processing...',
            percentage: 10,
          },
        }));

        // Call API
        const response = await fetch('/api/ai/pipeline', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(request),
          signal: controller.signal,
        });

        if (!response.ok) {
          const errorData: TranslationError = await response.json();
          throw new Error(errorData.details || errorData.error);
        }

        const data: TranslationResponse = await response.json();

        // Update state: complete
        setState((prev) => ({
          ...prev,
          status: 'complete',
          progress: {
            status: 'complete',
            step: 'Translation complete!',
            percentage: 100,
          },
          artifacts: data.artifacts,
          sourceLang: data.sourceLang,
        }));

      } catch (error) {
        // Handle abort
        if (error instanceof Error && error.name === 'AbortError') {
          console.log('Translation cancelled');
          return;
        }

        // Update state: error
        setState((prev) => ({
          ...prev,
          status: 'error',
          progress: null,
          error: error instanceof Error ? error.message : 'Translation failed',
        }));
      } finally {
        setAbortController(null);
      }
    },
    [abortController]
  );

  /**
   * Cancel ongoing translation
   */
  const cancelTranslation = useCallback(() => {
    if (abortController) {
      abortController.abort();
      setAbortController(null);
      
      setState((prev) => ({
        ...prev,
        status: 'idle',
        progress: null,
      }));
    }
  }, [abortController]);

  /**
   * Reset state to initial
   */
  const resetState = useCallback(() => {
    if (abortController) {
      abortController.abort();
      setAbortController(null);
    }
    setState(initialTranslationState);
  }, [abortController]);

  const isProcessing = ['validating', 'stt', 'translating', 'generating-subtitles', 'generating-voice'].includes(
    state.status
  );

  return {
    state,
    startTranslation,
    cancelTranslation,
    resetState,
    isProcessing,
  };
}
