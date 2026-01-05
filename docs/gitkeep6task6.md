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

./components/recorder/Recorder.tsx:129:43
Type error: Property 'grabFrame' does not exist on type 'ImageCapture'.

  127 |       if (typeof ImageCapture !== 'undefined') {
  128 |         const imageCapture = new ImageCapture(videoTrack);
> 129 |         const bitmap = await imageCapture.grabFrame();
      |                                           ^
  130 |         
  131 |         const canvas = document.createElement('canvas');
  132 |         canvas.width = bitmap.width;
 ELIFECYCLE  Command failed with exit code 1.
leanid@MacBook-Pro-LeanidHamburg DashkaRecord % git add . && git commit -m "git6task6" && git push origin main 

task6