// backend/src/middlewares/auth.js
import jwt from "jsonwebtoken";
import { getUserById } from "../models/userModel.js";

const JWT_SECRET = process.env.JWT_SECRET || "change_this_secret";

// middleware para validar token, extrair userId e anexar user completo em req.user
export async function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token não fornecido" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    // popula os dois campos
    req.userId = payload.userId;
    const user = await getUserById(payload.userId);
    if (!user) {
      return res.status(401).json({ error: "Usuário não encontrado" });
    }
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Token inválido" });
  }
}
