import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

import dotenv from 'dotenv';
import dotenvExpand from 'dotenv-expand';
import { z, ZodError } from 'zod';

const nodeEnvSchema = z.enum(['development', 'production', 'test']).default('development');

const currentNodeEnv = nodeEnvSchema.parse(process.env.NODE_ENV);

export const isDev = () => currentNodeEnv === 'development';

export const isProd = () => currentNodeEnv === 'production';

export const isTesting = () => currentNodeEnv === 'test';

const loadEnvFile = (fileName: string) => {
  const envPath = resolve(process.cwd(), fileName);

  if (!existsSync(envPath)) {
    return;
  }

  dotenvExpand(
    dotenv.config({
      path: envPath,
      override: true,
      quiet: true,
    }),
  );
};

if (isDev()) {
  loadEnvFile('.env');
} else if (isTesting()) {
  loadEnvFile('.env.test');
}

const envSchema = z.object({
  PORT: z.coerce.number().default(3000),
  HOST: z.string().default('127.0.0.1'),
  BCRYPT_SALT_ROUNDS: z.coerce.number().int().min(10).max(15).default(12),
  DATABASE_URL: z.string().startsWith('postgresql://'),
  API_PREFIX: z.string().refine((value) => value.startsWith('/api/v1'), {
    message: 'API_PREFIX must start with /api/v1',
  }),
  APP_STAGE: z.string().default('dev'),
  JWT_SECRET: z.string().min(30, 'The JWT secret must have at least 30 characters'),
  JWT_EXPIRES_IN: z.string().default('7d'),
  NODE_ENV: nodeEnvSchema,
});

export type Env = z.infer<typeof envSchema>;

const parseEnv = (): Env => {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof ZodError) {
      console.error('Invalid env vars');
      console.error(JSON.stringify(error.flatten().fieldErrors, null, 2));
    }

    process.exit(1);
  }
};

export const env = parseEnv();
