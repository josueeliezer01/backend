// src/controllers/userController.js
import { validationResult } from "express-validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import {
  createUser,
  getUserByEmail,
  updateUser,
  getAllUsers, // ← import da nova função
} from "../models/userModel.js";

const JWT_SECRET = process.env.JWT_SECRET || "change_this_secret";

/**
 * POST /users/register
 */
export const register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password, firstName, lastName, address } = req.body;
  try {
    const existing = await getUserByEmail(email);
    if (existing) {
      return res.status(409).json({ error: "Email já cadastrado" });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await createUser({
      email,
      passwordHash,
      firstName,
      lastName,
      address,
    });
    return res.status(201).json({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      address: user.address,
      role: user.role,
    });
  } catch (err) {
    console.error("Register error:", err);
    return res.status(500).json({ error: "Erro no servidor" });
  }
};

/**
 * POST /users/login
 */
export const login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;
  try {
    const user = await getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: "Credenciais inválidas" });
    }
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(401).json({ error: "Credenciais inválidas" });
    }
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: "7d",
    });
    return res.status(200).json({ token, email: user.email });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ error: "Erro no servidor" });
  }
};

/**
 * GET /users/me
 */
export const getProfile = (req, res) => {
  if (!req.user) {
    return res.status(404).json({ error: "Usuário não carregado" });
  }
  return res.status(200).json(req.user);
};

/**
 * PATCH /users/me
 */
export const patchProfile = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { firstName, lastName, address, password } = req.body;
  let passwordHash;
  if (password) {
    if (password.length < 6) {
      return res
        .status(400)
        .json({ error: "Senha deve ter ao menos 6 caracteres" });
    }
    passwordHash = await bcrypt.hash(password, 10);
  }

  try {
    const updated = await updateUser(req.userId, {
      firstName,
      lastName,
      address,
      passwordHash,
    });
    return res.status(200).json(updated);
  } catch (err) {
    console.error("Patch profile error:", err);
    return res.status(500).json({ error: "Erro no servidor" });
  }
};

/**
 * GET /users
 * Lista todos os usuários (admin only)
 */
export const listUsers = async (req, res) => {
  try {
    const users = await getAllUsers();
    return res.status(200).json(users);
  } catch (err) {
    console.error("Error listing users:", err);
    return res.status(500).json({ error: "Erro no servidor" });
  }
};

/**
 * PATCH /users/:id/role
 * Altera o role de um usuário (admin only)
 */
export const changeUserRole = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { id } = req.params;
  const { role } = req.body; // 'user' ou 'admin'
  try {
    const updated = await updateUser(id, { role });
    if (!updated) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }
    return res.status(200).json(updated);
  } catch (err) {
    console.error(`Error changing role for user ${id}:`, err);
    return res.status(500).json({ error: "Erro no servidor" });
  }
};
