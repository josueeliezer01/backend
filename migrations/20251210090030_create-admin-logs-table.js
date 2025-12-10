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
  pgm.createTable("admin_logs", {
    id: "id",
    admin_id: { type: "integer" },
    action: { type: "character varying" },
    target_table: { type: "character varying" },
    target_id: { type: "integer" },
    logged_at: { type: "timestamp", notNull: true, default: pgm.func("now()") },
  });

  pgm.addConstraint("admin_logs", "admin_logs_admin_fkey", {
    foreignKeys: {
      columns: "admin_id",
      references: "users(id)",
      onDelete: "SET NULL",
    },
  });
};

export const down = (pgm) => {
  pgm.dropTable("admin_logs");
};
