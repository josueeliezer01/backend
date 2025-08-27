// src/router.js
import express from "express";
import { body } from "express-validator";

import { authenticate } from "./middlewares/auth.js";
import { isAdmin } from "./middlewares/isAdmin.js";
import { uploadProductImage } from "./middlewares/upload.js";

import {
  getAll,
  getByCategory,
  getByBrand,
  getOnSale,
  getById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "./controllers/productController.js";

import {
  register,
  login,
  getProfile,
  patchProfile,
  listUsers,
  changeUserRole,
} from "./controllers/userController.js";

import {
  fetchCart,
  addToCart,
  decrementFromCart,
  removeFromCart,
  emptyCart,
} from "./controllers/cartController.js";

const router = express.Router();

// UPLOAD (admin only)
router.post(
  "/upload/product-image",
  authenticate,
  isAdmin,
  uploadProductImage.single("image"),
  (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: "Imagem não enviada" });
    }
    const imageUrl = `/products/${req.file.filename}`;
    return res.status(201).json({ imageUrl });
  }
);

// PRODUCTS
router.get("/products", getAll);
router.get("/products/category/:category", getByCategory);
router.get("/products/brand/:brand", getByBrand);
router.get("/products/outlet", getOnSale);
router.get("/products/:id", getById);

router.post(
  "/products",
  authenticate,
  isAdmin,
  [
    body("name").notEmpty().withMessage("Nome do produto é obrigatório"),
    body("description").notEmpty().withMessage("Descrição é obrigatória"),
    body("price")
      .isFloat({ gt: 0 })
      .withMessage("Preço deve ser maior que zero"),
    body("category").notEmpty().withMessage("Categoria é obrigatória"),
    body("stock")
      .isInt({ min: 0 })
      .withMessage("Estoque deve ser inteiro >= 0"),
    body("brand").notEmpty().withMessage("Marca é obrigatória"),
    body("on_sale").isBoolean().withMessage("on_sale deve ser true ou false"),
  ],
  createProduct
);

router.put(
  "/products/:id",
  authenticate,
  isAdmin,
  [
    body("name").optional().notEmpty().withMessage("Nome não pode ficar vazio"),
    body("description")
      .optional()
      .notEmpty()
      .withMessage("Descrição não pode ficar vazia"),
    body("price")
      .optional()
      .isFloat({ gt: 0 })
      .withMessage("Preço deve ser maior que zero"),
    body("category")
      .optional()
      .notEmpty()
      .withMessage("Categoria não pode ficar vazia"),
    body("stock")
      .optional()
      .isInt({ min: 0 })
      .withMessage("Estoque deve ser inteiro >= 0"),
    body("brand")
      .optional()
      .notEmpty()
      .withMessage("Marca não pode ficar vazia"),
    body("on_sale")
      .optional()
      .isBoolean()
      .withMessage("on_sale deve ser true ou false"),
  ],
  updateProduct
);

router.delete("/products/:id", authenticate, isAdmin, deleteProduct);

// AUTH & USERS
router.post(
  "/users/register",
  [
    body("email").isEmail().withMessage("E-mail inválido"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Senha deve ter ao menos 6 caracteres"),
    body("firstName").notEmpty().withMessage("Nome é obrigatório"),
    body("lastName").notEmpty().withMessage("Sobrenome é obrigatório"),
    body("address").notEmpty().withMessage("Endereço é obrigatório"),
  ],
  register
);

router.post(
  "/users/login",
  [
    body("email").isEmail().withMessage("E-mail inválido"),
    body("password").notEmpty().withMessage("Senha é obrigatória"),
  ],
  login
);

router.get("/users/me", authenticate, getProfile);

router.patch(
  "/users/me",
  authenticate,
  [
    body("firstName")
      .optional()
      .notEmpty()
      .withMessage("Nome não pode ficar vazio"),
    body("lastName")
      .optional()
      .notEmpty()
      .withMessage("Sobrenome não pode ficar vazio"),
    body("address")
      .optional()
      .notEmpty()
      .withMessage("Endereço não pode ficar vazio"),
  ],
  patchProfile
);

// ADMIN: gestão de usuários
router.get("/users", authenticate, isAdmin, listUsers);

router.patch(
  "/users/:id/role",
  authenticate,
  isAdmin,
  [
    body("role")
      .isIn(["user", "admin"])
      .withMessage("Role deve ser 'user' ou 'admin'"),
  ],
  changeUserRole
);

// CART
router.get("/cart", authenticate, fetchCart);
router.post("/cart", authenticate, addToCart);
router.patch("/cart/:productId", authenticate, decrementFromCart);
router.delete("/cart/:productId", authenticate, removeFromCart);
router.delete("/cart", authenticate, emptyCart);

export default router;
