leanid@MacBook-Pro-LeanidHamburg DashkaRecord % tree
.
├── CHANGELOG.md
├── README.md
├── app
│   ├── api
│   │   ├── download
│   │   │   └── [id]
│   │   │       ├── mp4
│   │   │       │   └── route.ts
│   │   │       └── webm
│   │   │           └── route.ts
│   │   ├── files
│   │   │   ├── [id]
│   │   │   │   └── route.ts
│   │   │   └── route.ts
│   │   ├── health
│   │   │   └── route.ts
│   │   ├── screenshot
│   │   │   └── route.ts
│   │   ├── static
│   │   │   ├── frames
│   │   │   ├── transcripts
│   │   │   └── video
│   │   ├── sync
│   │   │   └── route.ts
│   │   ├── translate
│   │   │   └── route.ts
│   │   └── upload
│   │       └── route.ts
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx
│   └── records
│       └── page.tsx
├── components
│   ├── recorder
│   │   ├── Recorder.tsx
│   │   └── ShareButton.tsx
│   ├── records
│   └── ui
├── config
├── docs
│   ├── AUDIT_SUMMARY.md
│   ├── MIGRATION_COMPLETE_SOLAR_TEMPLATE.md
│   ├── PHASE_3_COMPLETE_REPORT.md
│   ├── PHASE_3_SUMMARY.md
│   ├── POST_CLEANUP_AUDIT.md
│   ├── STRUCTURE_SUMMARY.md
│   ├── gitkeep1.0.0task1.md
│   └── gitreport1.0.0task1.md
├── hooks
├── lib
│   ├── convert.ts
│   ├── processing.ts
│   ├── solar-core.ts
│   ├── storage.ts
│   ├── transcribe.ts
│   └── translate.ts
├── next-env.d.ts
├── next.config.js
├── package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── postcss.config.js
├── public
├── scripts
│   └── transcribe.py
├── tailwind.config.ts
├── tsconfig.json
├── types
│   ├── api.ts
│   ├── recorder.ts
│   └── types.ts
└── uploads
    ├── frames
    ├── metadata
    ├── mp4
    ├── sync_logs
    ├── transcripts
    └── video

37 directories, 43 files
leanid@MacBook-Pro-LeanidHamburg DashkaRecord % 

leanid@MacBook-Pro-LeanidHamburg DashkaRecord % pnpm install 
 WARN  deprecated next@14.1.0: This version has a security vulnerability. Please upgrade to a patched version. See https://nextjs.org/blog/security-update-2025-12-11 for more details.
 WARN  deprecated eslint@8.57.1: This version is no longer supported. Please see https://eslint.org/version-support for other options./20.76 MB
 WARN  deprecated fluent-ffmpeg@2.1.3: Package no longer supported. Contact Support at https://www.npmjs.com/support for more info.0 B/20.76 MB
 WARN  5 deprecated subdependencies found: @humanwhocodes/config-array@0.13.0, @humanwhocodes/object-schema@2.0.3, glob@7.2.3, inflight@1.0.6, rimraf@3.0.2
Packages: +378
+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
Downloading @ffmpeg-installer/darwin-arm64@4.1.5: 15.71 MB/15.71 MB, done
Downloading next@14.1.0: 20.76 MB/20.76 MB, done
Downloading @next/swc-darwin-arm64@14.1.0: 34.55 MB/34.55 MB, done
Progress: resolved 441, reused 359, downloaded 24, added 378, done

dependencies:
+ @ffmpeg-installer/ffmpeg 1.1.0
+ fluent-ffmpeg 2.1.3 deprecated
+ next 14.1.0 (16.1.1 is available) deprecated
+ react 18.3.1 (19.2.3 is available)
+ react-dom 18.3.1 (19.2.3 is available)

devDependencies:
+ @types/fluent-ffmpeg 2.1.28
+ @types/node 20.19.27 (25.0.3 is available)
+ @types/react 18.3.27 (19.2.7 is available)
+ @types/react-dom 18.3.7 (19.2.3 is available)
+ autoprefixer 10.4.23
+ eslint 8.57.1 (9.39.2 is available) deprecated
+ eslint-config-next 14.1.0 (16.1.1 is available)
+ postcss 8.5.6
+ tailwindcss 3.4.19 (4.1.18 is available)
+ typescript 5.9.3

╭ Warning ───────────────────────────────────────────────────────────────────────────────────╮
│                                                                                            │
│   Ignored build scripts: @ffmpeg-installer/darwin-arm64@4.1.5.                             │
│   Run "pnpm approve-builds" to pick which dependencies should be allowed to run scripts.   │
│                                                                                            │
╰────────────────────────────────────────────────────────────────────────────────────────────╯
Done in 19.7s using pnpm v10.27.0
leanid@MacBook-Pro-LeanidHamburg DashkaRecord % pnpm build 

> dashka-record@2.0.0-alpha build /Users/leanid/Documents/ITproject/DashkaRecord
> next build

   ▲ Next.js 14.1.0
   - Environments: .env.local

   Creating an optimized production build ...
Failed to compile.

./app/records/page.tsx
Module not found: Can't resolve '../components/ShareButton'

https://nextjs.org/docs/messages/module-not-found

./app/page.tsx
Module not found: Can't resolve './components/Recorder'

https://nextjs.org/docs/messages/module-not-found

./lib/processing.ts
Error: 
  x Expression expected
     ,-[/Users/leanid/Documents/ITproject/DashkaRecord/lib/processing.ts:189:1]
 189 |     return false;
 190 |   }
 191 | }
 192 | ~
     : ^
     `----

Caused by:
    Syntax Error

Import trace for requested module:
./lib/processing.ts
./app/api/upload/route.ts


> Build failed because of webpack errors
 ELIFECYCLE  Command failed with exit code 1.
leanid@MacBook-Pro-LeanidHamburg DashkaRecord % 
error task2