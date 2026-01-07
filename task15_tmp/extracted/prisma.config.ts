/**
 * Prisma 7 Configuration
 * TASK15 - Database Integration
 * DashkaRecord v2.0.0-alpha
 */

import { defineConfig } from '@prisma/client';

export default defineConfig({
  adapter: {
    provider: 'postgresql',
    url: process.env.DATABASE_URL,
  },
});
