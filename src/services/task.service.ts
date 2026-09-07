import prisma from '../utils/prisma';
import { Prisma } from '@prisma/client';
import crypto from 'crypto';

interface TaskFilters {
  page: number;
  limit: number;
  search?: string;
  platform?: string;
  status?: string;
  sort?: string;
  order?: 'asc' | 'desc';
  adminView?: boolean;
}

export const getTasks = async (filters: TaskFilters) => {
  const { page, limit, search, platform, status, sort = 'createdAt', order = 'desc', adminView = false } = filters;
  const skip = (page - 1) * limit;

  const now = new Date();
  const where: Prisma.TaskWhereInput = {};

  if (!adminView) {
    where.status = 'PUBLISHED';
    where.OR = [{ startAt: null }, { startAt: { lte: now } }];
    where.AND = [{ OR: [{ endAt: null }, { endAt: { gte: now } }] }];
  } else if (status) {
    where.status = status as any;
  }

  if (search) {
    where.OR = [
      { title: { contains: search } },
      { description: { contains: search } },
    ];
  }

  if (platform) {
    where.links = { some: { platform } };
  }

  const [tasks, total] = await Promise.all([
    prisma.task.findMany({
      where,
      skip,
      take: limit,
      orderBy: { [sort]: order },
      include: {
        links: { include: { actions: true }, orderBy: { sortOrder: 'asc' } },
        creator: { select: { id: true, email: true } },
      },
    }),
    prisma.task.count({ where }),
  ]);

  return {
    data: tasks,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
};

export const getTaskById = async (id: string) => {
  const task = await prisma.task.findUnique({
    where: { id },
    include: {
      links: { include: { actions: true }, orderBy: { sortOrder: 'asc' } },
      creator: { select: { id: true, email: true } },
    },
  });
  if (!task) throw Object.assign(new Error('Task not found'), { status: 404 });
  return task;
};

export const completeTask = async (taskId: string, anonymousSessionId: string, ipHash?: string, userAgentHash?: string) => {
  const task = await prisma.task.findUnique({ where: { id: taskId } });
  if (!task) throw Object.assign(new Error('Task not found'), { status: 404 });
  if (task.status !== 'PUBLISHED') throw Object.assign(new Error('Task is not available'), { status: 400 });

  try {
    await prisma.$transaction(async (tx) => {
      // Create completion event, will throw if duplicate [taskId, anonymousSessionId]
      await tx.taskCompletionEvent.create({
        data: {
          taskId,
          anonymousSessionId,
          ipHash: ipHash || null,
          userAgentHash: userAgentHash || null,
        },
      });

      // Increment task completion count
      await tx.task.update({
        where: { id: taskId },
        data: { completionCount: { increment: 1 } },
      });
    });
    return { success: true };
  } catch (err: any) {
    if (err.code === 'P2002') {
      // Unique constraint failed, already completed by this session
      throw Object.assign(new Error('You have already completed this task'), { status: 409 });
    }
    throw err;
  }
};

export const createTask = async (data: any, createdBy: string) => {
  const { links, ...taskData } = data;
  const slug = taskData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now();

  const task = await prisma.task.create({
    data: {
      ...taskData,
      slug,
      createdBy,
      startAt: taskData.startAt ? new Date(taskData.startAt) : null,
      endAt: taskData.endAt ? new Date(taskData.endAt) : null,
      links: links ? {
        create: links.map((link: any) => ({
          platform: link.platform,
          url: link.url,
          label: link.label,
          description: link.description,
          sortOrder: link.sortOrder || 0,
          actions: link.actions ? { create: link.actions } : undefined,
        })),
      } : undefined,
    },
    include: { links: { include: { actions: true } } },
  });
  return task;
};

export const updateTask = async (id: string, data: any) => {
  const { links, ...taskData } = data;
  const task = await prisma.task.update({
    where: { id },
    data: {
      ...taskData,
      startAt: taskData.startAt ? new Date(taskData.startAt) : undefined,
      endAt: taskData.endAt ? new Date(taskData.endAt) : undefined,
    },
    include: { links: { include: { actions: true } } },
  });
  return task;
};

export const deleteTask = async (id: string) => {
  await prisma.task.delete({ where: { id } });
};
