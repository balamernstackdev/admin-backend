import { Request, Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
export declare const getTasks: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getAdminTasks: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getTask: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const completeTask: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const createTask: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const updateTask: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const deleteTask: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const addLink: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const updateLink: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const deleteLink: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=task.controller.d.ts.map