leanid@MacBook-Pro-LeanidHamburg DashkaRecord % >....                                                        
# Создай .env
cat > .env << 'EOF'
# DashkaRecord Database (на Solar сервере)
DATABASE_URL="postgresql://solar_user:Pass123@207.154.220.86:5433/dashkarecord"

# Optional AI features
OPENAI_API_KEY=""
DEEPSEEK_API_KEY=""

# Solar Core integration
SOLAR_CORE_API_URL=""
SOLAR_CORE_API_KEY=""

# Feature flags
ENABLE_AI_TRANSCRIPTION="false"
ENABLE_AI_TRANSLATION="false"
ENABLE_SOLAR_SYNC="false"
ENABLE_MP4_CONVERSION="true"

# Node environment
NODE_ENV="development"
EOF

# Проверь что создался
cat .env
cd: no such file or directory: /Users/leanid/DashkaRecord
zsh: command not found: #
zsh: command not found: #
# DashkaRecord Database (на Solar сервере)
DATABASE_URL="postgresql://solar_user:Pass123@207.154.220.86:5433/dashkarecord"

# Optional AI features
OPENAI_API_KEY=""
DEEPSEEK_API_KEY=""

# Solar Core integration  
SOLAR_CORE_API_URL=""
SOLAR_CORE_API_KEY=""

# Feature flags
ENABLE_AI_TRANSCRIPTION="false"
ENABLE_AI_TRANSLATION="false"
ENABLE_SOLAR_SYNC="false"
ENABLE_MP4_CONVERSION="true"

# Node environment
NODE_ENV="development"
leanid@MacBook-Pro-LeanidHamburg DashkaRecord % pnpm prisma generate
Environment variables loaded from .env
Prisma schema loaded from prisma/schema.prisma
┌─────────────────────────────────────────────────────────┐
│  Update available 6.19.1 -> 7.2.0                       │
│                                                         │
│  This is a major update - please follow the guide at    │
│  https://pris.ly/d/major-version-upgrade                │
│                                                         │
│  Run the following to update                            │
│    npm i --save-dev prisma@latest                       │
│    npm i @prisma/client@latest                          │
└─────────────────────────────────────────────────────────┘

✔ Generated Prisma Client (v6.19.1) to ./node_modules/.pnpm/@prisma+client@6.19.1_prisma@6.19.1_typescript@5.9.3__typescript@5.9.3/node_modules/@prisma/client in 39ms

Start by importing your Prisma Client (See: https://pris.ly/d/importing-client)

Tip: Interested in query caching in just a few lines of code? Try Accelerate today! https://pris.ly/tip-3-accelerate

leanid@MacBook-Pro-LeanidHamburg DashkaRecord % pnpm prisma db pull
Environment variables loaded from .env
Prisma schema loaded from prisma/schema.prisma
Datasource "db": PostgreSQL database "dashkarecord", schema "public" at "207.154.220.86:5433"

✖ Introspecting based on datasource defined in prisma/schema.prisma
Error: 
P4001 The introspected database was empty:

prisma db pull could not create any models in your schema.prisma file and you will not be able to generate Prisma Client with the prisma generate command.

To fix this, you have two options:

- manually create a table in your database.
- make sure the database connection URL inside the datasource block in schema.prisma points to a database that is not empty (it must contain at least one table).

Then you can run prisma db pull again. 

leanid@MacBook-Pro-LeanidHamburg DashkaRecord % pnpm prisma migrate dev --name init_recordings
Environment variables loaded from .env
Prisma schema loaded from prisma/schema.prisma
Datasource "db": PostgreSQL database "dashkarecord", schema "public" at "207.154.220.86:5433"

Applying migration `20260107134319_init_recordings`

The following migration(s) have been created and applied from new schema changes:

prisma/migrations/
  └─ 20260107134319_init_recordings/
    └─ migration.sql

Your database is now in sync with your schema.

✔ Generated Prisma Client (v6.19.1) to ./node_modules/.pnpm/@prisma+client@6.19.1_prisma@6.19.1_typescript@5
.9.3__typescript@5.9.3/node_modules/@prisma/client in 41ms


leanid@MacBook-Pro-LeanidHamburg DashkaRecord % pnpm prisma studio
Environment variables loaded from .env
Prisma schema loaded from prisma/schema.prisma
Prisma Studio is up on http://localhost:5555
Prisma schema loaded from prisma/schema.prisma
^C
leanid@MacBook-Pro-LeanidHamburg DashkaRecord % psql "postgresql://solar_user:Pass123@207.154.220.86:5433/dashkarecord" -c "\dt"
                List of relations
 Schema |        Name        | Type  |   Owner    
--------+--------------------+-------+------------
 public | _prisma_migrations | table | solar_user
 public | recordings         | table | solar_user
(2 rows)

leanid@MacBook-Pro-LeanidHamburg DashkaRecord % pnpm dev

> dashka-record@2.0.0-alpha dev /Users/leanid/Documents/ITproject/DashkaRecord
> next dev

 ⚠ Port 3000 is in use, trying 3001 instead.
 ⚠ Port 3001 is in use, trying 3002 instead.
 ⚠ Port 3002 is in use, trying 3003 instead.
 ⚠ Port 3003 is in use, trying 3004 instead.
 ⚠ Port 3004 is in use, trying 3005 instead.
   ▲ Next.js 14.1.0
   - Local:        http://localhost:3005
   - Environments: .env.local, .env

npm warn Unknown env config "npm-globalconfig". This will stop working in the next major version of npm.
npm warn Unknown env config "verify-deps-before-run". This will stop working in the next major version of npm.
npm warn Unknown env config "_jsr-registry". This will stop working in the next major version of npm.
 ✓ Ready in 2.6s
^C
leanid@MacBook-Pro-LeanidHamburg DashkaRecord % pnpm dev

> dashka-record@2.0.0-alpha dev /Users/leanid/Documents/ITproject/DashkaRecord
> next dev

 ⚠ Port 3000 is in use, trying 3001 instead.
   ▲ Next.js 14.1.0
   - Local:        http://localhost:3001
   - Environments: .env.local, .env

npm warn Unknown env config "npm-globalconfig". This will stop working in the next major version of npm.
npm warn Unknown env config "verify-deps-before-run". This will stop working in the next major version of npm.
npm warn Unknown env config "_jsr-registry". This will stop working in the next major version of npm.
 ✓ Ready in 1454ms
 ○ Compiling / ...
 ✓ Compiled / in 991ms (435 modules)
task15