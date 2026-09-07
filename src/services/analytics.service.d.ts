export declare const getAnalytics: () => Promise<{
    totalTasks: number;
    activeTasks: number;
    totalCompletions: number;
    tasksByPlatform: any;
    recentCompletions: ({
        task: {
            title: string;
        };
    } & {
        id: string;
        createdAt: Date;
        taskId: string;
        anonymousSessionId: string;
        ipHash: string | null;
        userAgentHash: string | null;
    })[];
    topTasks: {
        id: string;
        title: string;
        completionCount: number;
        status: import(".prisma/client").$Enums.TaskStatus;
    }[];
}>;
//# sourceMappingURL=analytics.service.d.ts.map