"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTaskLink = exports.updateTaskLink = exports.addTaskLink = exports.deleteTask = exports.updateTask = exports.createTask = exports.completeTask = exports.getTaskById = exports.getTasks = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
const getTasks = async (filters) => {
    const { page, limit, search, platform, status, sort = 'createdAt', order = 'desc', adminView = false } = filters;
    const skip = (page - 1) * limit;
    const now = new Date();
    const where = {};
    if (!adminView) {
        where.status = 'PUBLISHED';
        where.OR = [{ startAt: null }, { startAt: { lte: now } }];
        where.AND = [{ OR: [{ endAt: null }, { endAt: { gte: now } }] }];
    }
    else if (status) {
        where.status = status;
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
        prisma_1.default.task.findMany({
            where,
            skip,
            take: limit,
            orderBy: { [sort]: order },
            include: {
                links: { include: { actions: true }, orderBy: { sortOrder: 'asc' } },
                creator: { select: { id: true, email: true } },
            },
        }),
        prisma_1.default.task.count({ where }),
    ]);
    return {
        data: tasks,
        pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
};
exports.getTasks = getTasks;
const getTaskById = async (id) => {
    const task = await prisma_1.default.task.findUnique({
        where: { id },
        include: {
            links: { include: { actions: true }, orderBy: { sortOrder: 'asc' } },
            creator: { select: { id: true, email: true } },
        },
    });
    if (!task)
        throw Object.assign(new Error('Task not found'), { status: 404 });
    return task;
};
exports.getTaskById = getTaskById;
const completeTask = async (taskId, anonymousSessionId, ipHash, userAgentHash) => {
    const task = await prisma_1.default.task.findUnique({ where: { id: taskId } });
    if (!task)
        throw Object.assign(new Error('Task not found'), { status: 404 });
    if (task.status !== 'PUBLISHED')
        throw Object.assign(new Error('Task is not available'), { status: 400 });
    try {
        await prisma_1.default.$transaction(async (tx) => {
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
    }
    catch (err) {
        if (err.code === 'P2002') {
            // Unique constraint failed, already completed by this session
            throw Object.assign(new Error('You have already completed this task'), { status: 409 });
        }
        throw err;
    }
};
exports.completeTask = completeTask;
const createTask = async (data, createdBy) => {
    const { links, ...taskData } = data;
    const slug = taskData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now();
    const task = await prisma_1.default.task.create({
        data: {
            ...taskData,
            slug,
            createdBy,
            startAt: taskData.startAt ? new Date(taskData.startAt) : null,
            endAt: taskData.endAt ? new Date(taskData.endAt) : null,
            links: links ? {
                create: links.map((link) => ({
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
exports.createTask = createTask;
const updateTask = async (id, data) => {
    const { links, ...taskData } = data;
    const task = await prisma_1.default.task.update({
        where: { id },
        data: {
            ...taskData,
            startAt: taskData.startAt ? new Date(taskData.startAt) : undefined,
            endAt: taskData.endAt ? new Date(taskData.endAt) : undefined,
            links: links ? {
                deleteMany: {},
                create: links.map((link) => ({
                    platform: link.platform,
                    url: link.url,
                    label: link.label,
                    description: link.description,
                    sortOrder: link.sortOrder || 0,
                    actions: link.actions ? {
                        create: link.actions.map((action) => ({
                            actionType: action.actionType,
                            isRequired: action.isRequired !== undefined ? action.isRequired : true,
                        }))
                    } : undefined,
                })),
            } : undefined,
        },
        include: { links: { include: { actions: true } } },
    });
    return task;
};
exports.updateTask = updateTask;
const deleteTask = async (id) => {
    await prisma_1.default.task.delete({ where: { id } });
};
exports.deleteTask = deleteTask;
const addTaskLink = async (taskId, linkData) => {
    const data = {
        taskId,
        platform: linkData.platform,
        url: linkData.url,
        label: linkData.label,
        description: linkData.description,
        sortOrder: linkData.sortOrder || 0,
    };
    if (linkData.actions)
        data.actions = { create: linkData.actions };
    return prisma_1.default.taskLink.create({
        data,
        include: { actions: true },
    });
};
exports.addTaskLink = addTaskLink;
const updateTaskLink = async (linkId, linkData) => {
    return prisma_1.default.taskLink.update({
        where: { id: linkId },
        data: {
            platform: linkData.platform,
            url: linkData.url,
            label: linkData.label,
            description: linkData.description,
            sortOrder: linkData.sortOrder,
        },
        include: { actions: true },
    });
};
exports.updateTaskLink = updateTaskLink;
const deleteTaskLink = async (linkId) => {
    await prisma_1.default.taskLink.delete({ where: { id: linkId } });
};
exports.deleteTaskLink = deleteTaskLink;
//# sourceMappingURL=task.service.js.map