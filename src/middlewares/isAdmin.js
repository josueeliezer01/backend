// backend/src/middlewares/isAdmin.js
export function isAdmin(req, res, next) {
  // precisa ter sido executado o authenticate antes, para haver req.user
  if (!req.user) {
    return res
      .status(500)
      .json({ error: "Internal error: usuário não carregado" });
  }

  if (req.user.role !== "admin") {
    return res
      .status(403)
      .json({ error: "Acesso negado. Administradores apenas." });
  }

  next();
}
