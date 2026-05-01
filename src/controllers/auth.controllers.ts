import type { Request, Response } from "express";

import type { LoginUserInput, RegisterUserInput } from "../db/schema.ts";
import {
  createUserService,
  getCurrentUserService,
  loginUserService,
} from "../services/auth.services.ts";

export const registerUser = async (req: Request, res: Response) => {
  const user = await createUserService(req.body as RegisterUserInput);

  res.status(201).json({
    status: "ok",
    data: {
      user,
    },
  });
};

export const loginUser = async (req: Request, res: Response) => {
  const loginResult = await loginUserService(req.body as LoginUserInput);

  res.status(200).json({
    status: "ok",
    data: {
      user: loginResult.user,
      accessToken: loginResult.accessToken,
    },
  });
};

export const getCurrentUser = async (req: Request, res: Response) => {
  const user = await getCurrentUserService(req.user.userID);

  res.status(200).json({
    status: "ok",
    data: {
      user,
    },
  });
};
