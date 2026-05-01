declare module 'custom-env' {
  export function env(envName?: string, path?: string): void;
}

declare global {
  namespace Express {
    interface Request {
      user?: {
        userID: string;
        email: string;
        role: string;
      };
    }
  }
}
