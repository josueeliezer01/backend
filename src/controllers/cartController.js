import {
  getCartItems,
  upsertCartItem,
  decrementCartItem,
  removeCartItem,
  clearCart,
} from "../models/cartModel.js";

export const fetchCart = async (req, res) => {
  const userId = req.userId;
  const items = await getCartItems(userId);
  res.json(items);
};

export const addToCart = async (req, res) => {
  const userId = req.userId;
  const { productId, quantity } = req.body;
  await upsertCartItem(userId, productId, quantity || 1);
  res.status(204).end();
};

export const decrementFromCart = async (req, res) => {
  const userId = req.userId;
  const { productId } = req.params;
  const { quantity = 1 } = req.body;
  await decrementCartItem(userId, productId, quantity);
  res.status(204).end();
};

export const removeFromCart = async (req, res) => {
  const userId = req.userId;
  const { productId } = req.params;
  await removeCartItem(userId, productId);
  res.status(204).end();
};

export const emptyCart = async (req, res) => {
  const userId = req.userId;
  await clearCart(userId);
  res.status(204).end();
};
