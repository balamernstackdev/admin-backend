import { Request, Response } from 'express';
import * as taskService from '../services/task.service';
import { AuthRequest } from '../middlewares/auth.middleware';

export const getTasks = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
    const result = await taskService.getTasks({
      page, limit,
      search: req.query.search as string,
      platform: req.query.platform as string,
      status: req.query.status as string,
      sort: req.query.sort as string,
      order: req.query.order as 'asc' | 'desc',
      adminView: false,
    });
    return res.json({ success: true, ...result });
  } catch (err: any) {
    return res.status(err.status || 500).json({ success: false, message: err.message });
  }
};

export const getAdminTasks = async (req: AuthRequest, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
    const result = await taskService.getTasks({
      page, limit,
      search: req.query.search as string,
      platform: req.query.platform as string,
      status: req.query.status as string,
      sort: req.query.sort as string,
      order: req.query.order as 'asc' | 'desc',
      adminView: true,
    });
    return res.json({ success: true, ...result });
  } catch (err: any) {
    return res.status(err.status || 500).json({ success: false, message: err.message });
  }
};

export const getTask = async (req: Request, res: Response) => {
  try {
    const task = await taskService.getTaskById(req.params.id as string);
    return res.json({ success: true, data: task });
  } catch (err: any) {
    return res.status(err.status || 500).json({ success: false, message: err.message });
  }
};

export const completeTask = async (req: Request, res: Response) => {
  try {
    const { anonymousSessionId, ipHash, userAgentHash } = req.body;
    if (!anonymousSessionId) {
      return res.status(400).json({ success: false, message: 'anonymousSessionId is required' });
    }
    await taskService.completeTask(req.params.id as string, anonymousSessionId, ipHash, userAgentHash);
    return res.json({ success: true, message: 'Task completed successfully' });
  } catch (err: any) {
    return res.status(err.status || 500).json({ success: false, message: err.message });
  }
};

export const createTask = async (req: AuthRequest, res: Response) => {
  try {
    const task = await taskService.createTask(req.body, req.user!.id);
    return res.status(201).json({ success: true, data: task });
  } catch (err: any) {
    return res.status(err.status || 500).json({ success: false, message: err.message });
  }
};

export const updateTask = async (req: AuthRequest, res: Response) => {
  try {
    const task = await taskService.updateTask(req.params.id as string, req.body);
    return res.json({ success: true, data: task });
  } catch (err: any) {
    return res.status(err.status || 500).json({ success: false, message: err.message });
  }
};

export const deleteTask = async (req: AuthRequest, res: Response) => {
  try {
    await taskService.deleteTask(req.params.id as string);
    return res.json({ success: true, message: 'Task deleted' });
  } catch (err: any) {
    return res.status(err.status || 500).json({ success: false, message: err.message });
  }
};

export const addLink = async (req: AuthRequest, res: Response) => {
  try {
    const link = await taskService.addTaskLink(req.params.id as string, req.body);
    return res.status(201).json({ success: true, data: link });
  } catch (err: any) {
    return res.status(err.status || 500).json({ success: false, message: err.message });
  }
};

export const updateLink = async (req: AuthRequest, res: Response) => {
  try {
    const link = await taskService.updateTaskLink(req.params.linkId as string, req.body);
    return res.json({ success: true, data: link });
  } catch (err: any) {
    return res.status(err.status || 500).json({ success: false, message: err.message });
  }
};

export const deleteLink = async (req: AuthRequest, res: Response) => {
  try {
    await taskService.deleteTaskLink(req.params.linkId as string);
    return res.json({ success: true, message: 'Link deleted' });
  } catch (err: any) {
    return res.status(err.status || 500).json({ success: false, message: err.message });
  }
};
