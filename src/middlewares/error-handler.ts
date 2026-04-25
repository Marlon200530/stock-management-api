import type { NextFunction, Request, Response } from 'express';

import { env } from '../../env.ts';
import { AppError } from '../errors/app-error.ts';

export const errorHandler = (
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      status: 'error',
      message: error.message,
      ...(error.details !== undefined ? { details: error.details } : {}),
    });

    return;
  }

  console.error(error);

  res.status(500).json({
    status: 'error',
    message: 'Internal server error',
    ...(env.NODE_ENV !== 'production' ? { details: 'Check server logs for the original error.' } : {}),
  });
};
