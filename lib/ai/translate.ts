/**
 * Translation Module
 * DashkaRecord v2.0.0-beta - TASK10 Phase 1
 * 
 * Translates text segments while preserving timestamps
 */

import { STTSegment } from './stt';

export interface TranslatedSegment {
  id: number;
  start: number;
  end: number;
  originalText: string;
  translatedText: string;
}

export interface TranslationResult {
  originalLanguage: string;
  targetLanguage: string;
  fullOriginalText: string;
  fullTranslatedText: string;
  segments: TranslatedSegment[];
}

/**
 * Translate segments from source to target language
 */
export async function translateSegments(
  segments: STTSegment[],
  sourceLanguage: string,
  targetLanguage: string
): Promise<TranslationResult> {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error('OPENAI_API_KEY not configured');
  }

  console.log(`🌍 Translating ${segments.length} segments: ${sourceLanguage} → ${targetLanguage}`);

  try {
    // Prepare full text for context-aware translation
    const fullText = segments.map(seg => seg.text).join('\n');

    // Translate full text first (for better context)
    const fullTranslation = await translateText(
      fullText,
      sourceLanguage,
      targetLanguage,
      apiKey
    );

    // Split translated text back into segments
    const translatedLines = fullTranslation.split('\n');

    const translatedSegments: TranslatedSegment[] = segments.map((seg, idx) => ({
      id: seg.id,
      start: seg.start,
      end: seg.end,
      originalText: seg.text,
      translatedText: translatedLines[idx] || seg.text, // Fallback to original if split fails
    }));

    // If translation split doesn't match segments count, translate individually
    if (translatedLines.length !== segments.length) {
      console.warn(`⚠️ Translation split mismatch (${translatedLines.length} vs ${segments.length}), translating individually`);

      for (let i = 0; i < translatedSegments.length; i++) {
        const translation = await translateText(
          segments[i].text,
          sourceLanguage,
          targetLanguage,
          apiKey
        );
        translatedSegments[i].translatedText = translation;
      }
    }

    console.log(`✅ Translation complete: ${translatedSegments.length} segments`);

    return {
      originalLanguage: sourceLanguage,
      targetLanguage,
      fullOriginalText: fullText,
      fullTranslatedText: fullTranslation,
      segments: translatedSegments,
    };

  } catch (error) {
    console.error('❌ Translation error:', error);
    throw new Error(`Translation failed: ${(error as Error).message}`);
  }
}

/**
 * Translate a single text using OpenAI GPT
 */
async function translateText(
  text: string,
  sourceLanguage: string,
  targetLanguage: string,
  apiKey: string
): Promise<string> {
  const languageNames: Record<string, string> = {
    en: 'English',
    fr: 'French',
    de: 'German',
    es: 'Spanish',
    it: 'Italian',
    ru: 'Russian',
    lt: 'Lithuanian',
    pl: 'Polish',
    uk: 'Ukrainian',
    zh: 'Chinese',
    ja: 'Japanese',
    ko: 'Korean',
  };

  const sourceName = languageNames[sourceLanguage] || sourceLanguage;
  const targetName = languageNames[targetLanguage] || targetLanguage;

  const systemPrompt = `You are a professional translator. Translate the following text from ${sourceName} to ${targetName}. 
Preserve the meaning, tone, and style. 
Do not add explanations or notes.
Return only the translated text.`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: text },
      ],
      temperature: 0.3, // Lower temperature for more consistent translations
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI API error: ${response.status} ${errorText}`);
  }

  const result = await response.json();
  const translatedText = result.choices?.[0]?.message?.content?.trim() || text;

  return translatedText;
}

/**
 * Get supported target languages
 */
export function getSupportedTargetLanguages() {
  return {
    en: 'English',
    ru: 'Russian',
    de: 'German',
    fr: 'French',
    es: 'Spanish',
    it: 'Italian',
    lt: 'Lithuanian',
    pl: 'Polish',
    uk: 'Ukrainian',
    zh: 'Chinese',
    ja: 'Japanese',
    ko: 'Korean',
  };
}