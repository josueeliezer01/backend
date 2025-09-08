// src/server.js
import dotenv from "dotenv";
dotenv.config();

import app from "./app.js"; // seu express app
import pool from "./models/connection.js";

const PORT = process.env.PORT || 3333;

/**
 * Espera até que o banco esteja respondendo às queries.
 * Faz retries com backoff simples. Lança erro se exceder tentativas.
 */
async function waitForDb({
  retries = 12,
  delay = 2000, // ms
} = {}) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      // query simples para checar conexão
      await pool.query("SELECT 1");
      console.log("✅ Conectado ao banco de dados");
      return;
    } catch (err) {
      console.warn(
        `DB não disponível (tentativa ${attempt}/${retries}) — erro: ${err.message}`
      );
      if (attempt === retries) {
        throw new Error("Não foi possível conectar ao banco de dados");
      }
      // espera antes da próxima tentativa
      await new Promise((r) => setTimeout(r, delay));
    }
  }
}

async function start() {
  try {
    await waitForDb({ retries: 12, delay: 2000 });
  } catch (err) {
    console.error("Erro ao conectar ao banco:", err);
    process.exit(1);
  }

  const server = app.listen(PORT, () =>
    console.log(`🚀 Server running on port ${PORT}`)
  );

  // shutdown gracioso
  const shutdown = async (signal) => {
    console.log(`\n⏹️  Recebido ${signal} — finalizando...`);
    server.close(async () => {
      try {
        await pool.end();
        console.log("Pool do Postgres encerrada.");
      } catch (err) {
        console.error("Erro ao encerrar pool:", err);
      } finally {
        process.exit(0);
      }
    });

    // forçar kill se demorar
    setTimeout(() => {
      console.warn("Encerramento demorando — forçando exit(1)");
      process.exit(1);
    }, 10_000).unref();
  };

  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));

  // opcional: lidar com exceções não tratadas
  process.on("uncaughtException", (err) => {
    console.error("uncaughtException:", err);
    shutdown("uncaughtException");
  });
  process.on("unhandledRejection", (reason) => {
    console.error("unhandledRejection:", reason);
    // não encerra imediatamente — mas você pode querer:
    // shutdown('unhandledRejection');
  });
}

start();
