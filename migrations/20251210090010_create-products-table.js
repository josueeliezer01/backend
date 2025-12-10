/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

export const up = (pgm) => {
  pgm.createTable("products", {
    id: { type: "serial", primaryKey: true },
    name: { type: "text", notNull: true },
    description: { type: "text" },
    price: { type: "numeric(10,2)", notNull: true, default: 0.0 },
    category: { type: "text" },
    stock: { type: "integer", notNull: true, default: 0 },
    image: { type: "text" },
    brand: { type: "text" },
    on_sale: { type: "boolean", notNull: true, default: false },
    created_by: { type: "integer" },
    updated_by: { type: "integer" },
    created_at: {
      type: "timestamptz",
      notNull: true,
      default: pgm.func("now()"),
    },
    updated_at: { type: "timestamptz" },
  });

  pgm.createIndex("products", "lower(name)", { name: "idx_products_name" });
  pgm.createIndex("products", "category", { name: "idx_products_category" });
  pgm.createIndex("products", "brand", { name: "idx_products_brand" });
  pgm.createIndex("products", "on_sale", { name: "idx_products_on_sale" });

  pgm.addConstraint("products", "products_created_by_fkey", {
    foreignKeys: {
      columns: "created_by",
      references: "users(id)",
      onDelete: "SET NULL",
    },
  });
};

export const down = (pgm) => {
  pgm.dropTable("products");
};
