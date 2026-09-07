import { Response } from 'express';
import * as analyticsService from '../services/analytics.service';
import { AuthRequest } from '../middlewares/auth.middleware';

export const getAnalytics = async (req: AuthRequest, res: Response) => {
  try {
    const data = await analyticsService.getAnalytics();
    return res.json({ success: true, data });
  } catch (err: any) {
    return res.status(err.status || 500).json({ success: false, message: err.message });
  }
};
