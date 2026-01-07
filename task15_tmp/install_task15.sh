#!/bin/bash

##############################################################################
# TASK15 - DashkaRecord Database Integration Installation Script
# Team: Solar AI | IT
# Date: 07.01.2026
# Version: 1.1 - Extract to ./task15_tmp/extracted/
##############################################################################

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Emojis
CHECK="✅"
CROSS="❌"
ROCKET="🚀"
WRENCH="🔧"
PACKAGE="📦"

echo -e "${BLUE}${ROCKET} TASK15 - Database Integration Installer v1.1${NC}"
echo -e "${BLUE}====================================================${NC}"
echo ""

##############################################################################
# 1. CHECK PREREQUISITES
##############################################################################

echo -e "${YELLOW}${WRENCH} Checking prerequisites...${NC}"

# Check if we're in DashkaRecord directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}${CROSS} Error: Not in DashkaRecord directory!${NC}"
    echo -e "${YELLOW}Please run this script from the project root.${NC}"
    exit 1
fi

# Check if archive exists in project root
ARCHIVE_PATH="./task15_tmp/TASK15_DATABASE_INTEGRATION.tar.gz"
if [ ! -f "$ARCHIVE_PATH" ]; then
    echo -e "${RED}${CROSS} Error: Archive not found at ${ARCHIVE_PATH}${NC}"
    echo -e "${YELLOW}Please put TASK15_DATABASE_INTEGRATION.tar.gz in ./task15_tmp/ folder.${NC}"
    exit 1
fi

echo -e "${GREEN}${CHECK} Prerequisites OK${NC}"
echo "   Project: $(pwd)"
echo "   Archive: ${ARCHIVE_PATH}"
echo ""

##############################################################################
# 2. EXTRACT ARCHIVE
##############################################################################

echo -e "${YELLOW}${PACKAGE} Extracting archive...${NC}"

# Extract to project folder (not temp)
EXTRACT_DIR="./task15_tmp/extracted"
mkdir -p "$EXTRACT_DIR"

echo "   Extracting to: ${EXTRACT_DIR}"

# Extract archive
tar -xzf "$ARCHIVE_PATH" -C "$EXTRACT_DIR"
echo -e "${GREEN}${CHECK} Archive extracted${NC}"
echo ""

##############################################################################
# 3. BACKUP EXISTING FILES
##############################################################################

echo -e "${YELLOW}${WRENCH} Creating backups...${NC}"

BACKUP_DIR="./backups/task15_$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"

# Backup files that will be replaced
FILES_TO_BACKUP=(
    "lib/db.ts"
    "lib/recordings.ts"
    "app/api/upload/route.ts"
    "app/api/files/route.ts"
    "app/api/files/[id]/route.ts"
)

BACKUP_COUNT=0
for file in "${FILES_TO_BACKUP[@]}"; do
    if [ -f "$file" ]; then
        mkdir -p "$BACKUP_DIR/$(dirname $file)"
        cp "$file" "$BACKUP_DIR/$file"
        echo "   Backed up: $file"
        BACKUP_COUNT=$((BACKUP_COUNT + 1))
    fi
done

if [ $BACKUP_COUNT -gt 0 ]; then
    echo -e "${GREEN}${CHECK} Backed up ${BACKUP_COUNT} files in: ${BACKUP_DIR}${NC}"
else
    echo -e "${BLUE}ℹ️  No existing files to backup${NC}"
fi
echo ""

##############################################################################
# 4. INSTALL NEW FILES
##############################################################################

echo -e "${YELLOW}${ROCKET} Installing new files...${NC}"

# Create directories if they don't exist
mkdir -p lib
mkdir -p app/api/upload
mkdir -p app/api/files/[id]

INSTALL_COUNT=0

# Copy lib files
if [ -f "${EXTRACT_DIR}/lib_db.ts" ]; then
    cp "${EXTRACT_DIR}/lib_db.ts" lib/db.ts
    echo -e "${GREEN}${CHECK} Installed: lib/db.ts${NC}"
    INSTALL_COUNT=$((INSTALL_COUNT + 1))
fi

if [ -f "${EXTRACT_DIR}/lib_recordings.ts" ]; then
    cp "${EXTRACT_DIR}/lib_recordings.ts" lib/recordings.ts
    echo -e "${GREEN}${CHECK} Installed: lib/recordings.ts${NC}"
    INSTALL_COUNT=$((INSTALL_COUNT + 1))
fi

# Copy API routes
if [ -f "${EXTRACT_DIR}/api_upload_route.ts" ]; then
    cp "${EXTRACT_DIR}/api_upload_route.ts" app/api/upload/route.ts
    echo -e "${GREEN}${CHECK} Installed: app/api/upload/route.ts${NC}"
    INSTALL_COUNT=$((INSTALL_COUNT + 1))
fi

if [ -f "${EXTRACT_DIR}/api_files_route.ts" ]; then
    cp "${EXTRACT_DIR}/api_files_route.ts" app/api/files/route.ts
    echo -e "${GREEN}${CHECK} Installed: app/api/files/route.ts${NC}"
    INSTALL_COUNT=$((INSTALL_COUNT + 1))
fi

if [ -f "${EXTRACT_DIR}/api_files_id_route.ts" ]; then
    cp "${EXTRACT_DIR}/api_files_id_route.ts" "app/api/files/[id]/route.ts"
    echo -e "${GREEN}${CHECK} Installed: app/api/files/[id]/route.ts${NC}"
    INSTALL_COUNT=$((INSTALL_COUNT + 1))
fi

echo ""
echo -e "${BLUE}ℹ️  Using Solar standard (Prisma 6.19.1 + classic schema)${NC}"
echo ""

##############################################################################
# 5. VERIFY INSTALLATION
##############################################################################

echo -e "${YELLOW}${WRENCH} Verifying installation...${NC}"

INSTALLED_FILES=(
    "lib/db.ts"
    "lib/recordings.ts"
    "app/api/upload/route.ts"
    "app/api/files/route.ts"
    "app/api/files/[id]/route.ts"
)

ALL_OK=true
for file in "${INSTALLED_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}${CHECK} ${file}${NC}"
    else
        echo -e "${RED}${CROSS} ${file} - MISSING!${NC}"
        ALL_OK=false
    fi
done

echo ""

if [ "$ALL_OK" = true ]; then
    echo -e "${GREEN}${ROCKET}${ROCKET}${ROCKET} INSTALLATION SUCCESSFUL! ${ROCKET}${ROCKET}${ROCKET}${NC}"
else
    echo -e "${RED}${CROSS} Installation incomplete. Check errors above.${NC}"
    exit 1
fi

echo ""

##############################################################################
# 6. NEXT STEPS
##############################################################################

echo -e "${BLUE}====================================================${NC}"
echo -e "${BLUE}${ROCKET} NEXT STEPS:${NC}"
echo -e "${BLUE}====================================================${NC}"
echo ""
echo -e "${YELLOW}1. Generate Prisma Client:${NC}"
echo "   pnpm prisma generate"
echo ""
echo -e "${YELLOW}2. Start dev server:${NC}"
echo "   pnpm dev"
echo ""
echo -e "${YELLOW}3. Test upload:${NC}"
echo "   - Open http://localhost:3001"
echo "   - Record screen → Upload"
echo "   - Go to /records"
echo "   - Refresh → recording persists! ${CHECK}"
echo ""
echo -e "${YELLOW}4. Check database:${NC}"
echo "   pnpm prisma studio"
echo ""
echo -e "${YELLOW}5. Commit:${NC}"
echo "   git add ."
echo "   git commit -m \"feat(task15): add Prisma database integration\""
echo "   git push origin main"
echo ""
echo -e "${BLUE}====================================================${NC}"
echo -e "${GREEN}${PACKAGE} Extracted files: ${EXTRACT_DIR}${NC}"
if [ $BACKUP_COUNT -gt 0 ]; then
    echo -e "${GREEN}${ROCKET} Backups: ${BACKUP_DIR}${NC}"
fi
echo -e "${BLUE}====================================================${NC}"
echo ""
echo -e "${GREEN}Ready to test! 🎉${NC}"
echo ""
