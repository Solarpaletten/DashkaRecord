# 🎥 DashkaRecord v2.0.0-beta

**AI-Powered Screen Recording with Real-Time Multilingual Translation**

[![Next.js](https://img.shields.io/badge/Next.js-14.1.0-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/license-MIT-green)](./LICENSE)
[![Deploy on Render](https://img.shields.io/badge/Deploy-Render-46E3B7)](https://render.com)

Professional screen recording application with AI transcription, translation, and voice synthesis capabilities.

---

## ✨ Features

### 🎬 Core Recording
- **Screen Recording** - Capture screen, window, or tab
- **Audio Recording** - System audio + microphone
- **Video Formats** - WebM (native) + MP4 (conversion)
- **Frame Capture** - Screenshot extraction from recordings
- **Metadata Tracking** - Automatic metadata generation

### 🤖 AI-Powered Features (NEW)
- **Speech-to-Text** - OpenAI Whisper (13+ languages)
- **Real-Time Translation** - Any language → Any language
- **Subtitle Generation** - .srt and .vtt formats
- **Voice Synthesis** - Natural TTS in multiple languages
- **Auto Language Detection** - Intelligent source detection

### 📊 Professional Features
- **Background Processing** - Non-blocking transcription + conversion
- **ERP Integration** - Solar Core sync support
- **Translation Services** - DeepSeek integration
- **Health Monitoring** - Runtime feature detection
- **Feature Flags** - Environment-based configuration

---

## 🚀 Quick Start

### Prerequisites
- Node.js 20+ or 22
- pnpm
- OpenAI API key (for AI features)

### Installation

```bash
# 1. Clone repository
git clone https://github.com/Solarpaletten/DashkaRecord.git
cd DashkaRecord

# 2. Install dependencies
pnpm install

# 3. Setup environment
cp .env.example .env.local

# Edit .env.local:
# Add OPENAI_API_KEY=sk-...

# 4. Run development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🌍 AI Translation (TASK10)

### Overview

DashkaRecord includes a powerful AI translation engine that works with ANY video/audio source:

- **Universal** - Not limited to YouTube or any platform
- **Multi-language** - 13+ languages supported
- **Professional Output** - Subtitles (.srt, .vtt) + Voice (TTS)
- **Timestamp Preservation** - Perfect sync

### Supported Languages

**Source:** Auto-detect, English, French, German, Spanish, Italian, Russian, Lithuanian, Polish, Ukrainian, Chinese, Japanese, Korean

**Target:** All above except Auto-detect

### Usage Example

```bash
# Run translation pipeline
curl -X POST http://localhost:3000/api/ai/pipeline \
  -H "Content-Type: application/json" \
  -d '{
    "id": "20260105_161516",
    "sourceLang": "auto",
    "targetLang": "ru",
    "mode": "both"
  }'

# Download subtitles
curl http://localhost:3000/api/ai/download/20260105_161516/srt -o subtitles.srt

# Download voice over
curl http://localhost:3000/api/ai/download/20260105_161516/tts -o voice.mp3
```

### Pipeline Flow

```
[Recording] 
    ↓
[Speech-to-Text] → Whisper API (segments + timestamps)
    ↓
[Translation] → GPT-4 (preserve timestamps)
    ↓
[Subtitles] → .srt + .vtt files
    ↓
[Voice Over] → TTS MP3 audio
    ↓
[Download]
```

### Cost Estimate

- **1 minute video:** ~$0.05
- **10 minute video:** ~$0.50
- **Monthly (100 videos × 10 min):** ~$50

**See [README_TRANSLATION.md](./README_TRANSLATION.md) for detailed guide**

---

## 🎛️ Configuration

### Environment Variables

```bash
# ============================================
# DEPLOYMENT MODE
# ============================================
NODE_ENV=development

# ============================================
# WHISPER TRANSCRIPTION
# ============================================
WHISPER_MODE=subprocess          # or 'cloud'
WHISPER_MODEL=base               # tiny|base|small|medium|large
OPENAI_API_KEY=sk-...           # Required for cloud mode

# ============================================
# FFMPEG VIDEO CONVERSION
# ============================================
MP4_CONVERSION_ENABLED=true      # Set to 'false' on Render

# ============================================
# TRANSLATION (DeepSeek)
# ============================================
DEEPSEEK_API_KEY=               # Optional
DEEPSEEK_API_URL=https://api.deepseek.com

# ============================================
# SOLAR CORE ERP
# ============================================
SOLAR_CORE_URL=http://localhost:8010
SOLAR_CORE_API_KEY=
```

**See [.env.example](./.env.example) for full configuration**

---

## 🏗️ Architecture

### Tech Stack

- **Frontend:** Next.js 14 + React 18 + TypeScript
- **Styling:** Tailwind CSS
- **Recording:** MediaRecorder API
- **AI Services:**
  - OpenAI Whisper (STT)
  - GPT-4 (Translation)
  - OpenAI TTS (Voice Synthesis)
- **Video:** FFmpeg (optional, for MP4)
- **Storage:** Local file system

### Project Structure

```
DashkaRecord/
├── app/                          # Next.js App Router
│   ├── page.tsx                 # Home - Recording interface
│   ├── records/                 # Records list page
│   └── api/                     # API routes
│       ├── upload/              # Recording upload
│       ├── files/               # File management
│       ├── download/            # Video downloads
│       └── ai/                  # AI Translation (NEW)
│           ├── pipeline/        # Translation orchestrator
│           └── download/        # Artifact downloads
├── components/                   # React components
│   ├── Recorder.tsx            # Main recording component
│   ├── RecordsList.tsx         # Records list
│   └── translator/             # Translation UI (NEW)
│       └── TranslationPanel.tsx
├── lib/                         # Business logic
│   ├── storage.ts              # File operations
│   ├── transcribe.ts           # Whisper integration
│   ├── convert.ts              # MP4 conversion
│   ├── processing.ts           # Background processing
│   ├── features.ts             # Feature flags
│   └── ai/                     # AI modules (NEW)
│       ├── stt.ts              # Speech-to-text
│       ├── translate.ts        # Translation
│       ├── subtitles.ts        # Subtitle generation
│       ├── tts.ts              # Text-to-speech
│       └── pipeline.ts         # Orchestration
├── types/                       # TypeScript types
├── uploads/                     # Storage (gitignored)
│   ├── video/                  # Recordings
│   ├── transcripts/            # Transcriptions
│   ├── mp4/                    # Converted videos
│   ├── subtitles/              # Generated subtitles (NEW)
│   ├── tts/                    # Voice over files (NEW)
│   └── processed/              # Translation data (NEW)
└── public/                      # Static assets
```

---

## 📡 API Reference

### Recording

```http
POST /api/upload
Content-Type: multipart/form-data

# Upload new recording
```

```http
GET /api/files
# List all recordings

GET /api/files/{id}
# Get recording metadata
```

```http
GET /api/download/{id}/webm
# Download WebM format

GET /api/download/{id}/mp4
# Download MP4 format (requires FFmpeg)
```

### AI Translation (NEW)

```http
POST /api/ai/pipeline
Content-Type: application/json

{
  "id": "recording_id",
  "sourceLang": "auto",
  "targetLang": "ru",
  "mode": "both"
}
# Run translation pipeline
```

```http
GET /api/ai/pipeline?id=recording_id
# Check translation status
```

```http
GET /api/ai/download/{id}/srt
# Download .srt subtitles

GET /api/ai/download/{id}/vtt
# Download .vtt subtitles

GET /api/ai/download/{id}/tts
# Download voice over MP3

GET /api/ai/download/{id}/json
# Download translation data
```

### Health Check

```http
GET /api/health
# System health + feature status
```

---

## 🚀 Deployment

### Render.com (Recommended)

**Quick Deploy:**

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy)

**Manual Setup:**

1. **Create Web Service** on Render.com
2. **Connect Repository:** `Solarpaletten/DashkaRecord`
3. **Configure Build:**
   - Build Command: `pnpm install && pnpm build`
   - Start Command: `pnpm start`
   - Node Version: `22`

4. **Environment Variables:**
   ```
   NODE_VERSION=22
   WHISPER_MODE=cloud
   OPENAI_API_KEY=sk-...
   MP4_CONVERSION_ENABLED=false
   ```

5. **Deploy!**

**See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed guide**

### Feature Availability

| Feature | Local | Render |
|---------|-------|--------|
| Recording | ✅ | ✅ |
| WebM Download | ✅ | ✅ |
| MP4 Conversion | ✅ | ❌ |
| AI Transcription | ✅ | ✅ |
| AI Translation | ✅ | ✅ |
| Subtitles | ✅ | ✅ |
| Voice Over | ✅ | ✅ |

---

## 🛠️ Local Development

### Requirements

- Node.js 20+ or 22
- pnpm
- FFmpeg (for MP4 conversion)
- Python 3.8+ (for local Whisper, optional)

### Setup

```bash
# Install FFmpeg (macOS)
brew install ffmpeg

# Install Whisper (optional, for local mode)
pip3 install --break-system-packages --user openai-whisper

# Start development
pnpm dev
```

### Testing

```bash
# Build
pnpm build

# Lint
pnpm lint

# Type check
tsc --noEmit
```

---

## 📋 Roadmap

### Phase 1 (MVP) ✅ COMPLETE
- [x] Screen recording
- [x] Audio transcription
- [x] MP4 conversion
- [x] AI translation (post-processing)
- [x] Subtitle generation
- [x] Voice synthesis
- [x] Render deployment

### Phase 2 (v1) - In Progress
- [ ] Live subtitles (real-time)
- [ ] WebSocket streaming
- [ ] Chunk-based STT
- [ ] Real-time translation overlay

### Phase 3 (v2) - Future
- [ ] Real-time voice over
- [ ] Multiple voice options
- [ ] Lip-sync
- [ ] Advanced audio mixing
- [ ] Collaborative features

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Commit Convention

We use [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add new feature
fix: bug fix
docs: documentation changes
style: formatting, missing semicolons, etc
refactor: code refactoring
test: adding tests
chore: maintenance tasks
```

---

## 🐛 Troubleshooting

### Build Issues

**Error: `next: not found`**
- Ensure `next` is in `dependencies`, not `devDependencies`
- Run `pnpm install`

**FFmpeg not found**
- Install FFmpeg: `brew install ffmpeg` (macOS)
- Or disable MP4: `MP4_CONVERSION_ENABLED=false`

### API Issues

**Whisper fails**
- Check `OPENAI_API_KEY` is set
- Verify API key is valid
- Check OpenAI account credits

**Translation slow**
- Expected: 2-5 minutes for 10-minute video
- Check network connection
- Monitor OpenAI API status

### Deployment Issues

**Render build fails**
- Verify build command: `pnpm install && pnpm build`
- Check environment variables
- Review Render logs

---

## 📄 License

MIT License - see [LICENSE](./LICENSE) for details

---

## 👥 Team

**DashkaRecord** is built by **Solar AI | IT**

- **Leanid** - Architect
- **Dashka** - Senior Coordinator
- **Claude** - AI Implementation Lead

---

## 📞 Support

- **Issues:** [GitHub Issues](https://github.com/Solarpaletten/DashkaRecord/issues)
- **Documentation:** [GitHub Wiki](https://github.com/Solarpaletten/DashkaRecord/wiki)
- **Health Check:** `https://your-app.onrender.com/api/health`

---

## 🌟 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [OpenAI](https://openai.com/) - AI services (Whisper, GPT-4, TTS)
- [FFmpeg](https://ffmpeg.org/) - Video processing
- [Tailwind CSS](https://tailwindcss.com/) - Styling

---

**Built with ❤️ by Solar AI | IT**

**Version:** 2.0.0-beta  
**Last Updated:** January 2026
