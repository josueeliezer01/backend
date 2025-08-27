// src/models/userModel.js
import pool from "./connection.js";

/**
 * Cria um novo usuário com email, hash de senha, nome, sobrenome, endereço e role (padrão 'user').
 * Retorna o usuário criado (sem a senha).
 */
export const createUser = async ({
  email,
  passwordHash,
  firstName,
  lastName,
  address,
  role = "user",
}) => {
  const { rows } = await pool.query(
    `INSERT INTO users
       (email, password_hash, first_name, last_name, address, role)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING
       id,
       email,
       first_name   AS "firstName",
       last_name    AS "lastName",
       address,
       role,
       created_at`,
    [email, passwordHash, firstName, lastName, address, role]
  );
  return rows[0];
};

/**
 * Busca um usuário pelo e-mail (para login).
 * Retorna id, email, password_hash e role.
 */
export const getUserByEmail = async (email) => {
  const { rows } = await pool.query(
    `SELECT
       id,
       email,
       password_hash,
       role
     FROM users
     WHERE email = $1`,
    [email]
  );
  return rows[0];
};

/**
 * Busca um usuário pelo ID (para perfil).
 * Retorna id, email, firstName, lastName, address e role.
 */
export const getUserById = async (id) => {
  const { rows } = await pool.query(
    `SELECT
       id,
       email,
       first_name AS "firstName",
       last_name  AS "lastName",
       address,
       role
     FROM users
     WHERE id = $1`,
    [id]
  );
  return rows[0];
};

/**
 * Atualiza dados do usuário. Campos omitidos não são alterados.
 * Se passwordHash ou role for fornecido, atualiza também esses campos.
 * Retorna o usuário atualizado (sem o hash da senha).
 */
export const updateUser = async (
  id,
  { firstName, lastName, address, passwordHash, role }
) => {
  // Monta dinamicamente o SET
  const fields = [];
  const values = [];
  let idx = 1;

  if (firstName !== undefined) {
    fields.push(`first_name = $${idx++}`);
    values.push(firstName);
  }
  if (lastName !== undefined) {
    fields.push(`last_name = $${idx++}`);
    values.push(lastName);
  }
  if (address !== undefined) {
    fields.push(`address = $${idx++}`);
    values.push(address);
  }
  if (passwordHash !== undefined) {
    fields.push(`password_hash = $${idx++}`);
    values.push(passwordHash);
  }
  if (role !== undefined) {
    fields.push(`role = $${idx++}`);
    values.push(role);
  }

  // Se nada para atualizar, retorna o estado atual
  if (fields.length === 0) {
    return getUserById(id);
  }

  // acrescenta o id como último parâmetro
  values.push(id);

  const { rows } = await pool.query(
    `UPDATE users
     SET ${fields.join(", ")}
     WHERE id = $${idx}
     RETURNING
       id,
       email,
       first_name AS "firstName",
       last_name  AS "lastName",
       address,
       role`,
    values
  );

  return rows[0];
};

// retorna todos os usuários (para painel admin)
export const getAllUsers = async () => {
  const { rows } = await pool.query(
    `SELECT
       id,
       email,
       first_name  AS "firstName",
       last_name   AS "lastName",
       address,
       role,
       created_at
     FROM users
     ORDER BY email`
  );
  return rows;
};
