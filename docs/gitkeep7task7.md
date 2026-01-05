leanid@MacBook-Pro-LeanidHamburg DashkaRecord % pnpm build                                                      

> dashka-record@2.0.0-alpha build /Users/leanid/Documents/ITproject/DashkaRecord
> next build

   ▲ Next.js 14.1.0
   - Environments: .env.local

   Creating an optimized production build ...
 ⚠ Compiled with warnings

./node_modules/.pnpm/@ffmpeg-installer+ffmpeg@1.1.0/node_modules/@ffmpeg-installer/ffmpeg/index.js
Critical dependency: the request of a dependency is an expression

Import trace for requested module:
./node_modules/.pnpm/@ffmpeg-installer+ffmpeg@1.1.0/node_modules/@ffmpeg-installer/ffmpeg/index.js
./lib/convert.ts
./app/api/download/[id]/mp4/route.ts

./node_modules/.pnpm/fluent-ffmpeg@2.1.3/node_modules/fluent-ffmpeg/lib/options/misc.js
Critical dependency: the request of a dependency is an expression

Import trace for requested module:
./node_modules/.pnpm/fluent-ffmpeg@2.1.3/node_modules/fluent-ffmpeg/lib/options/misc.js
./node_modules/.pnpm/fluent-ffmpeg@2.1.3/node_modules/fluent-ffmpeg/lib/fluent-ffmpeg.js
./node_modules/.pnpm/fluent-ffmpeg@2.1.3/node_modules/fluent-ffmpeg/index.js
./lib/convert.ts
./app/api/download/[id]/mp4/route.ts

 ✓ Compiled successfully
   Linting and checking validity of types  ..Failed to compile.

./lib/transcribe.ts:56:17
Type error: Cannot find name 'getRecordingPaths'.

  54 |
  55 |   // Save results to files
> 56 |   const paths = getRecordingPaths(recordingId);
     |                 ^
  57 |
  58 |   // Save main transcript
  59 |   await fs.writeFile(
 ELIFECYCLE  Command failed with exit code 1.
leanid@MacBook-Pro-LeanidHamburg DashkaRecord % 

task7