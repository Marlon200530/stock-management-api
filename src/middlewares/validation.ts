import type { Request, Response, NextFunction } from 'express';
import { ZodError, type ZodType } from 'zod';

export const validateBody = (schema: ZodType) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedData = schema.parse(req.body);
      req.body = validatedData;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          status: 'error',
          message: 'Invalid request body',
          details: error.issues.map((issue) => ({
            field: issue.path.join('.'),
            message: issue.message,
          })),
        });

        return;
      }

      next(error);
    }
  };
};
