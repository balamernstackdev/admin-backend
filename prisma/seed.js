"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('🌱 Seeding database...');
    // --- Admins ---
    const adminHash = await bcrypt_1.default.hash('admin123', 10);
    const admin = await prisma.admin.upsert({
        where: { email: 'admin@example.com' },
        update: {},
        create: { email: 'admin@example.com', passwordHash: adminHash },
    });
    // --- Tasks ---
    // Task 1: Instagram Like
    await prisma.task.upsert({
        where: { slug: 'instagram-like-task' },
        update: {},
        create: {
            title: 'Instagram Like Task',
            slug: 'instagram-like-task',
            description: 'Help us boost engagement on our latest Instagram post by liking and following our account.',
            instructions: '1. Open the Instagram link below.\n2. Like the post.\n3. Follow the account.\n4. Return here and mark as completed.',
            status: 'PUBLISHED',
            createdBy: admin.id,
            links: {
                create: [{
                        platform: 'instagram', url: 'https://instagram.com/explore', label: 'Like our latest post',
                        description: 'Open and like this post', sortOrder: 1,
                        actions: { create: [{ actionType: 'like', isRequired: true }, { actionType: 'follow', isRequired: true }] },
                    }],
            },
        },
    });
    // Task 2: YouTube Subscribe
    await prisma.task.upsert({
        where: { slug: 'youtube-subscribe-task' },
        update: {},
        create: {
            title: 'YouTube Subscribe Task',
            slug: 'youtube-subscribe-task',
            description: 'Subscribe to our YouTube channel and watch our latest video to earn points.',
            instructions: '1. Open the YouTube link.\n2. Subscribe to the channel.\n3. Watch at least 1 minute of the video.\n4. Return here and mark as completed.',
            status: 'PUBLISHED',
            createdBy: admin.id,
            links: {
                create: [{
                        platform: 'youtube', url: 'https://youtube.com', label: 'Subscribe to our channel',
                        description: 'Subscribe and watch', sortOrder: 1,
                        actions: { create: [{ actionType: 'subscribe', isRequired: true }, { actionType: 'watch', isRequired: true }] },
                    }],
            },
        },
    });
    // Task 3: Facebook Share
    await prisma.task.upsert({
        where: { slug: 'facebook-share-task' },
        update: {},
        create: {
            title: 'Facebook Share Task',
            slug: 'facebook-share-task',
            description: 'Share our Facebook post with your friends to help us reach more people.',
            instructions: '1. Open the Facebook link.\n2. Click Share on the post.\n3. Share to your timeline.\n4. Return here and mark as completed.',
            status: 'PUBLISHED',
            createdBy: admin.id,
            links: {
                create: [{
                        platform: 'facebook', url: 'https://facebook.com', label: 'Share our post',
                        description: 'Share this post on your timeline', sortOrder: 1,
                        actions: { create: [{ actionType: 'share', isRequired: true }] },
                    }],
            },
        },
    });
    // Task 4: X Repost
    await prisma.task.upsert({
        where: { slug: 'x-repost-task' },
        update: {},
        create: {
            title: 'X (Twitter) Repost Task',
            slug: 'x-repost-task',
            description: 'Repost our tweet on X to help us grow our audience.',
            instructions: '1. Open the X link.\n2. Repost the tweet.\n3. Follow our account.\n4. Return here and mark as completed.',
            status: 'PUBLISHED',
            createdBy: admin.id,
            links: {
                create: [{
                        platform: 'x', url: 'https://x.com', label: 'Repost our tweet',
                        description: 'Repost and follow', sortOrder: 1,
                        actions: { create: [{ actionType: 'repost', isRequired: true }, { actionType: 'follow', isRequired: false }] },
                    }],
            },
        },
    });
    // Task 5: Multi-link Social Campaign
    await prisma.task.upsert({
        where: { slug: 'multi-link-social-campaign' },
        update: {},
        create: {
            title: 'Multi-Platform Social Campaign',
            slug: 'multi-link-social-campaign',
            description: 'Engage with our brand across Instagram, YouTube, and Facebook to earn maximum points.',
            instructions: 'Complete all the following actions across all platforms:\n1. Open each social media link below.\n2. Complete the required action for each platform.\n3. Return here and mark as completed.\n\nNote: All actions must be completed to receive full reward.',
            status: 'PUBLISHED',
            createdBy: admin.id,
            links: {
                create: [
                    {
                        platform: 'instagram', url: 'https://instagram.com/explore',
                        label: 'Like our Instagram post', description: 'Like and follow on Instagram', sortOrder: 1,
                        actions: { create: [{ actionType: 'like', isRequired: true }, { actionType: 'follow', isRequired: true }] },
                    },
                    {
                        platform: 'youtube', url: 'https://youtube.com',
                        label: 'Subscribe on YouTube', description: 'Subscribe to our YouTube channel', sortOrder: 2,
                        actions: { create: [{ actionType: 'subscribe', isRequired: true }] },
                    },
                    {
                        platform: 'facebook', url: 'https://facebook.com',
                        label: 'Share on Facebook', description: 'Share our Facebook post', sortOrder: 3,
                        actions: { create: [{ actionType: 'share', isRequired: true }] },
                    },
                    {
                        platform: 'x', url: 'https://x.com',
                        label: 'Repost on X', description: 'Repost our tweet on X', sortOrder: 4,
                        actions: { create: [{ actionType: 'repost', isRequired: false }] },
                    },
                ],
            },
        },
    });
    console.log('✅ Database seeded successfully!');
    console.log('');
    console.log('⚠️  SEED CREDENTIALS (Change in production!)');
    console.log('   Admin: admin@example.com / admin123');
}
main()
    .catch((e) => { console.error(e); process.exit(1); })
    .finally(async () => { await prisma.$disconnect(); });
//hjvjhvjvh
//# sourceMappingURL=seed.js.map