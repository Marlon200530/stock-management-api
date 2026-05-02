import type { NewProduct } from "../db/schema.ts";
import { AppError } from "../errors/app-error.ts";
import { createProduct } from "../repositories/product.repositories.ts";
import {
    extractDatabaseError,
    isInvalidTextRepresentation,
    isNotNullViolation,
    isStringDataRightTruncation,
} from "../utils/postgres-errors.ts";

const PRODUCT_REQUIRED_COLUMNS = new Map([
    ["name", "name"],
    ["status", "status"],
]);

const PRODUCT_MAX_LENGTH_BY_COLUMN = new Map([
    ["name", 150],
    ["category", 100],
]);

const PRODUCT_STATUS_VALUES = ["ACTIVE", "INACTIVE"] as const;

export class InvalidProductError extends AppError {
    constructor(message = "Invalid product data", details?: unknown) {
        super(message, 400, details);
        this.name = "InvalidProductError";
    }
}

const getColumn = (error: unknown) => extractDatabaseError(error)?.column;

const getTruncatedColumn = (error: unknown) => {
    const column = getColumn(error);

    if (column && PRODUCT_MAX_LENGTH_BY_COLUMN.has(column)) {
        return column;
    }

    const message = extractDatabaseError(error)?.message ?? "";

    for (const [productColumn, maxLength] of PRODUCT_MAX_LENGTH_BY_COLUMN) {
        if (message.includes(`character varying(${maxLength})`)) {
            return productColumn;
        }
    }

    return null;
};

const handleCreateProductDatabaseError = (error: unknown): never => {
    if (isNotNullViolation(error)) {
        const column = getColumn(error);

        if (column && PRODUCT_REQUIRED_COLUMNS.has(column)) {
            throw new InvalidProductError("Invalid product data", {
                field: PRODUCT_REQUIRED_COLUMNS.get(column),
                message: `${PRODUCT_REQUIRED_COLUMNS.get(column)} is required`,
            });
        }
    }

    if (isStringDataRightTruncation(error)) {
        const column = getTruncatedColumn(error);

        if (column) {
            throw new InvalidProductError("Invalid product data", {
                field: column,
                message: `${column} must have at most ${PRODUCT_MAX_LENGTH_BY_COLUMN.get(column)} characters`,
            });
        }

        throw new InvalidProductError("Invalid product data", {
            message: "name must have at most 150 characters and category must have at most 100 characters",
        });
    }

    if (isInvalidTextRepresentation(error)) {
        const message = extractDatabaseError(error)?.message ?? "";

        if (message.includes("product_status")) {
            throw new InvalidProductError("Invalid product data", {
                field: "status",
                message: `status must be one of: ${PRODUCT_STATUS_VALUES.join(", ")}`,
            });
        }
    }

    throw error;
};

export const createProductService = async (product: NewProduct) => {
    try {
        const newProduct = await createProduct(product);

        return newProduct;
    } catch (error) {
        handleCreateProductDatabaseError(error);
    }
};
