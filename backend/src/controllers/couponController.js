const db = require('../config/db');

const validateCoupon = async (req, res) => {
    const { code } = req.params;
    try {
        const coupons = await db.query(
            'SELECT * FROM coupons WHERE code = ? AND is_active = 1 AND (valid_until >= CURDATE() OR valid_until IS NULL)',
            [code]
        );

        if (coupons.length === 0) {
            return res.status(404).json({ message: 'Cupon invalido o expirado.' });
        }

        res.json(coupons[0]);
    } catch (err) {
        res.status(500).json({ message: 'Error al validar el cupon.' });
    }
};

const createCoupon = async (req, res) => {
    const { code, discount_percentage, valid_until } = req.body;
    try {
        await db.query(
            'INSERT INTO coupons (code, discount_percentage, valid_until) VALUES (?, ?, ?)',
            [code, discount_percentage, valid_until]
        );
        res.status(201).json({ message: 'Cupon creado exitosamente.' });
    } catch (err) {
        res.status(500).json({ message: 'Error al crear el cupon.' });
    }
};

module.exports = {
    validateCoupon,
    createCoupon
};
