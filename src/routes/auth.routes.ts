import { Router } from 'express';

import { loginUser, registerUser } from '../controllers/auth.controllers.ts';
import { loginUserSchema, registerUserSchema } from '../db/schema.ts';
import { validateBody } from '../middlewares/validation.ts';
import { asyncHandler } from '../utils/async-handler.ts';

export const authRouter = Router();

authRouter.post('/register', validateBody(registerUserSchema), asyncHandler(registerUser));
authRouter.post('/login', validateBody(loginUserSchema), asyncHandler(loginUser));
// authRouter.post('/refresh-token');
// authRouter.post('/logout');
// authRouter.get('/me');
