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
export declare const getTasks: (filters: TaskFilters) => Promise<{
    data: ({
        creator: {
            id: string;
            email: string;
        };
        links: ({
            actions: {
                id: string;
                createdAt: Date;
                actionType: string;
                isRequired: boolean;
                taskLinkId: string;
            }[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            platform: string;
            url: string;
            label: string;
            sortOrder: number;
            taskId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        title: string;
        description: string;
        instructions: string;
        thumbnailUrl: string | null;
        completionCount: number;
        status: import(".prisma/client").$Enums.TaskStatus;
        startAt: Date | null;
        endAt: Date | null;
        createdBy: string;
    })[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}>;
export declare const getTaskById: (id: string) => Promise<{
    creator: {
        id: string;
        email: string;
    };
    links: ({
        actions: {
            id: string;
            createdAt: Date;
            actionType: string;
            isRequired: boolean;
            taskLinkId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        platform: string;
        url: string;
        label: string;
        sortOrder: number;
        taskId: string;
    })[];
} & {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    slug: string;
    title: string;
    description: string;
    instructions: string;
    thumbnailUrl: string | null;
    completionCount: number;
    status: import(".prisma/client").$Enums.TaskStatus;
    startAt: Date | null;
    endAt: Date | null;
    createdBy: string;
}>;
export declare const completeTask: (taskId: string, anonymousSessionId: string, ipHash?: string, userAgentHash?: string) => Promise<{
    success: boolean;
}>;
export declare const createTask: (data: any, createdBy: string) => Promise<{
    links: ({
        actions: {
            id: string;
            createdAt: Date;
            actionType: string;
            isRequired: boolean;
            taskLinkId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        platform: string;
        url: string;
        label: string;
        sortOrder: number;
        taskId: string;
    })[];
} & {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    slug: string;
    title: string;
    description: string;
    instructions: string;
    thumbnailUrl: string | null;
    completionCount: number;
    status: import(".prisma/client").$Enums.TaskStatus;
    startAt: Date | null;
    endAt: Date | null;
    createdBy: string;
}>;
export declare const updateTask: (id: string, data: any) => Promise<{
    links: ({
        actions: {
            id: string;
            createdAt: Date;
            actionType: string;
            isRequired: boolean;
            taskLinkId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        platform: string;
        url: string;
        label: string;
        sortOrder: number;
        taskId: string;
    })[];
} & {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    slug: string;
    title: string;
    description: string;
    instructions: string;
    thumbnailUrl: string | null;
    completionCount: number;
    status: import(".prisma/client").$Enums.TaskStatus;
    startAt: Date | null;
    endAt: Date | null;
    createdBy: string;
}>;
export declare const deleteTask: (id: string) => Promise<void>;
export declare const addTaskLink: (taskId: string, linkData: any) => Promise<{
    actions: {
        id: string;
        createdAt: Date;
        actionType: string;
        isRequired: boolean;
        taskLinkId: string;
    }[];
} & {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    description: string | null;
    platform: string;
    url: string;
    label: string;
    sortOrder: number;
    taskId: string;
}>;
export declare const updateTaskLink: (linkId: string, linkData: any) => Promise<{
    actions: {
        id: string;
        createdAt: Date;
        actionType: string;
        isRequired: boolean;
        taskLinkId: string;
    }[];
} & {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    description: string | null;
    platform: string;
    url: string;
    label: string;
    sortOrder: number;
    taskId: string;
}>;
export declare const deleteTaskLink: (linkId: string) => Promise<void>;
export {};
//# sourceMappingURL=task.service.d.ts.map