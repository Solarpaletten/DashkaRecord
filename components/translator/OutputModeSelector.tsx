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
