import jwt, { type SignOptions } from 'jsonwebtoken';

import { env } from '../../env.ts';
import type { SafeUser } from './user.ts';

type AccessTokenPayload = {
  userID: string;
  email: string;
  role: SafeUser['role'];
};

export const generateAccessToken = (user: SafeUser): string => {
  const payload: AccessTokenPayload = {
    userID: user.id,
    email: user.email,
    role: user.role,
  };

  const options: SignOptions = {
    expiresIn: env.JWT_EXPIRES_IN as SignOptions['expiresIn'],
  };

  return jwt.sign(payload, env.JWT_SECRET, options);
};

export const verifyToken = (token : string) => {
  const secret = env.JWT_SECRET;
  const payload : AccessTokenPayload = jwt.verify(token, secret) as AccessTokenPayload;
  
  return payload
}

