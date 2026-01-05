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
./lib/processing.ts
./app/api/upload/route.ts

./node_modules/.pnpm/fluent-ffmpeg@2.1.3/node_modules/fluent-ffmpeg/lib/options/misc.js
Critical dependency: the request of a dependency is an expression

Import trace for requested module:
./node_modules/.pnpm/fluent-ffmpeg@2.1.3/node_modules/fluent-ffmpeg/lib/options/misc.js
./node_modules/.pnpm/fluent-ffmpeg@2.1.3/node_modules/fluent-ffmpeg/lib/fluent-ffmpeg.js
./node_modules/.pnpm/fluent-ffmpeg@2.1.3/node_modules/fluent-ffmpeg/index.js
./lib/convert.ts
./lib/processing.ts
./app/api/upload/route.ts

 ✓ Compiled successfully
   Linting and checking validity of types  .Failed to compile.

./app/records/page.tsx:363:34
Type error: Type 'Recording' is not assignable to type '{ id: string; language: string; video_path: string; transcript_path: string; translation_path?: string | undefined; pdf_path: string; created_at: string; }'.
  Types of property 'language' are incompatible.
    Type 'string | undefined' is not assignable to type 'string'.
      Type 'undefined' is not assignable to type 'string'.

  361 |                   {/* Share & Delete Row */}
  362 |                   <div className="flex gap-2 pt-2">
> 363 |                     <ShareButton recording={recording} />
      |                                  ^
  364 |                     
  365 |                     <button
  366 |                       onClick={() => deleteRecording(recording.id)}
   Linting and checking validity of types  .. ELIFECYCLE  Command failed with exit code 1.
leanid@MacBook-Pro-LeanidHamburg DashkaRecord % git add . && git commit -m "git5 task5" && git push origin main 

error task5