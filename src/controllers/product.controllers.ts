import type { Request, Response } from "express";
import { createProductService } from "../services/product.services.ts";


export const registerProduct = async (req : Request, res: Response) => {
    
    const product = await createProductService(req.body);

    res.status(201).json({
        status: 'ok',
        data: {
            product
        }
    })
}
