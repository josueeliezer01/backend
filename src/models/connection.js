// src/models/connection.js
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const {
  DATABASE_URL,
  PG_HOST = "localhost",
  PG_PORT = "5432",
  PG_DATABASE,
  PG_USER,
  PG_PASSWORD,
  NODE_ENV,
} = process.env;

/**
 * Construímos a pool a partir de DATABASE_URL (se presente),
 * senão usamos as variáveis PG_*
 *
 * Nota: se for deploy em produção com SSL exigido pelo provedor (Heroku, Render, etc)
 * você pode precisar passar: { ssl: { rejectUnauthorized: false } }
 */
const poolConfig = DATABASE_URL
  ? { connectionString: DATABASE_URL }
  : {
      host: PG_HOST,
      port: Number(PG_PORT || 5432),
      database: PG_DATABASE,
      user: PG_USER,
      password: PG_PASSWORD,
    };

// Se quiser habilitar ssl em production (ajuste conforme seu provedor)
if (!poolConfig.connectionString && NODE_ENV === "production") {
  // nada por padrão — ative só se necessário
}

const pool = new pg.Pool(poolConfig);

pool.on("error", (err) => {
  console.error("Unexpected error on idle client", err);
});

export default pool;
