import { Router } from 'express';
import * as taskController from '../controllers/task.controller';
import * as adminController from '../controllers/admin.controller';
import { authenticate, requireAdmin } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { createTaskSchema, updateTaskSchema, taskLinkSchema } from '../validators';

const router = Router();

// All admin routes require auth + admin role
router.use(authenticate, requireAdmin);

// Analytics
router.get('/analytics', adminController.getAnalytics);

// Task Management
router.get('/tasks', taskController.getAdminTasks);
router.post('/tasks', validate(createTaskSchema), taskController.createTask);
router.get('/tasks/:id', taskController.getTask);
router.put('/tasks/:id', validate(updateTaskSchema), taskController.updateTask);
router.delete('/tasks/:id', taskController.deleteTask);

// Task Links
router.post('/tasks/:id/links', validate(taskLinkSchema), taskController.addLink);
router.put('/tasks/:id/links/:linkId', taskController.updateLink);
router.delete('/tasks/:id/links/:linkId', taskController.deleteLink);

export default router;
