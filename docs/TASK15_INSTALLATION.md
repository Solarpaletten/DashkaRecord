# 🎯 TASK15 - ИНСТРУКЦИЯ ПО УСТАНОВКЕ

**C=>L** | **07.01.2026** | **DATABASE INTEGRATION**

---

## 📦 ЧТО В АРХИВЕ

**TASK15_DATABASE_INTEGRATION.tar.gz содержит:**

```
1. prisma.config.ts              # Prisma 7 config
2. prisma_schema.prisma          # Database schema
3. lib_db.ts                     # PrismaClient singleton
4. lib_recordings.ts             # Database operations
5. api_upload_route.ts           # Updated upload API
6. api_files_route.ts            # Updated files API
7. api_files_id_route.ts         # Updated single file API
8. migration_init.sql            # PostgreSQL migration
9. env.example                   # Updated environment vars
10. TASK15_COMPLETE.md           # Full technical report
```

---

## 🚀 УСТАНОВКА (10 МИНУТ)

### ШАГ 1: Распаковать архив

```bash
cd ~/Downloads
tar -xzf TASK15_DATABASE_INTEGRATION.tar.gz
cd ~/DashkaRecord
```

---

### ШАГ 2: Скопировать файлы

```bash
# Config files
cp ~/Downloads/prisma.config.ts ./
cp ~/Downloads/env.example ./

# Prisma schema (ЗАМЕНИТЬ!)
cp ~/Downloads/prisma_schema.prisma prisma/schema.prisma

# Lib modules
cp ~/Downloads/lib_db.ts lib/db.ts
cp ~/Downloads/lib_recordings.ts lib/recordings.ts

# API routes (ЗАМЕНИТЬ!)
cp ~/Downloads/api_upload_route.ts app/api/upload/route.ts
cp ~/Downloads/api_files_route.ts app/api/files/route.ts
cp ~/Downloads/api_files_id_route.ts app/api/files/[id]/route.ts

# Migration SQL
cp ~/Downloads/migration_init.sql prisma/migrations/
```

---

### ШАГ 3: Создать PostgreSQL Database

**OPTION A: Render.com (Recommended)**

```
1. Зайди на render.com
2. New → PostgreSQL
3. Name: dashkarecord-db
4. Plan: Free (256MB RAM)
5. Region: Frankfurt (EU)
6. Create Database
7. Скопируй "Internal Connection String":
   postgresql://dashkarecord_user:XXX@dpg-XXX-a/dashkarecord_XXX
```

**OPTION B: Local PostgreSQL**

```bash
# Install
brew install postgresql@16  # macOS

# Start
brew services start postgresql@16

# Create DB
createdb dashkarecord

# Connection string:
postgresql://$(whoami)@localhost:5432/dashkarecord
```

---

### ШАГ 4: Настроить .env

```bash
cd ~/DashkaRecord

# Copy example
cp .env.example .env

# Edit
nano .env

# Добавь:
DATABASE_URL="postgresql://dashkarecord_user:XXX@dpg-XXX-a/dashkarecord_XXX"
```

**⚠️ ВАЖНО:** Замени на свой connection string из Render!

---

### ШАГ 5: Запустить миграцию

```bash
cd ~/DashkaRecord

# Generate Prisma Client
pnpm prisma generate

# Apply migration
pnpm prisma migrate dev --name init_recordings

# Ожидаемо:
# ✓ Generated Prisma Client
# ✓ Migration applied
# ✓ Database synced
```

**Если ошибка с Prisma 7:**
- Проверь что `prisma.config.ts` в корне проекта
- Проверь что `prisma/schema.prisma` БЕЗ строки `url = env("DATABASE_URL")`

---

### ШАГ 6: Тестировать локально

```bash
# Start dev
pnpm dev

# Открой:
http://localhost:3002

# Тест:
1. Record screen → Upload
2. Открой /records
3. ✅ Видишь запись!
4. Refresh страницу
5. ✅ Запись осталась! (не пропала!)

# Check database
pnpm prisma studio
# → Откроется GUI с таблицей recordings
```

---

### ШАГ 7: Git Commit

```bash
cd ~/DashkaRecord

git add .
git commit -m "feat(task15): migrate to PostgreSQL + Prisma

- Replace file-based metadata with PostgreSQL
- Add Prisma 7 with Recording model  
- Update all API routes to use database
- Add migration and setup docs

BREAKING CHANGE: Requires DATABASE_URL env variable
"

git push origin main
```

---

### ШАГ 8: Deploy на Render

```
1. Зайди на render.com → Web Service (dashkarecord)
2. Environment → Add Environment Variable
3. Key: DATABASE_URL
4. Value: (paste Internal Connection String)
5. Save Changes → Deploys automatically

6. Wait for deploy...
7. Зайди на https://dashkarecord.onrender.com/records
8. ✅ Recordings персистят после refresh!
```

---

## ✅ ПРОВЕРКА

### Локально:

- [ ] `pnpm prisma generate` ✅
- [ ] `pnpm prisma migrate dev` ✅
- [ ] `pnpm dev` запускается ✅
- [ ] Upload file → сохраняется ✅
- [ ] `/records` показывает запись ✅
- [ ] Refresh → запись осталась ✅
- [ ] `pnpm prisma studio` показывает данные ✅

### Production (Render):

- [ ] DATABASE_URL установлен ✅
- [ ] Deploy успешен ✅
- [ ] Upload работает ✅
- [ ] `/records` показывает записи ✅
- [ ] Refresh → данные сохраняются ✅

---

## 🔧 TROUBLESHOOTING

### Ошибка: "url is no longer supported"

```bash
# Проверь:
cat prisma/schema.prisma | grep "url"

# Должно быть:
datasource db {
  provider = "postgresql"
  # url moved to prisma.config.ts
}

# НЕ должно быть:
url = env("DATABASE_URL")  # ❌ УДАЛИ ЭТУ СТРОКУ!
```

---

### Ошибка: "Can't reach database server"

```bash
# Проверь DATABASE_URL
echo $DATABASE_URL

# Format должен быть:
postgresql://USER:PASSWORD@HOST:PORT/DATABASE

# Проверь что database запущен:
psql $DATABASE_URL -c "SELECT 1"
```

---

### Ошибка при migrate: "Extension does not exist"

```bash
# Подключись к DB:
psql $DATABASE_URL

# Создай extension:
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
\q

# Повтори migrate:
pnpm prisma migrate dev
```

---

## 📊 ЧТО ИЗМЕНИЛОСЬ

### БЫЛО (File-based):
```
uploads/
├── video/
│   └── 20260107_123456.webm ✅
└── metadata/
    └── 20260107_123456.json ✅  ← Терялся на Render!
```

### СТАЛО (Database):
```
uploads/
└── video/
    └── 20260107_123456.webm ✅

PostgreSQL:
└── recordings table ✅  ← Персистит всегда!
    ├── id: "20260107_123456"
    ├── filename: "20260107_123456.webm"
    ├── webmPath: "/path/to/file"
    └── ... (все metadata)
```

---

## 🎯 РЕЗУЛЬТАТ

**ПОСЛЕ TASK15:**

1. ✅ Upload сохраняется в PostgreSQL
2. ✅ /records показывает все записи
3. ✅ Refresh не теряет данные
4. ✅ Server restart не теряет данные
5. ✅ Production ready!
6. ✅ Соответствует Solar стандартам

---

## 📚 ДОПОЛНИТЕЛЬНО

**Полная документация:** TASK15_COMPLETE.md (~13 KB)

**Содержит:**
- Detailed architecture
- Before/After comparison
- Migration guide
- Future enhancements
- Troubleshooting guide

---

**УСТАНАВЛИВАЙ И ТЕСТИРУЙ! 🚀**

**Team:** Solar AI | IT  
**Date:** 07.01.2026  
**Status:** ✅ READY FOR DEPLOYMENT
