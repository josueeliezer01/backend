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
  pgm.createTable("users", {
    id: "id",
    email: { type: "text", notNull: true, unique: true },
    password_hash: { type: "text", notNull: true },
    first_name: { type: "text" },
    last_name: { type: "text" },
    address: { type: "text" },
    role: { type: "text", notNull: true, default: "user" },
    created_at: {
      type: "timestamptz",
      notNull: true,
      default: pgm.func("now()"),
    },
  });
};

export const down = (pgm) => {
  pgm.dropTable("users");
};
