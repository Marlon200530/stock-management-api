/// <reference path="../types/express.d.ts" />
import type { Request, Response, NextFunction } from "express";

type UserRoles = 'ADMIN' | 'MANAGER' | 'STAFF'

export const requireRole = (...allowedRoles : UserRoles[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const user= req.user;

        if (!user) {
            return res.status(401).json({
                message:  'Unauthorized'
            })
        }

        if (!allowedRoles.includes(user.role)) {
            return res.status(403).json({
                message: 'Forbidden'
            });
        }

        next();
    }
}
