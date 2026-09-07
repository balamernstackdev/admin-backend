"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAnalytics = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
const getAnalytics = async () => {
    const [totalTasks, activeTasks, totalCompletions, tasksByPlatform, recentCompletions, topTasks,] = await Promise.all([
        prisma_1.default.task.count(),
        prisma_1.default.task.count({ where: { status: 'PUBLISHED' } }),
        prisma_1.default.taskCompletionEvent.count(),
        prisma_1.default.taskLink.groupBy({ by: ['platform'], _count: { id: true } }),
        prisma_1.default.taskCompletionEvent.findMany({
            take: 10,
            orderBy: { createdAt: 'desc' },
            include: {
                task: { select: { title: true } },
            },
        }),
        prisma_1.default.task.findMany({
            take: 5,
            orderBy: { completionCount: 'desc' },
            select: { id: true, title: true, status: true, completionCount: true },
        }),
    ]);
    return {
        totalTasks,
        activeTasks,
        totalCompletions,
        tasksByPlatform: tasksByPlatform.reduce((acc, item) => {
            acc[item.platform] = item._count.id;
            return acc;
        }, {}),
        recentCompletions,
        topTasks,
    };
};
exports.getAnalytics = getAnalytics;
//# sourceMappingURL=analytics.service.js.map