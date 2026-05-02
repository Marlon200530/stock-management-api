import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import {
    pgTable,
    uuid,
    varchar,
    text,
    timestamp,
    boolean,
    integer,
    numeric,
    pgEnum,
    uniqueIndex,
    index,
} from "drizzle-orm/pg-core";
import { z } from "zod";

/**
 * ENUMS
 */

export const userRoleEnum = pgEnum("user_role", [
    "ADMIN",
    "MANAGER",
    "STAFF",
]);

export const productStatusEnum = pgEnum("product_status", [
    "ACTIVE",
    "INACTIVE",
]);

export const movementTypeEnum = pgEnum("movement_type", [
    "IN",
    "OUT",
    "ADJUSTMENT",
]);

export const movementReasonEnum = pgEnum("movement_reason", [
    "PURCHASE",
    "SALE",
    "RETURN",
    "DAMAGE",
    "CORRECTION",
    "INITIAL_STOCK",
]);

/**
 * USERS
 */

export const users = pgTable(
    "users",
    {
        id: uuid("id").primaryKey().defaultRandom(),

        name: varchar("name", { length: 100 }).notNull(),

        email: varchar("email", { length: 255 }).notNull().unique(),

        password: varchar("password", { length: 255 }).notNull(),

        role: userRoleEnum("role").default("STAFF").notNull(),

        isActive: boolean("is_active").default(true).notNull(),

        createdAt: timestamp("created_at").defaultNow().notNull(),

        updatedAt: timestamp("updated_at").defaultNow().notNull(),
    },
    (table) => ({
        emailIdx: uniqueIndex("users_email_idx").on(table.email),
    })
);

/**
 * PRODUCTS
 */

export const products = pgTable(
    "products",
    {
        id: uuid("id").primaryKey().defaultRandom(),

        name: varchar("name", { length: 150 }).notNull(),

        description: text("description"),

        category: varchar("category", { length: 100 }),

        status: productStatusEnum("status").default("ACTIVE").notNull(),

        createdAt: timestamp("created_at").defaultNow().notNull(),

        updatedAt: timestamp("updated_at").defaultNow().notNull(),
    },
    (table) => ({
        nameIdx: index("products_name_idx").on(table.name),
        statusIdx: index("products_status_idx").on(table.status),
    })
);

/**
 * PRODUCT VARIANTS
 *
 * Exemplo:
 * Produto: Relógio Curren
 * Variante: Curren Dourado
 * SKU: CURREN-GOLD-001
 */

export const productVariants = pgTable(
    "product_variants",
    {
        id: uuid("id").primaryKey().defaultRandom(),

        productId: uuid("product_id")
            .references(() => products.id, { onDelete: "cascade" })
            .notNull(),

        sku: varchar("sku", { length: 100 }).notNull(),

        name: varchar("name", { length: 150 }).notNull(),

        price: numeric("price", {
            precision: 10,
            scale: 2,
        }).notNull(),

        costPrice: numeric("cost_price", {
            precision: 10,
            scale: 2,
        }),

        attributes: text("attributes"),

        isActive: boolean("is_active").default(true).notNull(),

        createdAt: timestamp("created_at").defaultNow().notNull(),

        updatedAt: timestamp("updated_at").defaultNow().notNull(),
    },
    (table) => ({
        skuIdx: uniqueIndex("product_variants_sku_idx").on(table.sku),
        productIdIdx: index("product_variants_product_id_idx").on(table.productId),
    })
);

/**
 * WAREHOUSES
 *
 * Armazéns ou locais onde existe stock.
 * Exemplo:
 * - Armazém Maputo
 * - Loja Matola
 * - Armazém Beira
 */

export const warehouses = pgTable(
    "warehouses",
    {
        id: uuid("id").primaryKey().defaultRandom(),

        name: varchar("name", { length: 150 }).notNull(),

        city: varchar("city", { length: 100 }).notNull(),

        address: text("address"),

        isActive: boolean("is_active").default(true).notNull(),

        createdAt: timestamp("created_at").defaultNow().notNull(),

        updatedAt: timestamp("updated_at").defaultNow().notNull(),
    },
    (table) => ({
        nameIdx: index("warehouses_name_idx").on(table.name),
        cityIdx: index("warehouses_city_idx").on(table.city),
    })
);

/**
 * STOCK LEVELS
 *
 * Guarda o stock actual de cada variante em cada armazém.
 *
 * Exemplo:
 * variantId = Curren Dourado
 * warehouseId = Armazém Maputo
 * quantity = 10
 */

export const stockLevels = pgTable(
    "stock_levels",
    {
        id: uuid("id").primaryKey().defaultRandom(),

        variantId: uuid("variant_id")
            .references(() => productVariants.id, { onDelete: "cascade" })
            .notNull(),

        warehouseId: uuid("warehouse_id")
            .references(() => warehouses.id, { onDelete: "cascade" })
            .notNull(),

        quantity: integer("quantity").default(0).notNull(),

        createdAt: timestamp("created_at").defaultNow().notNull(),

        updatedAt: timestamp("updated_at").defaultNow().notNull(),
    },
    (table) => ({
        variantWarehouseUniqueIdx: uniqueIndex(
            "stock_levels_variant_warehouse_unique_idx"
        ).on(table.variantId, table.warehouseId),

        variantIdIdx: index("stock_levels_variant_id_idx").on(table.variantId),

        warehouseIdIdx: index("stock_levels_warehouse_id_idx").on(
            table.warehouseId
        ),
    })
);

/**
 * STOCK MOVEMENTS
 *
 * Guarda o histórico de alterações de stock.
 *
 * IN         -> entrada
 * OUT        -> saída
 * ADJUSTMENT -> ajuste manual
 */

export const stockMovements = pgTable(
    "stock_movements",
    {
        id: uuid("id").primaryKey().defaultRandom(),

        variantId: uuid("variant_id")
            .references(() => productVariants.id, { onDelete: "restrict" })
            .notNull(),

        warehouseId: uuid("warehouse_id")
            .references(() => warehouses.id, { onDelete: "restrict" })
            .notNull(),

        createdById: uuid("created_by_id")
            .references(() => users.id, { onDelete: "restrict" })
            .notNull(),

        type: movementTypeEnum("type").notNull(),

        reason: movementReasonEnum("reason").notNull(),

        quantity: integer("quantity").notNull(),

        previousQuantity: integer("previous_quantity").notNull(),

        newQuantity: integer("new_quantity").notNull(),

        note: text("note"),

        createdAt: timestamp("created_at").defaultNow().notNull(),
    },
    (table) => ({
        variantIdIdx: index("stock_movements_variant_id_idx").on(table.variantId),

        warehouseIdIdx: index("stock_movements_warehouse_id_idx").on(
            table.warehouseId
        ),

        createdByIdIdx: index("stock_movements_created_by_id_idx").on(
            table.createdById
        ),

        createdAtIdx: index("stock_movements_created_at_idx").on(table.createdAt),
    })
);

/**
 * RELATIONS
 */

export const usersRelations = relations(users, ({ many }) => ({
    stockMovements: many(stockMovements),
}));

export const productsRelations = relations(products, ({ many }) => ({
    variants: many(productVariants),
}));

export const productVariantsRelations = relations(
    productVariants,
    ({ one, many }) => ({
        product: one(products, {
            fields: [productVariants.productId],
            references: [products.id],
        }),

        stockLevels: many(stockLevels),

        stockMovements: many(stockMovements),
    })
);

export const warehousesRelations = relations(warehouses, ({ many }) => ({
    stockLevels: many(stockLevels),

    stockMovements: many(stockMovements),
}));

export const stockLevelsRelations = relations(stockLevels, ({ one }) => ({
    variant: one(productVariants, {
        fields: [stockLevels.variantId],
        references: [productVariants.id],
    }),

    warehouse: one(warehouses, {
        fields: [stockLevels.warehouseId],
        references: [warehouses.id],
    }),
}));

export const stockMovementsRelations = relations(
    stockMovements,
    ({ one }) => ({
        variant: one(productVariants, {
            fields: [stockMovements.variantId],
            references: [productVariants.id],
        }),

        warehouse: one(warehouses, {
            fields: [stockMovements.warehouseId],
            references: [warehouses.id],
        }),

        createdBy: one(users, {
            fields: [stockMovements.createdById],
            references: [users.id],
        }),
    })
);

export const registerUserSchema = createInsertSchema(users, {
    name: (schema) => schema.trim().min(2).max(100),
    email: (schema) => schema.email().trim().toLowerCase(),
    password: (schema) => schema.min(8).max(255),
}).omit({
    id: true,
    isActive: true,
    createdAt: true,
    updatedAt: true,
});

export const loginUserSchema = registerUserSchema.pick({
    email: true,
    password: true
});

export const createProductSchema = createInsertSchema(products).pick({
    name: true,
    description: true,
    category: true,
    status: true
})

/**
 * TYPES
 */

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type UserInfo = Omit<User, 'password'>

export type RegisterUserInput = z.infer<typeof registerUserSchema>;
export type LoginUserInput = z.infer<typeof loginUserSchema>

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;

export type ProductVariant = typeof productVariants.$inferSelect;
export type NewProductVariant = typeof productVariants.$inferInsert;

export type Warehouse = typeof warehouses.$inferSelect;
export type NewWarehouse = typeof warehouses.$inferInsert;

export type StockLevel = typeof stockLevels.$inferSelect;
export type NewStockLevel = typeof stockLevels.$inferInsert;

export type StockMovement = typeof stockMovements.$inferSelect;
export type NewStockMovement = typeof stockMovements.$inferInsert;
