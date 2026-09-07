import { Request, Response } from 'express';
import * as authService from '../services/auth.service';

export const login = async (req: Request, res: Response) => {
  try {
    const result = await authService.login(req.body.email, req.body.password);
    return res.status(200).json({ success: true, data: result });
  } catch (err: any) {
    return res.status(err.status || 500).json({ success: false, message: err.message });
  }
};
