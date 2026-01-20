const db = require('../config/db');

/**
 * Creates a new order and processes a simulated payment.
 */
const createOrder = async (req, res) => {
    const { items, total, paymentMethod, couponCode } = req.body;
    const userId = req.user.id;

    if (!items || items.length === 0) {
        return res.status(400).json({ message: 'El carrito esta vacio.' });
    }

    try {
        // Start "Transaction" simulation (manual since we're using a simple pool)
        // Check stock and calculate total again (security)

        // Payment Simulation logic
        const paymentSuccess = Math.random() > 0.1; // 90% success rate simulation

        if (!paymentSuccess) {
            return res.status(400).json({ message: 'Pago rechazado por el banco simulado.' });
        }

        // Insert Order
        const orderRes = await db.query(
            'INSERT INTO orders (user_id, total, status, payment_method) VALUES (?, ?, ?, ?)',
            [userId, total, 'completed', paymentMethod]
        );
        const orderId = orderRes.insertId;

        // Insert Order Items
        for (const item of items) {
            await db.query(
                'INSERT INTO order_items (order_id, product_id, quantity, price_at_time) VALUES (?, ?, ?, ?)',
                [orderId, item.id, item.quantity, item.price]
            );
            // Update Stock
            await db.query('UPDATE products SET stock = stock - ? WHERE id = ?', [item.quantity, item.id]);
        }

        res.status(201).json({ message: 'Pedido realizado con exito.', orderId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error al procesar el pedido.' });
    }
};

const getMyOrders = async (req, res) => {
    try {
        const orders = await db.query('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC', [req.user.id]);
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: 'Error al obtener pedidos.' });
    }
};

module.exports = {
    createOrder,
    getMyOrders
};
