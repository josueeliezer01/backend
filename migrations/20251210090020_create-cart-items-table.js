/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
  pgm.createTable("cart_items", {
    user_id: { type: "integer", notNull: true },
    product_id: { type: "integer", notNull: true },
    quantity: { type: "integer", notNull: true, default: 1 },
  });

  // composite PK
  pgm.sql(
    "ALTER TABLE cart_items ADD CONSTRAINT cart_items_pkey PRIMARY KEY (user_id, product_id);"
  );

  // FKs
  pgm.addConstraint("cart_items", "cart_items_user_fkey", {
    foreignKeys: {
      columns: "user_id",
      references: "users(id)",
      onDelete: "CASCADE",
    },
  });

  pgm.addConstraint("cart_items", "cart_items_product_fkey", {
    foreignKeys: {
      columns: "product_id",
      references: "products(id)",
      onDelete: "RESTRICT",
    },
  });
};

export const down = (pgm) => {
  pgm.dropTable("cart_items");
};
