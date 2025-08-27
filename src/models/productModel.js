// src/models/productModel.js
import pool from "./connection.js";

// busca produtos cujo nome contenha o termo (case-insensitive)
export const searchProducts = async (term) => {
  const { rows } = await pool.query(
    `SELECT * FROM products
       WHERE name ILIKE '%' || $1 || '%'
     ORDER BY name`,
    [term]
  );
  return rows;
};

// retorna todos os produtos
export const getAll = async () => {
  const { rows } = await pool.query("SELECT * FROM products ORDER BY name");
  return rows;
};

// retorna produtos de uma categoria específica
export const getByCategory = async (categorySlug) => {
  const { rows } = await pool.query(
    `SELECT * FROM products
       WHERE category = $1
     ORDER BY name`,
    [categorySlug]
  );
  return rows;
};

// retorna produtos de uma marca específica
export const getByBrand = async (brand) => {
  const { rows } = await pool.query(
    `SELECT * FROM products
       WHERE brand = $1
     ORDER BY name`,
    [brand]
  );
  return rows;
};

// retorna produtos em promoção (outlet)
export const getOnSale = async () => {
  const { rows } = await pool.query(
    `SELECT * FROM products
       WHERE on_sale = true
     ORDER BY name`
  );
  return rows;
};

// retorna um produto pelo ID
export const getById = async (id) => {
  const { rows } = await pool.query(`SELECT * FROM products WHERE id = $1`, [
    id,
  ]);
  return rows[0];
};

/**
 * Cria um novo produto.
 */
export const createProduct = async ({
  name,
  description,
  price,
  category,
  stock,
  image,
  brand,
  onSale,
  createdBy,
}) => {
  const { rows } = await pool.query(
    `INSERT INTO products
       (name, description, price, category, stock, image, brand, on_sale, created_by, created_at)
     VALUES
       ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())
     RETURNING *`,
    [name, description, price, category, stock, image, brand, onSale, createdBy]
  );
  return rows[0];
};

/**
 * Atualiza um produto existente.
 */
export const updateProduct = async (id, updates) => {
  const fields = [];
  const values = [];
  let idx = 1;

  if (updates.name !== undefined) {
    fields.push(`name = $${idx++}`);
    values.push(updates.name);
  }
  if (updates.description !== undefined) {
    fields.push(`description = $${idx++}`);
    values.push(updates.description);
  }
  if (updates.price !== undefined) {
    fields.push(`price = $${idx++}`);
    values.push(updates.price);
  }
  if (updates.category !== undefined) {
    fields.push(`category = $${idx++}`);
    values.push(updates.category);
  }
  if (updates.stock !== undefined) {
    fields.push(`stock = $${idx++}`);
    values.push(updates.stock);
  }
  if (updates.image !== undefined) {
    fields.push(`image = $${idx++}`);
    values.push(updates.image);
  }
  if (updates.brand !== undefined) {
    fields.push(`brand = $${idx++}`);
    values.push(updates.brand);
  }
  if (updates.on_sale !== undefined) {
    fields.push(`on_sale = $${idx++}`);
    values.push(updates.on_sale);
  }
  if (updates.updatedBy !== undefined) {
    fields.push(`updated_by = $${idx++}`);
    values.push(updates.updatedBy);
  }

  // sempre atualiza o timestamp
  fields.push(`updated_at = NOW()`);

  values.push(id);
  const query = `
    UPDATE products
    SET ${fields.join(", ")}
    WHERE id = $${idx}
    RETURNING *
  `;
  const { rows } = await pool.query(query, values);
  return rows[0];
};

/**
 * Remove um produto pelo ID.
 */
export const deleteProduct = async (id) => {
  const { rowCount } = await pool.query(`DELETE FROM products WHERE id = $1`, [
    id,
  ]);
  return rowCount > 0;
};
