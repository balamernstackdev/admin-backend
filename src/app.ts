import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.routes';
import taskRoutes from './routes/task.routes';
import adminRoutes from './routes/admin.routes';

dotenv.config();

const app: Express = express();

// Security Middlewares
app.use(helmet());
app.use(cors({
  origin: (process.env.CORS_ORIGIN || 'http://localhost:5173,https://admin-frontend-bay-rho.vercel.app').split(','),
  credentials: true,
}));

// Rate Limiting
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 200, standardHeaders: true, legacyHeaders: false });
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 20, standardHeaders: true, legacyHeaders: false });

app.use(limiter);
app.use(express.json({ limit: '10mb' }));
app.use(morgan('dev'));

import prisma from './utils/prisma';

// Health Checks & Root
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({ success: true, message: 'TaskHub API is running smoothly 🚀', timestamp: new Date().toISOString() });
});

app.get(['/health', '/api/health'], async (req: Request, res: Response) => {
  try {
    // Ping the database to verify connection
    await prisma.$queryRaw`SELECT 1`;
    res.status(200).json({ 
      success: true, 
      status: 'UP', 
      database: 'CONNECTED',
      timestamp: new Date().toISOString() 
    });
  } catch (error) {
    res.status(503).json({ 
      success: false, 
      status: 'DOWN', 
      database: 'DISCONNECTED', 
      timestamp: new Date().toISOString() 
    });
  }
});

// Routes
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/admin', adminRoutes);

// 404 Handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ success: false, message: 'Route not found', code: 'NOT_FOUND' });
});

// Global Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('[ERROR]', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    code: err.code || 'INTERNAL_ERROR',
    ...(process.env.NODE_ENV !== 'production' ? { stack: err.stack } : {}),
  });
});

export default app;
