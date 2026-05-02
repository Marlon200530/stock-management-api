import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.ts";
import { requireRole } from "../middlewares/requireRole.ts";
import { validateBody } from "../middlewares/validation.ts";
import { createProductSchema } from "../db/schema.ts";
import { asyncHandler } from "../utils/async-handler.ts";
import { registerProduct } from "../controllers/product.controllers.ts";



export const productRoutes =  Router();

productRoutes.use(authMiddleware, requireRole('ADMIN', 'MANAGER'));

productRoutes.post('/',validateBody(createProductSchema), asyncHandler(registerProduct));

