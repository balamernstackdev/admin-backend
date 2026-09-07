import prisma from '../utils/prisma';

export const getAnalytics = async () => {
  const [
    totalTasks,
    activeTasks,
    totalCompletions,
    tasksByPlatform,
    recentCompletions,
    topTasks,
  ] = await Promise.all([
    prisma.task.count(),
    prisma.task.count({ where: { status: 'PUBLISHED' } }),
    prisma.taskCompletionEvent.count(),
    prisma.taskLink.groupBy({ by: ['platform'], _count: { id: true } }),
    prisma.taskCompletionEvent.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        task: { select: { title: true } },
      },
    }),
    prisma.task.findMany({
      take: 5,
      orderBy: { completionCount: 'desc' },
      select: { id: true, title: true, status: true, completionCount: true },
    }),
  ]);

  return {
    totalTasks,
    activeTasks,
    totalCompletions,
    tasksByPlatform: tasksByPlatform.reduce((acc: any, item) => {
      acc[item.platform] = item._count.id;
      return acc;
    }, {}),
    recentCompletions,
    topTasks,
  };
};
