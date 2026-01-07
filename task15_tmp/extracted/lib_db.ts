/**
 * Prisma Client Singleton
 * TASK15 - Database Integration
 * DashkaRecord v2.0.0-alpha
 * 
 * Prisma 7 compatible with proper singleton pattern
 */

import { PrismaClient } from '@prisma/client';

/**
 * Global singleton for Prisma Client
 * Prevents multiple instances in development (hot reload)
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

/**
 * Initialize Prisma Client
 * Uses global singleton in development to avoid exhausting database connections
 */
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

/**
 * Graceful shutdown
 * Disconnect from database on process exit
 */
export async function disconnect() {
  await prisma.$disconnect();
}

// Handle process termination
if (typeof process !== 'undefined') {
  process.on('beforeExit', async () => {
    await disconnect();
  });
}
