#!/bin/bash

##############################################################################
# TASK17.1 - STORAGE LAYER FIX
# DashkaRecord v2.0.0-alpha
# Team: Solar AI | IT
# Date: 07.01.2026
# 
# USAGE (from project root):
#   cd DashkaRecord
#   ./scripts/fix_task17_1.sh
##############################################################################

set -e  # Exit on any error

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

CHECK="✅"
CROSS="❌"
ROCKET="🚀"
WRENCH="🔧"

echo -e "${BLUE}${ROCKET} TASK17.1 - STORAGE LAYER FIX${NC}"
echo -e "${BLUE}====================================================${NC}"
echo ""

##############################################################################
# 1. CHECK PREREQUISITES
##############################################################################

echo -e "${YELLOW}${WRENCH} Checking prerequisites...${NC}"

if [ ! -f "package.json" ]; then
    echo -e "${RED}${CROSS} Error: Not in DashkaRecord root!${NC}"
    echo -e "${YELLOW}Usage:${NC}"
    echo "   cd DashkaRecord"
    echo "   ./scripts/fix_task17_1.sh"
    exit 1
fi

echo -e "${GREEN}${CHECK} Running from project root${NC}"
echo "   $(pwd)"
echo ""

##############################################################################
# 2. CREATE BACKUPS
##############################################################################

echo -e "${YELLOW}${WRENCH} Creating backups...${NC}"

BACKUP_DIR="./backups/task17_1_$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR/app/api/upload"
mkdir -p "$BACKUP_DIR/lib"

if [ -f "app/api/upload/route.ts" ]; then
    cp app/api/upload/route.ts "$BACKUP_DIR/app/api/upload/route.ts"
    echo "   Backed up: app/api/upload/route.ts"
fi

if [ -f "lib/storage.ts" ]; then
    cp lib/storage.ts "$BACKUP_DIR/lib/storage.ts"
    echo "   Backed up: lib/storage.ts"
fi

if [ -f "tsconfig.json" ]; then
    cp tsconfig.json "$BACKUP_DIR/tsconfig.json"
    echo "   Backed up: tsconfig.json"
fi

echo -e "${GREEN}${CHECK} Backups: ${BACKUP_DIR}${NC}"
echo ""

##############################################################################
# 3. FIX app/api/upload/route.ts
##############################################################################

echo -e "${YELLOW}${WRENCH} Fixing app/api/upload/route.ts...${NC}"

cat > app/api/upload/route.ts << 'EOF'
/**
 * Upload API Route - WITH PRISMA DATABASE
 * TASK15 - Database Integration
 * TASK17 - Fixed: removed unused saveVideoFile import
 * TASK17.1 - Unified: use storage.ts ID generator
 * DashkaRecord v2.0.0-alpha
 * 
 * Handles file uploads and saves metadata to PostgreSQL
 */

import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { createRecording } from '@/lib/recordings';
import { createRecordingId } from '@/lib/storage';

const UPLOAD_DIR = path.join(process.cwd(), 'uploads/video');

/**
 * Ensure upload directory exists
 */
async function ensureUploadDir(): Promise<void> {
  await fs.mkdir(UPLOAD_DIR, { recursive: true });
}

/**
 * POST /api/upload
 * Upload a screen recording and save to database
 */
export async function POST(req: NextRequest) {
  console.log('📤 Upload request received');

  try {
    await ensureUploadDir();

    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      console.error('❌ No file in request');
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    console.log(`📁 File received: ${file.name} (${file.size} bytes)`);

    // Generate recording ID (INSIDE function!)
    const recordingId = createRecordingId();
    const filename = `${recordingId}.webm`;
    const filePath = path.join(UPLOAD_DIR, filename);

    // Save file to disk
    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(filePath, buffer);
    console.log(`💾 File saved to disk: ${filePath}`);

    // Save metadata to PostgreSQL
    try {
      const recording = await createRecording({
        id: recordingId,
        filename,
        webmPath: filePath,
        fileSizeBytes: BigInt(file.size),
        status: 'uploaded',
      });

      console.log(`✅ Recording created in database: ${recording.id}`);

      return NextResponse.json({
        success: true,
        message: 'Recording uploaded! Processing in background.',
        recordingId: recording.id,
        filename: recording.filename,
      });
    } catch (dbError) {
      // If database save fails, delete the file
      console.error(`❌ Database error, cleaning up file:`, dbError);
      try {
        await fs.unlink(filePath);
      } catch (cleanupError) {
        console.error(`⚠️ Failed to cleanup file:`, cleanupError);
      }

      throw new Error(`Database save failed: ${dbError instanceof Error ? dbError.message : 'Unknown error'}`);
    }

  } catch (error) {
    console.error('❌ Upload error:', error);

    return NextResponse.json(
      {
        error: 'Upload failed',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
EOF

echo -e "${GREEN}${CHECK} app/api/upload/route.ts fixed${NC}"
echo ""

##############################################################################
# 4. CLEANUP PROBLEMATIC BACKUPS
##############################################################################

echo -e "${YELLOW}${WRENCH} Cleaning problematic backups...${NC}"

PROBLEM_BACKUP="./backups/task15_20260107_162850"
if [ -d "$PROBLEM_BACKUP" ]; then
    rm -rf "$PROBLEM_BACKUP"
    echo -e "${GREEN}${CHECK} Removed: $PROBLEM_BACKUP${NC}"
else
    echo -e "${BLUE}ℹ️  Already clean${NC}"
fi
echo ""

##############################################################################
# 5. UPDATE TSCONFIG.JSON
##############################################################################

echo -e "${YELLOW}${WRENCH} Updating tsconfig.json...${NC}"

cat > tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules", "backups/**", ".next"]
}
EOF

echo -e "${GREEN}${CHECK} tsconfig.json updated${NC}"
echo ""

##############################################################################
# 6. TEST BUILD
##############################################################################

echo -e "${YELLOW}${WRENCH} Testing build...${NC}"
echo ""

if pnpm build; then
    echo ""
    echo -e "${GREEN}${CHECK} Build successful!${NC}"
else
    echo ""
    echo -e "${RED}${CROSS} Build failed!${NC}"
    echo -e "${YELLOW}Restore from: ${BACKUP_DIR}${NC}"
    exit 1
fi
echo ""

##############################################################################
# 7. SUMMARY
##############################################################################

echo -e "${BLUE}====================================================${NC}"
echo -e "${BLUE}${ROCKET} FIX COMPLETE!${NC}"
echo -e "${BLUE}====================================================${NC}"
echo ""
echo -e "${GREEN}${CHECK} Fixed:${NC}"
echo "   - app/api/upload/route.ts"
echo "   - tsconfig.json"
echo ""
echo -e "${GREEN}${CHECK} Backups: ${BACKUP_DIR}${NC}"
echo -e "${GREEN}${CHECK} Build: SUCCESS${NC}"
echo ""
echo -e "${YELLOW}NEXT STEPS:${NC}"
echo ""
echo "1. Test:"
echo "   pnpm dev"
echo ""
echo "2. Commit:"
echo "   git add ."
echo "   git commit -m \"fix(task17.1): storage layer fix\""
echo "   git push origin main"
echo ""
echo -e "${GREEN}Done! 🎉${NC}"
echo ""
