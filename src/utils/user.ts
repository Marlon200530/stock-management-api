import type { User } from '../db/schema.ts';

type UserWithOptionalPasswordHash = User & {
  passwordHash?: string;
};

export type SafeUser = Omit<UserWithOptionalPasswordHash, 'password' | 'passwordHash'>;

export const sanitizeUser = (user: UserWithOptionalPasswordHash): SafeUser => {
  const { password: _password, passwordHash: _passwordHash, ...safeUser } = user;
  return safeUser;
};
