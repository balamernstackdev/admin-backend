import { z } from 'zod';
export declare const loginSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, z.core.$strip>;
export declare const taskLinkSchema: z.ZodObject<{
    platform: z.ZodEnum<{
        instagram: "instagram";
        youtube: "youtube";
        facebook: "facebook";
        x: "x";
        custom: "custom";
    }>;
    url: z.ZodString;
    label: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    sortOrder: z.ZodDefault<z.ZodNumber>;
    actions: z.ZodOptional<z.ZodArray<z.ZodObject<{
        actionType: z.ZodString;
        isRequired: z.ZodDefault<z.ZodBoolean>;
    }, z.core.$strip>>>;
}, z.core.$strip>;
export declare const createTaskSchema: z.ZodObject<{
    title: z.ZodString;
    description: z.ZodString;
    instructions: z.ZodString;
    thumbnailUrl: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
    status: z.ZodDefault<z.ZodEnum<{
        DRAFT: "DRAFT";
        PUBLISHED: "PUBLISHED";
        PAUSED: "PAUSED";
        EXPIRED: "EXPIRED";
        ARCHIVED: "ARCHIVED";
    }>>;
    startAt: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    endAt: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    links: z.ZodOptional<z.ZodArray<z.ZodObject<{
        platform: z.ZodEnum<{
            instagram: "instagram";
            youtube: "youtube";
            facebook: "facebook";
            x: "x";
            custom: "custom";
        }>;
        url: z.ZodString;
        label: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        sortOrder: z.ZodDefault<z.ZodNumber>;
        actions: z.ZodOptional<z.ZodArray<z.ZodObject<{
            actionType: z.ZodString;
            isRequired: z.ZodDefault<z.ZodBoolean>;
        }, z.core.$strip>>>;
    }, z.core.$strip>>>;
}, z.core.$strip>;
export declare const updateTaskSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    instructions: z.ZodOptional<z.ZodString>;
    thumbnailUrl: z.ZodOptional<z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>>;
    status: z.ZodOptional<z.ZodDefault<z.ZodEnum<{
        DRAFT: "DRAFT";
        PUBLISHED: "PUBLISHED";
        PAUSED: "PAUSED";
        EXPIRED: "EXPIRED";
        ARCHIVED: "ARCHIVED";
    }>>>;
    startAt: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
    endAt: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
    links: z.ZodOptional<z.ZodOptional<z.ZodArray<z.ZodObject<{
        platform: z.ZodEnum<{
            instagram: "instagram";
            youtube: "youtube";
            facebook: "facebook";
            x: "x";
            custom: "custom";
        }>;
        url: z.ZodString;
        label: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        sortOrder: z.ZodDefault<z.ZodNumber>;
        actions: z.ZodOptional<z.ZodArray<z.ZodObject<{
            actionType: z.ZodString;
            isRequired: z.ZodDefault<z.ZodBoolean>;
        }, z.core.$strip>>>;
    }, z.core.$strip>>>>;
}, z.core.$strip>;
//# sourceMappingURL=index.d.ts.map