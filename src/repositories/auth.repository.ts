import { eq } from 'drizzle-orm';

import { db } from '../db/connection.ts';
import { users, type RegisterUserInput, type User } from '../db/schema.ts';

type CreateUserParams = Omit<RegisterUserInput, 'password'> & {
  passwordHash: string;
};

export const createUser = async (data: CreateUserParams): Promise<User> => {
  const [user] = await db
    .insert(users)
    .values({
      name: data.name,
      email: data.email,
      password: data.passwordHash,
      ...(data.role ? { role: data.role } : {}),
    })
    .returning();

  return user;
};

export const findUserByEmail = async (email: string): Promise<User | null> => {
  const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);

  return user ?? n ull;
};
