import { prisma } from './db';

export async function createRecording(data) {
  return prisma.recording.create({ data });
}

export async function listRecordings() {
  return prisma.recording.findMany({
    orderBy: { createdAt: 'desc' },
  });
}

export async function getRecording(id: string) {
  return prisma.recording.findUnique({ where: { id } });
}
