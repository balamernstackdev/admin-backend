import { Router } from 'express';
import * as taskController from '../controllers/task.controller';

const router = Router();

// Public routes
router.get('/', taskController.getTasks);
router.get('/:id', taskController.getTask);
router.post('/:id/complete', taskController.completeTask);

export default router;
