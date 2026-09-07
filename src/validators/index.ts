import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const ALLOWED_PLATFORMS: Record<string, string[]> = {
  instagram: ['instagram.com'],
  youtube: ['youtube.com', 'youtu.be'],
  facebook: ['facebook.com'],
  x: ['x.com', 'twitter.com'],
  custom: [],
};

const urlValidator = (platform: string) => z.string().url().refine(val => {
  try {
    const url = new URL(val);
    if (url.protocol !== 'https:') return false;
    if (platform === 'custom') return true;
    const allowed = ALLOWED_PLATFORMS[platform] || [];
    return allowed.some(d => url.hostname === d || url.hostname.endsWith('.' + d));
  } catch { return false; }
}, { message: 'Invalid or disallowed URL for selected platform' });

export const taskLinkSchema = z.object({
  platform: z.enum(['instagram', 'youtube', 'facebook', 'x', 'custom']),
  url: z.string(),
  label: z.string().min(1).max(200),
  description: z.string().optional(),
  sortOrder: z.number().int().default(0),
  actions: z.array(z.object({
    actionType: z.string().min(1),
    isRequired: z.boolean().default(true),
  })).optional(),
}).superRefine((data, ctx) => {
  const result = urlValidator(data.platform).safeParse(data.url);
  if (!result.success) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Invalid or disallowed URL for selected platform', path: ['url'] });
  }
});

export const createTaskSchema = z.object({
  title: z.string().min(3).max(200),
  description: z.string().min(10),
  instructions: z.string().min(10),
  thumbnailUrl: z.string().url().optional().or(z.literal('')),
  status: z.enum(['DRAFT', 'PUBLISHED', 'PAUSED', 'EXPIRED', 'ARCHIVED']).default('DRAFT'),
  startAt: z.string().datetime().optional().nullable(),
  endAt: z.string().datetime().optional().nullable(),
  links: z.array(taskLinkSchema).optional(),
});

export const updateTaskSchema = createTaskSchema.partial();
