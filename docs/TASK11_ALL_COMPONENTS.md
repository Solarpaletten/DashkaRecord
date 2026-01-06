# 📦 TASK11 - All Component Files

**Complete source code for all 8 new files created in TASK11**

---

## 📁 components/subtitles/

### 1. SubtitleOverlay.tsx

```tsx
"use client";

import React from 'react';

/**
 * SubtitleOverlay Component
 * TASK11 - File Skeleton Stub
 * 
 * TODO: Implement subtitle overlay rendering
 * - Display subtitles on top of video
 * - Handle subtitle timing
 * - Style and positioning
 */

interface SubtitleOverlayProps {
  videoId?: string;
  language?: string;
  subtitles?: Array<{
    start: number;
    end: number;
    text: string;
  }>;
}

const SubtitleOverlay: React.FC<SubtitleOverlayProps> = ({
  videoId,
  language,
  subtitles,
}) => {
  // TODO: Implement subtitle rendering logic
  
  return (
    <div className="subtitle-overlay">
      {/* TODO: Render subtitles here */}
    </div>
  );
};

export default SubtitleOverlay;
```

---

### 2. SubtitleRenderer.tsx

```tsx
"use client";

import React from 'react';

/**
 * SubtitleRenderer Component
 * TASK11 - File Skeleton Stub
 * 
 * TODO: Implement subtitle rendering engine
 * - Parse .srt/.vtt files
 * - Calculate current subtitle based on time
 * - Handle subtitle transitions
 */

interface SubtitleRendererProps {
  currentTime?: number;
  subtitles?: Array<{
    id: number;
    start: number;
    end: number;
    text: string;
  }>;
  className?: string;
}

const SubtitleRenderer: React.FC<SubtitleRendererProps> = ({
  currentTime = 0,
  subtitles = [],
  className,
}) => {
  // TODO: Find current subtitle based on currentTime
  // const currentSubtitle = subtitles.find(
  //   sub => currentTime >= sub.start && currentTime <= sub.end
  // );

  return (
    <div className={`subtitle-renderer ${className || ''}`}>
      {/* TODO: Display current subtitle */}
    </div>
  );
};

export default SubtitleRenderer;
```

---

### 3. useSubtitles.ts

```typescript
/**
 * useSubtitles Hook
 * TASK11 - File Skeleton Stub
 * 
 * TODO: Implement subtitle loading and management
 * - Fetch subtitles from API
 * - Parse subtitle format
 * - Sync with video playback
 */

import { useState, useEffect } from 'react';

interface Subtitle {
  id: number;
  start: number;
  end: number;
  text: string;
}

interface UseSubtitlesResult {
  subtitles: Subtitle[];
  currentSubtitle: Subtitle | null;
  loading: boolean;
  error: string | null;
}

export function useSubtitles(
  videoId: string,
  currentTime: number = 0
): UseSubtitlesResult {
  const [subtitles, setSubtitles] = useState<Subtitle[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // TODO: Fetch subtitles
  useEffect(() => {
    // TODO: Load subtitles from API
    // fetch(`/api/ai/download/${videoId}/vtt`)
  }, [videoId]);

  // TODO: Calculate current subtitle
  const currentSubtitle = subtitles.find(
    (sub) => currentTime >= sub.start && currentTime <= sub.end
  ) || null;

  return {
    subtitles,
    currentSubtitle,
    loading,
    error,
  };
}
```

---

## 📁 components/player/

### 4. TranslatedMediaPlayer.tsx

```tsx
"use client";

import React, { useRef } from 'react';

/**
 * TranslatedMediaPlayer Component
 * TASK11 - File Skeleton Stub
 * 
 * TODO: Implement media player with translation support
 * - Video/audio playback
 * - Subtitle overlay integration
 * - Translation controls
 * - Playback controls
 */

interface TranslatedMediaPlayerProps {
  videoId: string;
  videoUrl?: string;
  subtitleUrl?: string;
  language?: string;
  onTimeUpdate?: (time: number) => void;
}

const TranslatedMediaPlayer: React.FC<TranslatedMediaPlayerProps> = ({
  videoId,
  videoUrl,
  subtitleUrl,
  language,
  onTimeUpdate,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  // TODO: Implement playback handlers
  const handleTimeUpdate = () => {
    if (videoRef.current && onTimeUpdate) {
      onTimeUpdate(videoRef.current.currentTime);
    }
  };

  return (
    <div className="translated-media-player">
      <video
        ref={videoRef}
        onTimeUpdate={handleTimeUpdate}
        controls
        className="w-full"
      >
        {videoUrl && <source src={videoUrl} type="video/webm" />}
        {/* TODO: Add subtitle track */}
      </video>
      
      {/* TODO: Add subtitle overlay */}
      {/* TODO: Add player controls */}
    </div>
  );
};

export default TranslatedMediaPlayer;
```

---

### 5. PlayerControls.tsx

```tsx
"use client";

import React from 'react';

/**
 * PlayerControls Component
 * TASK11 - File Skeleton Stub
 * 
 * TODO: Implement player control UI
 * - Play/Pause
 * - Volume control
 * - Progress bar
 * - Subtitle toggle
 * - Language selection
 */

interface PlayerControlsProps {
  isPlaying?: boolean;
  volume?: number;
  currentTime?: number;
  duration?: number;
  onPlayPause?: () => void;
  onVolumeChange?: (volume: number) => void;
  onSeek?: (time: number) => void;
  onSubtitleToggle?: () => void;
}

const PlayerControls: React.FC<PlayerControlsProps> = ({
  isPlaying = false,
  volume = 1,
  currentTime = 0,
  duration = 0,
  onPlayPause,
  onVolumeChange,
  onSeek,
  onSubtitleToggle,
}) => {
  return (
    <div className="player-controls flex items-center gap-4 p-4">
      {/* TODO: Play/Pause button */}
      <button onClick={onPlayPause} className="px-4 py-2 bg-blue-500 text-white rounded">
        {isPlaying ? 'Pause' : 'Play'}
      </button>

      {/* TODO: Progress bar */}
      <div className="flex-1">
        {/* Progress slider */}
      </div>

      {/* TODO: Volume control */}
      <div>
        {/* Volume slider */}
      </div>

      {/* TODO: Subtitle toggle */}
      <button onClick={onSubtitleToggle} className="px-4 py-2 bg-gray-500 text-white rounded">
        Subtitles
      </button>
    </div>
  );
};

export default PlayerControls;
```

---

## 📁 components/translator/

### 6. LanguageSwitcher.tsx

```tsx
"use client";

import React from 'react';

/**
 * LanguageSwitcher Component
 * TASK11 - File Skeleton Stub
 * 
 * TODO: Implement language selection UI
 * - Source language selector
 * - Target language selector
 * - Auto-detect option
 * - Language pair validation
 */

interface LanguageSwitcherProps {
  sourceLanguage?: string;
  targetLanguage?: string;
  onSourceChange?: (language: string) => void;
  onTargetChange?: (language: string) => void;
  disabled?: boolean;
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  sourceLanguage = 'auto',
  targetLanguage = 'ru',
  onSourceChange,
  onTargetChange,
  disabled = false,
}) => {
  const languages = {
    auto: '🌍 Auto-detect',
    en: '🇬🇧 English',
    fr: '🇫🇷 French',
    de: '🇩🇪 German',
    es: '🇪🇸 Spanish',
    ru: '🇷🇺 Russian',
  };

  return (
    <div className="language-switcher flex gap-4">
      {/* Source Language */}
      <div className="flex-1">
        <label className="block text-sm font-medium mb-2">
          Source Language
        </label>
        <select
          value={sourceLanguage}
          onChange={(e) => onSourceChange?.(e.target.value)}
          disabled={disabled}
          className="w-full px-3 py-2 border rounded"
        >
          {Object.entries(languages).map(([code, name]) => (
            <option key={code} value={code}>{name}</option>
          ))}
        </select>
      </div>

      {/* Target Language */}
      <div className="flex-1">
        <label className="block text-sm font-medium mb-2">
          Target Language
        </label>
        <select
          value={targetLanguage}
          onChange={(e) => onTargetChange?.(e.target.value)}
          disabled={disabled}
          className="w-full px-3 py-2 border rounded"
        >
          {Object.entries(languages)
            .filter(([code]) => code !== 'auto')
            .map(([code, name]) => (
              <option key={code} value={code}>{name}</option>
            ))}
        </select>
      </div>
    </div>
  );
};

export default LanguageSwitcher;
```

---

### 7. OutputModeSelector.tsx

```tsx
"use client";

import React from 'react';

/**
 * OutputModeSelector Component
 * TASK11 - File Skeleton Stub
 * 
 * TODO: Implement output mode selection
 * - Subtitles only
 * - Voice only
 * - Both (subtitles + voice)
 * - Visual feedback
 */

type OutputMode = 'subtitles' | 'voice' | 'both';

interface OutputModeSelectorProps {
  mode?: OutputMode;
  onModeChange?: (mode: OutputMode) => void;
  disabled?: boolean;
}

const OutputModeSelector: React.FC<OutputModeSelectorProps> = ({
  mode = 'both',
  onModeChange,
  disabled = false,
}) => {
  const modes: { value: OutputMode; label: string; icon: string }[] = [
    { value: 'subtitles', label: 'Subtitles Only', icon: '📝' },
    { value: 'voice', label: 'Voice Only', icon: '🗣️' },
    { value: 'both', label: 'Both', icon: '📝🗣️' },
  ];

  return (
    <div className="output-mode-selector">
      <label className="block text-sm font-medium mb-2">
        Output Mode
      </label>
      
      <div className="flex gap-3">
        {modes.map((modeOption) => (
          <label key={modeOption.value} className="flex items-center cursor-pointer">
            <input
              type="radio"
              value={modeOption.value}
              checked={mode === modeOption.value}
              onChange={(e) => onModeChange?.(e.target.value as OutputMode)}
              disabled={disabled}
              className="mr-2"
            />
            <span className="text-sm">
              {modeOption.icon} {modeOption.label}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default OutputModeSelector;
```

---

### 8. TranslationState.ts

```typescript
/**
 * TranslationState Types
 * TASK11 - File Skeleton Stub
 * 
 * TODO: Define translation state management
 * - Translation status
 * - Progress tracking
 * - Error handling
 * - Artifact URLs
 */

export type OutputMode = 'subtitles' | 'voice' | 'both';

export type TranslationStatus = 
  | 'idle'
  | 'processing'
  | 'stt'
  | 'translating'
  | 'generating'
  | 'complete'
  | 'error';

export interface TranslationProgress {
  step: string;
  percentage: number;
}

export interface TranslationArtifacts {
  srt?: string;
  vtt?: string;
  tts?: string;
  json?: string;
}

export interface TranslationState {
  status: TranslationStatus;
  progress: TranslationProgress | null;
  artifacts: TranslationArtifacts | null;
  error: string | null;
  sourceLang: string;
  targetLang: string;
  mode: OutputMode;
}

export const initialTranslationState: TranslationState = {
  status: 'idle',
  progress: null,
  artifacts: null,
  error: null,
  sourceLang: 'auto',
  targetLang: 'ru',
  mode: 'both',
};

// TODO: Add translation action creators
// TODO: Add translation reducer
// TODO: Add translation context
```

---

## 📊 Summary

**Files:** 8  
**Total Lines:** ~460  
**Directories:** 3  
**Build Status:** ✅ SUCCESS

### Directory Structure

```
components/
├── subtitles/
│   ├── SubtitleOverlay.tsx
│   ├── SubtitleRenderer.tsx
│   └── useSubtitles.ts
├── player/
│   ├── TranslatedMediaPlayer.tsx
│   └── PlayerControls.tsx
└── translator/
    ├── LanguageSwitcher.tsx
    ├── OutputModeSelector.tsx
    └── TranslationState.ts
```

---

**TASK11 Complete** ✅  
**Date:** 06.01.2026  
**Team:** Solar AI | IT
