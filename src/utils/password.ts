import { compare, hash } from 'bcrypt';

import { env } from '../../env.ts';

export const hashPassword = async (password: string): Promise<string> => {
  return hash(password, env.BCRYPT_SALT_ROUNDS);
};

export const verifyPassword = async (password: string, storedPasswordHash: string): Promise<boolean> => {
  return compare(password, storedPasswordHash);
};
