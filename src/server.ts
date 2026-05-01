import app from './app.ts';

import { env } from '../env.ts';
import { verifyToken } from './utils/token.ts';

app.listen(env.PORT, env.HOST, () => {
  const baseUrl = `http://${env.HOST}:${env.PORT}${env.API_PREFIX}`;
  console.log(`Server is running at: ${baseUrl}`);
});

