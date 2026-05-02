import type { DatabaseError } from 'pg';

const EMAIL_UNIQUE_CONSTRAINTS = new Set(['users_email_lower_idx']);

export type UniqueViolationError = DatabaseError & {
  code: '23505';
  constraint?: string;
  detail?: string;
};

type ErrorWithCause = {
  cause?: unknown;
};

const isErrorWithCause = (error: unknown): error is ErrorWithCause => {
  return typeof error === 'object' && error !== null && 'cause' in error;
};

export const extractDatabaseError = (error: unknown): DatabaseError | null => {
  if (typeof error !== 'object' || error === null) {
    return null;
  }

  if ('code' in error && typeof error.code === 'string') {
    return error as DatabaseError;
  }

  if (isErrorWithCause(error)) {
    return extractDatabaseError(error.cause);
  }

  return null;
};

export const isUniqueViolation = (error: unknown): error is UniqueViolationError => {
  const databaseError = extractDatabaseError(error);
  return databaseError?.code === '23505';
};

export const isNotNullViolation = (error: unknown): error is DatabaseError & { code: '23502' } => {
  const databaseError = extractDatabaseError(error);
  return databaseError?.code === '23502';
};

export const isStringDataRightTruncation = (
  error: unknown,
): error is DatabaseError & { code: '22001' } => {
  const databaseError = extractDatabaseError(error);
  return databaseError?.code === '22001';
};

export const isInvalidTextRepresentation = (
  error: unknown,
): error is DatabaseError & { code: '22P02' } => {
  const databaseError = extractDatabaseError(error);
  return databaseError?.code === '22P02';
};

export const isEmailUniqueViolation = (error: unknown): error is UniqueViolationError => {
  const databaseError = extractDatabaseError(error);

  if (!databaseError || databaseError.code !== '23505') {
    return false;
  }

  if (
    typeof databaseError.constraint === 'string' &&
    EMAIL_UNIQUE_CONSTRAINTS.has(databaseError.constraint)
  ) {
    return true;
  }

  return typeof databaseError.detail === 'string' && databaseError.detail.includes('(email)');
};
