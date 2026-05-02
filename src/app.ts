import express from 'express';
import type { Request, Response } from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';

import { env } from '../env.ts';
import { errorHandler } from './middlewares/error-handler.ts';
import { authRouter } from './routes/auth.routes.ts';
import { productRoutes } from './routes/product.routes.ts';

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: '*',
  }),
);
app.use(express.json());
app.use(morgan('dev'));

app.get(`${env.API_PREFIX}/health`, (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'OK',
    service: 'STOCK MANAGEMENT API',
    timestamp: Date.now().toString(),
  });
});

app.use(`${env.API_PREFIX}/auth`, authRouter);
app.use(`${env.API_PREFIX}/products`, productRoutes);

app.use(errorHandler);

export default app;
