import { db } from "../db/connection.ts";
import { products } from "../db/schema.ts";
import type { NewProduct } from "../db/schema.ts";

export const createProduct = async (product: NewProduct) => {
  const [newProduct] = await db.insert(products).values(product).returning();
  
  return newProduct;
};
