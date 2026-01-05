# 🏗️ DashkaRecord v2.0.0-beta - Complete Project Structure

**Full File System Overview**

---

## 📁 Project Root Structure

```
DashkaRecord-v2/
│
├── 📄 README.md                           # Main documentation
├── 📄 README_TRANSLATION.md               # AI Translation guide
├── 📄 DEPLOYMENT.md                       # Deployment guide
├── 📄 CHANGELOG.md                        # Version history
├── 📄 LICENSE                             # MIT License
│
├── ⚙️  package.json                        # Node.js dependencies
├── ⚙️  pnpm-lock.yaml                      # Lock file
├── ⚙️  tsconfig.json                       # TypeScript config
├── ⚙️  next.config.js                      # Next.js config
├── ⚙️  tailwind.config.ts                  # Tailwind config
├── ⚙️  postcss.config.js                   # PostCSS config
├── ⚙️  .eslintrc.json                      # ESLint config
│
├── 🔒 .env.local                           # Local environment (gitignored)
├── 📝 .env.example                         # Environment template
├── 📝 .gitignore                           # Git ignore rules
│
├── 📂 app/                                 # Next.js App Router ⭐
│   ├── 📄 page.tsx                        # Home - Recording interface
│   ├── 📄 layout.tsx                      # Root layout
│   ├── 📄 globals.css                     # Global styles
│   │
│   ├── 📂 records/                        # Records page
│   │   └── 📄 page.tsx                   # Records list
│   │
│   └── 📂 api/                            # API Routes ⭐
│       ├── 📂 upload/
│       │   └── 📄 route.ts               # POST - Upload recording
│       ├── 📂 files/
│       │   ├── 📄 route.ts               # GET - List recordings
│       │   └── 📂 [id]/
│       │       └── 📄 route.ts           # GET/DELETE - Single recording
│       ├── 📂 download/
│       │   └── 📂 [id]/
│       │       ├── 📂 webm/
│       │       │   └── 📄 route.ts       # GET - Download WebM
│       │       └── 📂 mp4/
│       │           └── 📄 route.ts       # GET - Download MP4
│       ├── 📂 screenshot/
│       │   └── 📄 route.ts               # POST - Upload screenshot
│       ├── 📂 translate/
│       │   └── 📄 route.ts               # POST - Translate transcript
│       ├── 📂 sync/
│       │   └── 📄 route.ts               # POST - Sync to Solar Core
│       ├── 📂 health/
│       │   └── 📄 route.ts               # GET - Health check
│       │
│       └── 📂 ai/                         # AI Translation (NEW) ⭐
│           ├── 📂 pipeline/
│           │   └── 📄 route.ts           # POST/GET - Translation pipeline
│           └── 📂 download/
│               └── 📂 [id]/
│                   └── 📂 [type]/
│                       └── 📄 route.ts   # GET - Download artifacts
│
├── 📂 components/                          # React Components ⭐
│   ├── 📄 Recorder.tsx                    # Main recorder component
│   ├── 📄 RecordsList.tsx                 # Records list component
│   ├── 📄 ShareButton.tsx                 # Share functionality
│   │
│   └── 📂 translator/                     # Translation UI (NEW) ⭐
│       └── 📄 TranslationPanel.tsx        # Translation interface
│
├── 📂 lib/                                 # Business Logic ⭐
│   ├── 📄 storage.ts                      # File operations
│   ├── 📄 transcribe.ts                   # Whisper integration
│   ├── 📄 convert.ts                      # MP4 conversion
│   ├── 📄 processing.ts                   # Background processing
│   ├── 📄 features.ts                     # Feature flags
│   │
│   └── 📂 ai/                             # AI Modules (NEW) ⭐
│       ├── 📄 stt.ts                      # Speech-to-Text (Whisper)
│       ├── 📄 translate.ts                # Translation (GPT-4)
│       ├── 📄 subtitles.ts                # Subtitle generation
│       ├── 📄 tts.ts                      # Text-to-Speech
│       └── 📄 pipeline.ts                 # AI orchestration
│
├── 📂 types/                               # TypeScript Types
│   └── 📄 recorder.ts                     # Type definitions
│
├── 📂 public/                              # Static Assets
│   └── 📄 favicon.ico                     # Favicon
│
├── 📂 uploads/                             # Storage (gitignored) ⭐
│   ├── 📂 video/                          # Recorded videos (.webm)
│   ├── 📂 transcripts/                    # Transcriptions (.txt, .json)
│   ├── 📂 mp4/                            # Converted videos (.mp4)
│   ├── 📂 metadata/                       # Recording metadata (.json)
│   ├── 📂 frames/                         # Extracted frames (.png)
│   ├── 📂 sync_logs/                      # ERP sync logs
│   │
│   ├── 📂 subtitles/                      # Generated subtitles (NEW) ⭐
│   │   ├── {id}.srt                      # SubRip format
│   │   └── {id}.vtt                      # WebVTT format
│   │
│   ├── 📂 tts/                            # Voice over files (NEW) ⭐
│   │   └── {id}.mp3                      # TTS audio
│   │
│   └── 📂 processed/                      # Translation data (NEW) ⭐
│       └── {id}.translation.json         # Full pipeline output
│
├── 📂 docs/                                # Additional Documentation
│   ├── 📄 gitkeep1task1.md               # Task 1 documentation
│   ├── 📄 gitkeep2task2.md               # Task 2 documentation
│   ├── 📄 gitkeep3task3.md               # Task 3 documentation
│   ├── 📄 gitkeep4task4.md               # Task 4 documentation
│   ├── 📄 gitkeep5task5.md               # Task 5 documentation
│   ├── 📄 gitkeep6task6.md               # Task 6 documentation
│   ├── 📄 gitkeep7task7.md               # Task 7 documentation
│   └── 📄 gitkeep8task8.md               # Task 8 documentation
│
└── 📂 .next/                               # Next.js build output (gitignored)
    └── ...
```

---

## 📊 File Count by Category

| Category | Files | Description |
|----------|-------|-------------|
| **Documentation** | 4 | README, guides, examples |
| **Configuration** | 8 | Config files, package.json |
| **App Routes** | 2 | Pages (home, records) |
| **API Routes** | 12 | Backend endpoints |
| **Components** | 4 | React components |
| **Business Logic** | 11 | Core + AI modules |
| **Types** | 1 | TypeScript definitions |
| **Total Source Files** | 42 | Excluding generated/storage |

---

## 🎯 Key Directories Explained

### 1. `/app` - Next.js App Router

**Purpose:** Frontend pages and API routes

**Structure:**
- `page.tsx` files → UI pages
- `route.ts` files → API endpoints
- Nested folders → URL structure

**Example:**
```
app/records/page.tsx           → /records
app/api/health/route.ts        → /api/health
app/api/ai/pipeline/route.ts   → /api/ai/pipeline
```

### 2. `/components` - React Components

**Purpose:** Reusable UI components

**Key Files:**
- `Recorder.tsx` - Main recording interface
- `RecordsList.tsx` - Display recordings
- `TranslationPanel.tsx` - AI translation UI

**Import Example:**
```typescript
import Recorder from '@/components/Recorder';
```

### 3. `/lib` - Business Logic

**Purpose:** Core functionality, AI modules

**Key Directories:**
- `/lib/ai/` - AI translation engine (NEW)
- `/lib/*.ts` - Core features

**Import Example:**
```typescript
import { transcribe } from '@/lib/transcribe';
import { runTranslationPipeline } from '@/lib/ai/pipeline';
```

### 4. `/uploads` - File Storage

**Purpose:** Persistent storage for recordings and artifacts

**Structure:**
```
uploads/
├── video/{id}.webm              # Original recordings
├── mp4/{id}.mp4                 # Converted videos
├── transcripts/{id}.txt         # Transcriptions
├── metadata/{id}.json           # Metadata
├── subtitles/{id}.srt           # Subtitles (NEW)
├── tts/{id}.mp3                 # Voice over (NEW)
└── processed/{id}.translation.json  # Translation data (NEW)
```

**Access Pattern:**
```typescript
// Video: uploads/video/20260105_161516.webm
// Subtitles: uploads/subtitles/20260105_161516.srt
// TTS: uploads/tts/20260105_161516.mp3
```

---

## 🔄 Data Flow

### Recording Flow

```
User Interface (page.tsx)
    ↓
Recorder Component
    ↓
MediaRecorder API
    ↓
POST /api/upload
    ↓
lib/storage.ts (save video)
    ↓
lib/processing.ts (background)
    ├── lib/transcribe.ts → uploads/transcripts/
    └── lib/convert.ts → uploads/mp4/
```

### Translation Flow (NEW)

```
User Request
    ↓
POST /api/ai/pipeline
    ↓
lib/ai/pipeline.ts
    ├── lib/ai/stt.ts → OpenAI Whisper
    ├── lib/ai/translate.ts → GPT-4
    ├── lib/ai/subtitles.ts → uploads/subtitles/
    └── lib/ai/tts.ts → uploads/tts/
    ↓
GET /api/ai/download/{id}/{type}
    ↓
User receives files
```

---

## 📦 Dependencies Overview

### Production Dependencies

```json
{
  "next": "14.1.0",
  "react": "^18",
  "react-dom": "^18",
  "fluent-ffmpeg": "^2.1.2",
  "@ffmpeg-installer/ffmpeg": "^1.1.0"
}
```

### Development Dependencies

```json
{
  "@types/node": "^20",
  "@types/react": "^18",
  "@types/react-dom": "^18",
  "@types/fluent-ffmpeg": "^2.1.24",
  "typescript": "^5",
  "tailwindcss": "^3.3.0",
  "eslint": "^8",
  "eslint-config-next": "14.1.0"
}
```

### External Services

- **OpenAI API** - Whisper STT, GPT-4, TTS
- **DeepSeek API** - Translation (optional)
- **Solar Core** - ERP integration (optional)

---

## 🔧 Build Output

### Production Build

```
.next/
├── cache/                    # Build cache
├── server/                   # Server-side code
│   ├── app/                 # Compiled pages
│   └── chunks/              # Code splitting
├── static/                   # Static assets
│   ├── chunks/              # Client bundles
│   ├── css/                 # Compiled styles
│   └── media/               # Images, fonts
└── BUILD_ID                  # Build identifier
```

---

## 📝 Configuration Files

### TypeScript (`tsconfig.json`)

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["ES2017", "DOM"],
    "jsx": "preserve",
    "module": "esnext",
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

### Tailwind (`tailwind.config.ts`)

```typescript
export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {},
  },
}
```

### Next.js (`next.config.js`)

```javascript
module.exports = {
  reactStrictMode: true,
  // Custom configuration
}
```

---

## 🗄️ Storage Patterns

### File Naming Convention

```
{timestamp}_{id}.{extension}

Examples:
20260105_161516.webm
20260105_161516.srt
20260105_161516.mp3
20260105_161516.translation.json
```

### Metadata Structure

```json
{
  "id": "20260105_161516",
  "timestamp": "2026-01-05T16:15:16.000Z",
  "videoPath": "uploads/video/20260105_161516.webm",
  "mp4Path": "uploads/mp4/20260105_161516.mp4",
  "transcriptPath": "uploads/transcripts/20260105_161516.txt",
  "duration": 180.5,
  "status": "complete",
  "translated": true,
  "translationLanguage": "ru"
}
```

---

## 🚀 Deployment Structure

### Render.com

```
/opt/render/project/src/          # Project root
├── app/                           # Next.js app
├── components/                    # Components
├── lib/                          # Business logic
├── uploads/                      # Persistent storage
└── .next/                        # Build output
```

**Persistent Disk:**
- Path: `/opt/render/project/src/uploads`
- Size: 10GB
- Purpose: Store recordings and artifacts

---

## 📊 Size Estimates

| Directory | Typical Size | Purpose |
|-----------|-------------|---------|
| `/app` | ~500 KB | Pages + API routes |
| `/components` | ~200 KB | React components |
| `/lib` | ~300 KB | Business logic |
| `/lib/ai` | ~150 KB | AI modules (NEW) |
| `/uploads/video` | Variable | Recordings |
| `/uploads/subtitles` | ~10 KB each | Subtitle files |
| `/uploads/tts` | ~500 KB each | Voice files |
| `/.next` | ~50 MB | Build output |

---

## ✅ Structure Completeness

### Feature Coverage

- [x] Core recording
- [x] File management
- [x] API endpoints
- [x] Background processing
- [x] AI transcription
- [x] AI translation (NEW)
- [x] Subtitle generation (NEW)
- [x] Voice synthesis (NEW)
- [x] Feature flags
- [x] Health monitoring

### Code Organization

- [x] Clear separation of concerns
- [x] Modular architecture
- [x] Reusable components
- [x] Type safety
- [x] API versioning ready
- [x] Scalable structure

---

**Built with ❤️ by Solar AI | IT**

**Version:** 2.0.0-beta  
**Last Updated:** January 2026
