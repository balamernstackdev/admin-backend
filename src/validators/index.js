"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTaskSchema = exports.createTaskSchema = exports.taskLinkSchema = exports.loginSchema = void 0;
const zod_1 = require("zod");
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(1),
});
const ALLOWED_PLATFORMS = {
    instagram: ['instagram.com'],
    youtube: ['youtube.com', 'youtu.be'],
    facebook: ['facebook.com'],
    x: ['x.com', 'twitter.com'],
    custom: [],
};
const urlValidator = (platform) => zod_1.z.string().url().refine(val => {
    try {
        const url = new URL(val);
        if (url.protocol !== 'https:')
            return false;
        if (platform === 'custom')
            return true;
        const allowed = ALLOWED_PLATFORMS[platform] || [];
        return allowed.some(d => url.hostname === d || url.hostname.endsWith('.' + d));
    }
    catch {
        return false;
    }
}, { message: 'Invalid or disallowed URL for selected platform' });
exports.taskLinkSchema = zod_1.z.object({
    platform: zod_1.z.enum(['instagram', 'youtube', 'facebook', 'x', 'custom']),
    url: zod_1.z.string(),
    label: zod_1.z.string().min(1).max(200),
    description: zod_1.z.string().optional(),
    sortOrder: zod_1.z.number().int().default(0),
    actions: zod_1.z.array(zod_1.z.object({
        actionType: zod_1.z.string().min(1),
        isRequired: zod_1.z.boolean().default(true),
    })).optional(),
}).superRefine((data, ctx) => {
    const result = urlValidator(data.platform).safeParse(data.url);
    if (!result.success) {
        ctx.addIssue({ code: zod_1.z.ZodIssueCode.custom, message: 'Invalid or disallowed URL for selected platform', path: ['url'] });
    }
});
exports.createTaskSchema = zod_1.z.object({
    title: zod_1.z.string().min(3).max(200),
    description: zod_1.z.string().min(10),
    instructions: zod_1.z.string().min(10),
    thumbnailUrl: zod_1.z.string().url().optional().or(zod_1.z.literal('')),
    status: zod_1.z.enum(['DRAFT', 'PUBLISHED', 'PAUSED', 'EXPIRED', 'ARCHIVED']).default('DRAFT'),
    startAt: zod_1.z.string().datetime().optional().nullable(),
    endAt: zod_1.z.string().datetime().optional().nullable(),
    links: zod_1.z.array(exports.taskLinkSchema).optional(),
});
exports.updateTaskSchema = exports.createTaskSchema.partial();
//# sourceMappingURL=index.js.map