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
leanid@MacBook-Pro-LeanidHamburg DashkaRecord % git add . && git commit -m "error git3 task2" && git push
[main 923ac3f] error git3 task2
 Committer: LeanidHamburg <leanid@MacBook-Pro-LeanidHamburg.local>
Your name and email address were configured automatically based
on your username and hostname. Please check that they are accurate.
You can suppress this message by setting them explicitly. Run the
following command and follow the instructions in your editor to edit
your configuration file:

    git config --global --edit

After doing this, you may fix the identity used for this commit with:

    git commit --amend --reset-author

 20 files changed, 1081 insertions(+), 330 deletions(-)
 delete mode 100644 docs/gitkeep2task2.md
 create mode 100644 docs/gitkeep3task2.md
 delete mode 100644 docs/gitreport1task1.md
 create mode 100644 docs/gitreport2task2.md
 create mode 100644 tmp/Gitkeep2task2.md
 create mode 100644 tmp/TASK2_COMPLETE_POST_MIGRATION_FIXES.md
 create mode 100644 tmp/TASK2_SUMMARY.md
 create mode 100644 types/.gitkeep
fatal: The current branch main has no upstream branch.
To push the current branch and set the remote as upstream, use

    git push --set-upstream origin main

To have this happen automatically for branches without a tracking
upstream, see 'push.autoSetupRemote' in 'git help config'.

leanid@MacBook-Pro-LeanidHamburg DashkaRecord % git add . && git commit -m "error git3 task2" && git push origin main 
On branch main
nothing to commit, working tree clean
leanid@MacBook-Pro-LeanidHamburg DashkaRecord % git add . && git commit -m "error git3 task2" && git push origin main
[main 050fc02] error git3 task2
 Committer: LeanidHamburg <leanid@MacBook-Pro-LeanidHamburg.local>
Your name and email address were configured automatically based
on your username and hostname. Please check that they are accurate.
You can suppress this message by setting them explicitly. Run the
following command and follow the instructions in your editor to edit
your configuration file:

    git config --global --edit

After doing this, you may fix the identity used for this commit with:

    git commit --amend --reset-author

 1 file changed, 3 insertions(+), 1 deletion(-)
Enumerating objects: 44, done.
Counting objects: 100% (44/44), done.
Delta compression using up to 10 threads
Compressing objects: 100% (26/26), done.
Writing objects: 100% (27/27), 11.99 KiB | 11.99 MiB/s, done.
Total 27 (delta 12), reused 0 (delta 0), pack-reused 0 (from 0)
remote: Resolving deltas: 100% (12/12), completed with 9 local objects.
To https://github.com/Solarpaletten/DashkaRecord.git
   45e5a93..050fc02  main -> main
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


> Build failed because of webpack errors
 ELIFECYCLE  Command failed with exit code 1.
leanid@MacBook-Pro-LeanidHamburg DashkaRecord % 

error task3