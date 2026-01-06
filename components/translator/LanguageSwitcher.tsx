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
