import { Router } from 'express';
import * as authController from '../controllers/auth.controller';
import { validate } from '../middlewares/validate.middleware';
import { loginSchema } from '../validators';

const router = Router();

router.post('/login', validate(loginSchema), authController.login);

export default router;
