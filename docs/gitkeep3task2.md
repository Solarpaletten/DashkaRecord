leanid@MacBook-Pro-LeanidHamburg DashkaRecord % pnpm build

> dashka-record@2.0.0-alpha build /Users/leanid/Documents/ITproject/DashkaRecord
> next build

   ▲ Next.js 14.1.0
   - Environments: .env.local

   Creating an optimized production build ...
Failed to compile.

./app/layout.tsx
Module not found: Can't resolve '@app/globals.css'

https://nextjs.org/docs/messages/module-not-found

./lib/processing.ts
Module not found: Can't resolve '@/scripts/transcribe'

https://nextjs.org/docs/messages/module-not-found

Import trace for requested module:
./app/api/upload/route.ts

./lib/solar-core.ts
Error: 
  x Unterminated string constant
    ,-[/Users/leanid/Documents/ITproject/DashkaRecord/lib/solar-core.ts:5:1]
  5 | 
  6 | import { promises as fs } from 'fs';
  7 | import path from 'path';
  8 | import { RecorderSyncRequest, RecorderSyncResponse } from '@/types/api; 
    :                                                           ^^^^^^^^^^^^^^
  9 | import { readMetadata, updateMetadata } from './storage';
 10 | 
 11 | const SOLAR_CORE_URL = process.env.SOLAR_CORE_URL || 'http://localhost:8010';
    `----

Caused by:
    Syntax Error

Import trace for requested module:
./lib/solar-core.ts
./app/api/sync/route.ts

./lib/translate.ts
Module not found: Can't resolve './lib/storage'

https://nextjs.org/docs/messages/module-not-found

Import trace for requested module:
./app/api/translate/route.ts


> Build failed because of webpack errors
 ELIFECYCLE  Command failed with exit code 1.
leanid@MacBook-Pro-LeanidHamburg DashkaRecord % 
error task3