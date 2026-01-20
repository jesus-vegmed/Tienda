const db = require('../config/db');

// Get all products with filters
const getProducts = async (req, res) => {
    const { search, category, minPrice, maxPrice, liquidation } = req.query;

    let sql = 'SELECT * FROM products WHERE 1=1';
    let params = [];

    if (search) {
        sql += ' AND (name LIKE ? OR description LIKE ?)';
        params.push(`%${search}%`, `%${search}%`);
    }

    if (category) {
        sql += ' AND category_id = ?';
        params.push(category);
    }

    if (minPrice) {
        sql += ' AND price >= ?';
        params.push(minPrice);
    }

    if (maxPrice) {
        sql += ' AND price <= ?';
        params.push(maxPrice);
    }

    if (liquidation === 'true') {
        sql += ' AND is_liquidation = 1';
    }

    try {
        const products = await db.query(sql, params);
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: 'Error al obtener productos.' });
    }
};

const getProductById = async (req, res) => {
    try {
        const product = await db.query('SELECT * FROM products WHERE id = ?', [req.params.id]);
        if (product.length === 0) return res.status(404).json({ message: 'Producto no encontrado.' });
        res.json(product[0]);
    } catch (err) {
        res.status(500).json({ message: 'Error al obtener el producto.' });
    }
};

// Admin operations
const createProduct = async (req, res) => {
    const { name, description, price, stock, category_id, image_url, is_liquidation, discount_percentage } = req.body;
    try {
        await db.query(
            'INSERT INTO products (name, description, price, stock, category_id, image_url, is_liquidation, discount_percentage) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [name, description, price, stock, category_id, image_url, is_liquidation ? 1 : 0, discount_percentage || 0]
        );
        res.status(201).json({ message: 'Producto creado exitosamente.' });
    } catch (err) {
        res.status(500).json({ message: 'Error al crear el producto.' });
    }
};

const updateProduct = async (req, res) => {
    const { name, description, price, stock, category_id, image_url, is_liquidation, discount_percentage } = req.body;
    try {
        await db.query(
            'UPDATE products SET name = ?, description = ?, price = ?, stock = ?, category_id = ?, image_url = ?, is_liquidation = ?, discount_percentage = ? WHERE id = ?',
            [name, description, price, stock, category_id, image_url, is_liquidation ? 1 : 0, discount_percentage || 0, req.params.id]
        );
        res.json({ message: 'Producto actualizado exitosamente.' });
    } catch (err) {
        res.status(500).json({ message: 'Error al actualizar el producto.' });
    }
};

const deleteProduct = async (req, res) => {
    try {
        await db.query('DELETE FROM products WHERE id = ?', [req.params.id]);
        res.json({ message: 'Producto eliminado exitosamente.' });
    } catch (err) {
        res.status(500).json({ message: 'Error al eliminar el producto.' });
    }
};

module.exports = {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
};
