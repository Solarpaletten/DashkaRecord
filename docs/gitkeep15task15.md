Принято. Ниже — **чёткая, финальная команда D=>C (Dashka → Claude)** на **реализацию**, без обсуждений и развилок. Это уже **исполнение архитектурного решения**, которое ты утвердил.

---

## **D=>C TASK — IMPLEMENTATION**

### **TASK 15 — Prisma Migration & DB Persistence (Dashka Record)**

**Роль:** Claude (AI Engineer)
**Проект:** Dashka Record
**База:** PostgreSQL + Prisma
**Эталон:** `solar-nextjs-template` (Prisma стиль и подход)
**Деплой:** self-host / Render / VPS (НЕ Vercel)

---

### 🎯 **ЦЕЛЬ**

Перевести Dashka Record с file-based metadata (`uploads/metadata/*.json`) на **PostgreSQL + Prisma**, сохранив:

* файловое хранилище для видео (disk),
* стабильный список записей в `/records`,
* единый стандарт Solar (Prisma, lib/db.ts, API через App Router).

---

### 🧱 **ОБЯЗАТЕЛЬНАЯ PRISMA-МОДЕЛЬ**

Использовать **ТОЛЬКО** эту модель (утверждена архитектором):

```prisma
model Recording {
  id                String   @id @default(dbgenerated("uuid_generate_v4()")) @db.Uuid
  filename          String   @db.VarChar(255)

  webmPath          String   @map("webm_path") @db.Text
  mp4Path           String?  @map("mp4_path") @db.Text
  transcriptPath    String?  @map("transcript_path") @db.Text
  subtitlesPath     String?  @map("subtitles_path") @db.Text

  fileSizeBytes     BigInt?  @map("file_size_bytes")
  durationSeconds   Int?     @map("duration_seconds")
  language          String?  @db.VarChar(10)
  languageConfidence Float?  @map("language_confidence")

  status            String   @default("uploaded") @db.VarChar(50)
  processingStep    String?  @map("processing_step") @db.VarChar(100)
  processingMessage String?  @map("processing_message")

  translated        Boolean  @default(false)
  synced            Boolean  @default(false)

  errorStep         String?  @map("error_step")
  errorMessage      String?  @map("error_message")
  errorAt           DateTime? @map("error_at") @db.Timestamptz

  createdAt         DateTime @default(now()) @map("created_at") @db.Timestamptz
  updatedAt         DateTime @default(now()) @updatedAt @map("updated_at") @db.Timestamptz

  @@index([createdAt])
  @@index([status])
  @@map("recordings")
}
```

---

### 🛠️ **ШАГИ РЕАЛИЗАЦИИ (ОБЯЗАТЕЛЬНО В ЭТОМ ПОРЯДКЕ)**

#### 1️⃣ Prisma setup

* Добавить `prisma/` в Dashka Record
* `schema.prisma` с моделью выше
* `pnpm prisma generate`
* `pnpm prisma migrate dev --name init_recordings`

#### 2️⃣ DB слой

Создать:

* `lib/db.ts` — PrismaClient singleton
* `lib/recordings.ts`:

  * `createRecording`
  * `listRecordings`
  * `getRecording(id)`
  * `updateRecording(id, data)`

❌ **НЕ использовать fs для metadata**

#### 3️⃣ API обновления

Переписать:

* `/api/upload`

  * файл → сохраняется на диск
  * metadata → `createRecording(...)`
* `/api/files`

  * `GET` → `listRecordings()` из Prisma
* `/api/files/[id]`

  * `GET` → `getRecording(id)`
  * `DELETE` → удалить запись из Prisma + удалить файлы с диска

#### 4️⃣ Frontend

* `/records` должен читать **ТОЛЬКО API**
* После refresh список **НЕ должен пропадать**

#### 5️⃣ Удалить legacy

* Убрать:

  * `uploads/metadata/*.json`
  * `fs.readdir` для листинга
* `lib/storage.ts` оставить **только** для работы с файлами (disk I/O)

---

### 🚀 **ACCEPTANCE CRITERIA (ПРОВЕРКА)**

* [ ] Записал экран
* [ ] Видео сохранилось на диск
* [ ] Запись появилась в PostgreSQL
* [ ] `/records` показывает запись
* [ ] Обновил страницу → запись осталась
* [ ] Поведение одинаково локально и на сервере

---

### 📦 **DELIVERABLES**

Claude обязан выдать:

1. `prisma/schema.prisma`
2. Миграции
3. `lib/db.ts`, `lib/recordings.ts`
4. Обновлённые API routes
5. Краткий отчёт: что заменено, что удалено

---

### 🚫 **ОГРАНИЧЕНИЯ**

* ❌ Не использовать Vercel
* ❌ Не хранить видео в БД
* ❌ Не смешивать file-based metadata с Prisma

---

### 🧭 **КОНТЕКСТ**

Это прямое продолжение Solar архитектуры.
Цель — **production-grade persistence**, без костылей.

---

**D=>C:** Приступай к реализации **TASK 15**.
Отчёт + файлы — по готовности.


leanid@MacBook-Pro-LeanidHamburg DashkaRecord % cd prisma 
leanid@MacBook-Pro-LeanidHamburg prisma % ls -la 
total 32
drwxr-xr-x@  5 leanid  staff   160 Jan  7 13:29 .
drwxr-xr-x@ 32 leanid  staff  1024 Jan  7 13:29 ..
-rw-r--r--@  1 leanid  staff  8196 Jan  7 13:29 .DS_Store
drwxr-xr-x@  2 leanid  staff    64 Jan  7 13:29 migrations
-rw-r--r--@  1 leanid  staff  1483 Jan  7 13:32 schema.prisma
leanid@MacBook-Pro-LeanidHamburg prisma % cat schema.prisma 
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Recording {
  id              String   @id @default(dbgenerated("uuid_generate_v4()")) @db.Uuid

  filename        String   @db.VarChar(255)

  // File paths (local disk or mounted volume)
  webmPath        String   @map("webm_path") @db.Text
  mp4Path         String?  @map("mp4_path") @db.Text
  transcriptPath  String?  @map("transcript_path") @db.Text
  subtitlesPath   String?  @map("subtitles_path") @db.Text

  // Metadata
  fileSizeBytes   BigInt?  @map("file_size_bytes")
  durationSeconds Int?     @map("duration_seconds")
  language        String?  @db.VarChar(10)
  languageConfidence Float? @map("language_confidence")

  // Processing state
  status          String   @default("uploaded") @db.VarChar(50)
  processingStep  String?  @map("processing_step") @db.VarChar(100)
  processingMessage String? @map("processing_message")

  // Flags
  translated      Boolean  @default(false)
  synced          Boolean  @default(false)

  // Errors
  errorStep       String?  @map("error_step")
  errorMessage    String?  @map("error_message")
  errorAt         DateTime? @map("error_at") @db.Timestamptz

  createdAt       DateTime @default(now()) @map("created_at") @db.Timestamptz
  updatedAt       DateTime @default(now()) @updatedAt @map("updated_at") @db.Timestamptz

  @@index([createdAt])
  @@index([status])
  @@map("recordings")
}
leanid@MacBook-Pro-LeanidHamburg prisma % pnpm add prisma @prisma/client
 WARN  deprecated fluent-ffmpeg@2.1.3: Package no longer supported. Contact Support at https://www.npmjs.com/support for more info.
 WARN  deprecated eslint@8.57.1: This version is no longer supported. Please see https://eslint.org/version-support for other options.
 WARN  deprecated next@14.1.0: This version has a security vulnerability. Please upgrade to a patched version. See https://nextjs.org/blog/security-update-2025-12-11 for more details.
Downloading prisma@7.2.0: 6.96 MB/6.96 MB, done
 WARN  Tarball download average speed 43 KiB/s (size 44 KiB) is below 50 KiB/s: https://registry.npmjs.org/@prisma/client-runtime-utils/-/client-runtime-utils-7.2.0.tgz (GET)
 WARN  Tarball download average speed 36 KiB/s (size 41 KiB) is below 50 KiB/s: https://registry.npmjs.org/@prisma/dev/-/dev-0.17.0.tgz (GET): 7.15 MB/10.62 MB
Downloading @prisma/client@7.2.0: 10.62 MB/10.62 MB, done
Downloading @electric-sql/pglite@0.3.2: 7.68 MB/7.68 MB, done
 WARN  5 deprecated subdependencies found: @humanwhocodes/config-array@0.13.0, @humanwhocodes/object-schema@2.0.3, glob@7.2.3, inflight@1.0.6, rimraf@3.0.2
Packages: +79 -1
+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++-
Progress: resolved 519, reused 407, downloaded 54, added 79, done

dependencies:
+ @prisma/client 7.2.0
+ prisma 7.2.0

╭ Warning ───────────────────────────────────────────────────────────────────────────────────╮
│                                                                                            │
│   Ignored build scripts: @ffmpeg-installer/darwin-arm64@4.1.5.                             │
│   Run "pnpm approve-builds" to pick which dependencies should be allowed to run scripts.   │
│                                                                                            │
╰────────────────────────────────────────────────────────────────────────────────────────────╯
Done in 9s using pnpm v10.27.0
leanid@MacBook-Pro-LeanidHamburg prisma % pnpm prisma init
 ERROR  A folder called prisma already exists in your project.
        Please try again in a project that is not yet using Prisma.
      
leanid@MacBook-Pro-LeanidHamburg prisma % pnpm prisma generate

Prisma schema loaded from prisma/schema.prisma.
Error: Prisma schema validation - (get-config wasm)
Error code: P1012
error: The datasource property `url` is no longer supported in schema files. Move connection URLs for Migrate to `prisma.config.ts` and pass either `adapter` for a direct database connection or `accelerateUrl` for Accelerate to the `PrismaClient` constructor. See https://pris.ly/d/config-datasource and https://pris.ly/d/prisma7-client-config
  -->  prisma/schema.prisma:7
   | 
 6 |   provider = "postgresql"
 7 |   url      = env("DATABASE_URL")
   | 

Validation Error Count: 1
[Context: getConfig]

Prisma CLI Version : 7.2.0
leanid@MacBook-Pro-LeanidHamburg prisma % 
leanid@MacBook-Pro-LeanidHamburg prisma %
zsh: command not found: leanid@MacBook-Pro-LeanidHamburg
leanid@MacBook-Pro-LeanidHamburg prisma % pnpm prisma migrate dev --name init_recordings

Prisma schema loaded from prisma/schema.prisma.
Error: Prisma schema validation - (get-config wasm)
Error code: P1012
error: The datasource property `url` is no longer supported in schema files. Move connection URLs for Migrate to `prisma.config.ts` and pass either `adapter` for a direct database connection or `accelerateUrl` for Accelerate to the `PrismaClient` constructor. See https://pris.ly/d/config-datasource and https://pris.ly/d/prisma7-client-config
  -->  prisma/schema.prisma:7
   | 
 6 |   provider = "postgresql"
 7 |   url      = env("DATABASE_URL")
   | 

Validation Error Count: 1
[Context: getConfig]

Prisma CLI Version : 7.2.0
leanid@MacBook-Pro-LeanidHamburg prisma % pnpm prisma generate                          

task 15 