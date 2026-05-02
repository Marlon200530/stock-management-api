/// <reference path="../types/express.d.ts" />
import type {Request, Response, NextFunction} from 'express';
import { verifyToken } from '../utils/token.ts';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader?.split(' ')[1];

    if (!token) {
       return res.status(401).json({
            message: 'Token not provided'
        });
    }

    const payload = verifyToken(token);

    if (!payload) {
        return res.status(401).json({
            message: 'Invalid or expired token'
        });
    }

    req.user = payload;

    next();
}; 