// src/controllers/productController.js
import {
  getAll as fetchAllProducts,
  getByCategory as fetchProductsByCategory,
  getByBrand as fetchProductsByBrand,
  getById as fetchProductById,
  getOnSale as fetchOnSaleProducts,
  searchProducts,
  createProduct as insertProduct,
  updateProduct as modifyProduct,
  deleteProduct as removeProduct,
} from "../models/productModel.js";

/**
 * GET /products?search=
 */
export const getAll = async (req, res) => {
  try {
    const { search } = req.query;
    const products = search
      ? await searchProducts(search)
      : await fetchAllProducts();
    return res.status(200).json(products);
  } catch (err) {
    console.error("Error fetching products:", err);
    return res.status(500).json({ error: err.message });
  }
};

/**
 * GET /products/category/:category
 */
export const getByCategory = async (req, res) => {
  try {
    const products = await fetchProductsByCategory(req.params.category);
    return res.status(200).json(products);
  } catch (err) {
    console.error(
      `Error fetching products for category ${req.params.category}:`,
      err
    );
    return res.status(500).json({ error: err.message });
  }
};

/**
 * GET /products/brand/:brand
 */
export const getByBrand = async (req, res) => {
  try {
    const products = await fetchProductsByBrand(req.params.brand);
    return res.status(200).json(products);
  } catch (err) {
    console.error(
      `Error fetching products for brand ${req.params.brand}:`,
      err
    );
    return res.status(500).json({ error: err.message });
  }
};

/**
 * GET /products/outlet
 */
export const getOnSale = async (req, res) => {
  try {
    const products = await fetchOnSaleProducts();
    return res.status(200).json(products);
  } catch (err) {
    console.error("Error fetching outlet products:", err);
    return res.status(500).json({ error: err.message });
  }
};

/**
 * GET /products/:id
 */
export const getById = async (req, res) => {
  try {
    const product = await fetchProductById(req.params.id);
    if (!product)
      return res.status(404).json({ error: "Produto não encontrado" });
    return res.status(200).json(product);
  } catch (err) {
    console.error(`Error fetching product ${req.params.id}:`, err);
    return res.status(500).json({ error: err.message });
  }
};

/**
 * POST /products
 */
export const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      stock,
      images,
      brand,
      on_sale,
    } = req.body;
    const image = Array.isArray(images) ? images[0] : images;
    const newProduct = await insertProduct({
      name,
      description,
      price,
      category,
      stock,
      image,
      brand,
      onSale: on_sale,
      createdBy: req.user.id,
    });
    return res.status(201).json(newProduct);
  } catch (err) {
    console.error("Error creating product:", err);
    return res.status(500).json({ error: err.message });
  }
};

/**
 * PUT /products/:id
 */
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body, updatedBy: req.user.id };
    if (updates.images !== undefined) {
      updates.image = Array.isArray(updates.images)
        ? updates.images[0]
        : updates.images;
    }
    const updated = await modifyProduct(id, updates);
    if (!updated)
      return res.status(404).json({ error: "Produto não encontrado" });
    return res.status(200).json(updated);
  } catch (err) {
    console.error(`Error updating product ${req.params.id}:`, err);
    return res.status(500).json({ error: err.message });
  }
};

/**
 * DELETE /products/:id
 */
export const deleteProduct = async (req, res) => {
  try {
    const removed = await removeProduct(req.params.id);
    if (!removed)
      return res.status(404).json({ error: "Produto não encontrado" });
    return res.status(204).send();
  } catch (err) {
    console.error(`Error deleting product ${req.params.id}:`, err);
    return res.status(500).json({ error: err.message });
  }
};
