declare global {
  namespace Express {
    interface User {
      userID: string;
      email: string;
      role: "ADMIN" | "MANAGER" | "STAFF";
    }

    interface Request {
      user?: User;
    }
  }
}

export {};