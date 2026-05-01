import type { LoginUserInput, RegisterUserInput, UserInfo } from '../db/schema.ts';
import { AppError } from '../errors/app-error.ts';
import { createUser, findUserByEmail, findUserById } from '../repositories/auth.repository.ts';
import { hashPassword, verifyPassword } from '../utils/password.ts';
import { isEmailUniqueViolation } from '../utils/postgres-errors.ts';
import { generateAccessToken } from '../utils/token.ts';
import { sanitizeUser, type SafeUser } from '../utils/user.ts';

export class EmailAlreadyInUseError extends AppError {
  constructor() {
    super('Email already in use', 409);
    this.name = 'EmailAlreadyInUseError';
  }
}

export class InvalidCredentialsError extends AppError {
  constructor() {
    super('Invalid credentials', 401);
    this.name = 'InvalidCredentialsError';
  }
}

export class InvalidUserError extends AppError {
  constructor() {
    super('Invalid User', 404);
    this.name = "InvalidUserError";
  }
}

export type LoginResult = {
  user: SafeUser;
  accessToken: string;
};

export const createUserService = async (user: RegisterUserInput): Promise<SafeUser> => {
  const passwordHash = await hashPassword(user.password);

  try {
    const createdUser = await createUser({
      name: user.name,
      email: user.email,
      role: user.role,
      passwordHash,
    });

    return sanitizeUser(createdUser);
  } catch (error) {
    if (isEmailUniqueViolation(error)) {
      throw new EmailAlreadyInUseError();
    }

    throw error;
  }
};

export const loginUserService = async (data: LoginUserInput): Promise<LoginResult> => {
  const user = await findUserByEmail(data.email);

  if (!user) {
    throw new InvalidCredentialsError();
  }

  const passwordMatches = await verifyPassword(data.password, user.password);

  if (!passwordMatches) {
    throw new InvalidCredentialsError();
  }

  if (!user.isActive) {
    throw new AppError('User account is inactive', 403);
  }

  const safeUser = sanitizeUser(user);

  return {
    user: safeUser,
    accessToken: generateAccessToken(safeUser),
  };
};


export const getCurrentUserService = async (userID : string) : Promise<SafeUser> => {
  const user = await findUserById(userID);

  if (!user) {
    throw new InvalidUserError();
  }

  const {password: _password, ...safeUser} = user;


  return safeUser;
}