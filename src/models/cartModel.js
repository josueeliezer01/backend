import pool from "./connection.js";

export const getCartItems = async (userId) => {
  const { rows } = await pool.query(
    `SELECT c.product_id, c.quantity, p.name, p.price, p.image
     FROM cart_items c
     JOIN products p ON p.id = c.product_id
     WHERE c.user_id = $1`,
    [userId]
  );
  return rows;
};

export const upsertCartItem = async (userId, productId, quantity) => {
  await pool.query(
    `INSERT INTO cart_items (user_id, product_id, quantity)
     VALUES ($1,$2,$3)
     ON CONFLICT (user_id, product_id)
     DO UPDATE SET quantity = cart_items.quantity + $3`,
    [userId, productId, quantity]
  );
};

// **nova** função
export const decrementCartItem = async (userId, productId, quantity) => {
  // decrementa
  await pool.query(
    `UPDATE cart_items
     SET quantity = quantity - $3
     WHERE user_id = $1 AND product_id = $2`,
    [userId, productId, quantity]
  );
  // remove se zero ou negativo
  await pool.query(
    `DELETE FROM cart_items
     WHERE user_id = $1 AND product_id = $2 AND quantity <= 0`,
    [userId, productId]
  );
};

export const removeCartItem = async (userId, productId) => {
  await pool.query(
    `DELETE FROM cart_items WHERE user_id = $1 AND product_id = $2`,
    [userId, productId]
  );
};

export const clearCart = async (userId) => {
  await pool.query(`DELETE FROM cart_items WHERE user_id = $1`, [userId]);
};
