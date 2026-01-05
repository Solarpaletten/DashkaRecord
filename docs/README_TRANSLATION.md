# 🌍 DashkaRecord - AI Translation Engine

**Complete Guide to Multilingual Translation Feature**

---

## Overview

DashkaRecord's AI Translation Engine transforms ANY video or audio recording into multiple languages with professional-quality subtitles and voice-over narration.

### Key Features

- ✅ **Universal Input** - Works with ANY video/audio source (not YouTube-dependent)
- ✅ **13+ Languages** - Comprehensive language support
- ✅ **Dual Output** - Subtitles (.srt, .vtt) + Voice Over (TTS)
- ✅ **Timestamp Preservation** - Perfect synchronization
- ✅ **Cloud-Based** - No local dependencies (works on Render)

---

## Supported Languages

### Source Languages (Speech-to-Text)

| Language | Code | Detection |
|----------|------|-----------|
| Auto-detect | `auto` | ✅ Automatic |
| English | `en` | ✅ |
| French | `fr` | ✅ |
| German | `de` | ✅ |
| Spanish | `es` | ✅ |
| Italian | `it` | ✅ |
| Russian | `ru` | ✅ |
| Lithuanian | `lt` | ✅ |
| Polish | `pl` | ✅ |
| Ukrainian | `uk` | ✅ |
| Chinese | `zh` | ✅ |
| Japanese | `ja` | ✅ |
| Korean | `ko` | ✅ |

### Target Languages (Translation)

All above languages except Auto-detect

**Popular Translation Pairs:**
- 🇫🇷 French → 🇷🇺 Russian
- 🇩🇪 German → 🇷🇺 Russian
- 🇬🇧 English → 🇷🇺 Russian
- 🇫🇷 French → 🇩🇪 German
- 🇪🇸 Spanish → 🇬🇧 English

---

## How It Works

### Translation Pipeline

```
┌─────────────────────────────────────────────────────────┐
│ 1. SPEECH-TO-TEXT (STT)                                 │
│    • Extract audio from recording                        │
│    • Send to OpenAI Whisper API                         │
│    • Receive transcript with timestamps                 │
│    • Auto-detect source language                        │
└────────────────────┬────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────┐
│ 2. TRANSLATION                                          │
│    • Segment-by-segment translation                     │
│    • Preserve timestamps                                │
│    • Use GPT-4 for context-aware translation           │
│    • Maintain tone and style                           │
└────────────────────┬────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────┐
│ 3. SUBTITLE GENERATION                                  │
│    • Create .srt (SubRip) format                       │
│    • Create .vtt (WebVTT) format                       │
│    • Format timestamps precisely                        │
│    • UTF-8 encoding                                     │
└────────────────────┬────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────┐
│ 4. VOICE SYNTHESIS (TTS)                               │
│    • Generate natural voice narration                   │
│    • Use language-appropriate voice                     │
│    • Export as MP3 audio file                          │
│    • Full narration mode (MVP)                         │
└─────────────────────────────────────────────────────────┘
```

---

## Usage Guide

### 1. Via API (Recommended)

#### Start Translation

```bash
curl -X POST http://localhost:3000/api/ai/pipeline \
  -H "Content-Type: application/json" \
  -d '{
    "id": "20260105_161516",
    "sourceLang": "auto",
    "targetLang": "ru",
    "mode": "both"
  }'
```

**Parameters:**

| Parameter | Type | Options | Description |
|-----------|------|---------|-------------|
| `id` | string | - | Recording ID |
| `sourceLang` | string | `auto`, `en`, `fr`, `de`, etc. | Source language |
| `targetLang` | string | `en`, `ru`, `de`, etc. | Target language |
| `mode` | string | `subtitles`, `voice`, `both` | Output mode |

**Response:**

```json
{
  "ok": true,
  "recordingId": "20260105_161516",
  "sourceLang": "fr",
  "targetLang": "ru",
  "stats": {
    "segments": 45,
    "duration": 180.5
  },
  "artifacts": {
    "srt": "/api/ai/download/20260105_161516/srt",
    "vtt": "/api/ai/download/20260105_161516/vtt",
    "tts": "/api/ai/download/20260105_161516/tts",
    "json": "/api/ai/download/20260105_161516/json"
  }
}
```

#### Download Artifacts

```bash
# Subtitles (.srt)
curl http://localhost:3000/api/ai/download/20260105_161516/srt -o subtitles.srt

# Subtitles (.vtt)
curl http://localhost:3000/api/ai/download/20260105_161516/vtt -o subtitles.vtt

# Voice Over (.mp3)
curl http://localhost:3000/api/ai/download/20260105_161516/tts -o voiceover.mp3

# Translation Data (.json)
curl http://localhost:3000/api/ai/download/20260105_161516/json -o translation.json
```

### 2. Via UI (Coming Soon)

1. Navigate to `/records`
2. Select a recording
3. Click "Translate" button
4. Configure:
   - Source: Auto-detect or specific language
   - Target: Desired output language
   - Mode: Subtitles, Voice, or Both
5. Click "Start Translation"
6. Wait for processing (2-5 minutes)
7. Download artifacts

---

## Output Formats

### Subtitles (.srt)

**SubRip format** - Compatible with most video players

```srt
1
00:00:00,000 --> 00:00:05,200
Привет, добро пожаловать в это видео

2
00:00:05,200 --> 00:00:10,500
Сегодня мы поговорим о финансах
```

**Features:**
- Precise timestamps (millisecond accuracy)
- UTF-8 encoding
- Sequential numbering
- Standard format

### Subtitles (.vtt)

**WebVTT format** - Web-optimized subtitle format

```vtt
WEBVTT

1
00:00:00.000 --> 00:00:05.200
Привет, добро пожаловать в это видео

2
00:00:05.200 --> 00:00:10.500
Сегодня мы поговорим о финансах
```

**Features:**
- HTML5 video compatible
- Styling support
- Cue identifiers
- Web standard

### Voice Over (.mp3)

**TTS Audio** - Natural voice narration

- **Format:** MP3
- **Quality:** High (OpenAI TTS)
- **Mode:** Full narration (entire text)
- **Voices:** Language-appropriate

**Voice Selection:**
- English: Alloy (neutral)
- Russian: Shimmer (female)
- German: Echo (male)
- French: Nova (female)
- Spanish: Onyx (male)

### Translation Data (.json)

**Complete metadata** - Full pipeline output

```json
{
  "recordingId": "20260105_161516",
  "timestamp": "2026-01-05T18:30:00.000Z",
  "sourceLang": "fr",
  "targetLang": "ru",
  "stt": {
    "language": "fr",
    "duration": 180.5,
    "fullText": "Bonjour et bienvenue...",
    "segmentsCount": 45
  },
  "translation": {
    "fullOriginalText": "Bonjour et bienvenue dans cette vidéo...",
    "fullTranslatedText": "Привет и добро пожаловать в это видео...",
    "segments": [
      {
        "id": 0,
        "start": 0.0,
        "end": 5.2,
        "original": "Bonjour et bienvenue dans cette vidéo",
        "translated": "Привет и добро пожаловать в это видео"
      }
    ]
  }
}
```

---

## Use Cases

### 1. International Business Meetings

**Scenario:** German client meeting, need Russian documentation

```bash
curl -X POST /api/ai/pipeline -d '{
  "id": "meeting_20260105",
  "sourceLang": "de",
  "targetLang": "ru",
  "mode": "both"
}'
```

**Output:**
- ✅ Russian subtitles for review
- ✅ Russian audio for distribution
- ✅ JSON data for records

### 2. YouTube Content Localization

**Scenario:** French YouTube video, want Russian version

```bash
# 1. Record French video in DashkaRecord
# 2. Get recording ID
# 3. Run translation
curl -X POST /api/ai/pipeline -d '{
  "id": "youtube_fr_20260105",
  "sourceLang": "fr",
  "targetLang": "ru",
  "mode": "both"
}'
```

**Output:**
- ✅ Russian .srt for upload
- ✅ Russian voice-over audio
- ✅ Ready for YouTube upload

### 3. Training Material Translation

**Scenario:** English training video, need multiple languages

```bash
# English → Russian
curl -X POST /api/ai/pipeline -d '{"id": "training_01", "sourceLang": "en", "targetLang": "ru", "mode": "both"}'

# English → German
curl -X POST /api/ai/pipeline -d '{"id": "training_01", "sourceLang": "en", "targetLang": "de", "mode": "both"}'

# English → French
curl -X POST /api/ai/pipeline -d '{"id": "training_01", "sourceLang": "en", "targetLang": "fr", "mode": "both"}'
```

**Output:**
- ✅ Multiple language versions
- ✅ Consistent translations
- ✅ Professional quality

### 4. Podcast Translation

**Scenario:** Spanish podcast, want English subtitles

```bash
curl -X POST /api/ai/pipeline -d '{
  "id": "podcast_ep42",
  "sourceLang": "es",
  "targetLang": "en",
  "mode": "subtitles"
}'
```

**Output:**
- ✅ English .srt subtitles only
- ✅ Faster processing (no TTS)
- ✅ Lower cost

---

## Cost Analysis

### Pricing Breakdown

**OpenAI Services:**

| Service | Cost | Per |
|---------|------|-----|
| Whisper (STT) | $0.006 | per minute |
| GPT-4 (Translation) | $0.03 | per 1K tokens |
| TTS (Voice) | $0.015 | per 1K characters |

### Real-World Examples

**1-minute video:**
- Whisper: $0.006
- Translation: ~$0.03
- TTS: ~$0.015
- **Total: ~$0.05**

**10-minute video:**
- Whisper: $0.06
- Translation: ~$0.30
- TTS: ~$0.15
- **Total: ~$0.50**

**30-minute video:**
- Whisper: $0.18
- Translation: ~$0.90
- TTS: ~$0.45
- **Total: ~$1.50**

### Monthly Estimates

**100 videos × 10 minutes:**
- Total: ~$50/month

**500 videos × 5 minutes:**
- Total: ~$125/month

**Enterprise (1000 videos × 10 min):**
- Total: ~$500/month

### Cost Optimization Tips

1. **Use subtitles-only mode** when voice isn't needed ($0.35 per 10-min video)
2. **Batch process** multiple videos during off-hours
3. **Cache translations** for repeated content
4. **Use specific source language** instead of auto-detect (faster)

---

## Technical Details

### Processing Time

| Duration | Expected Processing Time |
|----------|-------------------------|
| 1 min | 30-60 seconds |
| 5 min | 2-3 minutes |
| 10 min | 4-5 minutes |
| 30 min | 10-15 minutes |

**Factors:**
- Network speed
- OpenAI API response time
- Audio quality
- Language complexity

### Quality Metrics

**Speech Recognition Accuracy:**
- Clear audio: 95-98%
- Moderate noise: 85-90%
- Heavy noise: 70-80%

**Translation Quality:**
- Context-aware
- Preserves tone and style
- Professional level
- Human review recommended for critical content

**Voice Synthesis:**
- Natural intonation
- Clear pronunciation
- Language-appropriate voices
- Consistent quality

### Limitations (MVP)

**Current:**
- ✅ Post-processing only (not real-time)
- ✅ Full narration TTS (not segment-synced)
- ✅ Cloud-dependent (requires internet)

**Coming Soon (Phase 2):**
- Real-time subtitles
- Live streaming support
- Segment-synced TTS
- Multiple voice options

---

## Troubleshooting

### Common Issues

**1. Translation fails to start**

**Symptoms:** API returns error immediately

**Solutions:**
- Check `OPENAI_API_KEY` is configured
- Verify API key is valid
- Check OpenAI account has credits
- Ensure recording exists

**2. Poor transcription quality**

**Symptoms:** Incorrect text in subtitles

**Solutions:**
- Ensure clear audio
- Reduce background noise
- Specify source language (don't use auto)
- Check microphone quality

**3. Slow processing**

**Symptoms:** Takes longer than expected

**Solutions:**
- Check network connection
- Monitor OpenAI API status
- Consider shorter segments
- Verify server resources

**4. Subtitle timing off**

**Symptoms:** Subtitles don't sync with audio

**Solutions:**
- This is a bug - report it
- Try re-running pipeline
- Check original recording quality

**5. Voice sounds unnatural**

**Symptoms:** TTS voice has issues

**Solutions:**
- This is expected in MVP
- Phase 2 will have voice selection
- Consider subtitles-only mode

### Error Messages

| Error | Cause | Solution |
|-------|-------|----------|
| `OPENAI_API_KEY not configured` | Missing API key | Add to .env.local |
| `Recording not found` | Invalid ID | Check recording exists |
| `Translation failed` | API error | Check logs, retry |
| `Artifact not found` | File missing | Re-run pipeline |

---

## API Reference

### POST /api/ai/pipeline

**Start translation pipeline**

**Request:**
```json
{
  "id": "string",              // Required: Recording ID
  "sourceLang": "string",      // Required: Source language code or 'auto'
  "targetLang": "string",      // Required: Target language code
  "mode": "string"             // Required: 'subtitles' | 'voice' | 'both'
}
```

**Response:**
```json
{
  "ok": true,
  "recordingId": "string",
  "sourceLang": "string",
  "targetLang": "string",
  "stats": {
    "segments": number,
    "duration": number
  },
  "artifacts": {
    "srt": "string",
    "vtt": "string",
    "tts": "string",
    "json": "string"
  }
}
```

### GET /api/ai/pipeline?id={id}

**Check translation status**

**Response:**
```json
{
  "exists": true,
  "sourceLang": "string",
  "targetLang": "string",
  "timestamp": "string",
  "stats": {
    "segments": number,
    "duration": number
  }
}
```

### GET /api/ai/download/{id}/{type}

**Download artifacts**

**Types:** `srt`, `vtt`, `tts`, `json`

**Response:** File download

---

## Future Enhancements

### Phase 2 (Real-Time Subtitles)

- WebSocket streaming
- Live subtitle overlay
- Chunk-based STT (5-10 sec)
- Real-time translation
- <3 second latency

### Phase 3 (Advanced Features)

- Multiple voice options
- Voice selection per language
- Segment-synced TTS
- Lip-sync support
- Custom vocabulary
- Speaker identification
- Emotion detection

---

## Best Practices

### For Best Results

1. **Audio Quality**
   - Use clear audio
   - Minimize background noise
   - Test microphone settings

2. **Source Language**
   - Specify when possible (faster)
   - Use auto-detect for unknown
   - Single language per recording

3. **Output Selection**
   - Subtitles-only for reviews
   - Voice-only for audio content
   - Both for complete package

4. **Batch Processing**
   - Process during off-hours
   - Queue multiple translations
   - Monitor costs

### Production Checklist

- [ ] Test with sample video first
- [ ] Verify audio quality
- [ ] Check language pairs
- [ ] Monitor processing time
- [ ] Review output quality
- [ ] Human review for critical content
- [ ] Track API costs

---

## Support

**Documentation:** [Main README](./README.md)  
**Issues:** [GitHub Issues](https://github.com/Solarpaletten/DashkaRecord/issues)  
**API Status:** [OpenAI Status](https://status.openai.com/)

---

**Built with ❤️ by Solar AI | IT**

**Version:** 2.0.0-beta (Phase 1 MVP)  
**Last Updated:** January 2026
