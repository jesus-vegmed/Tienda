const jwt = require('jsonwebtoken');

/**
 * Middleware to verify JWT and check for admin role if required.
 * @param {boolean} adminOnly - If true, only admins are allowed.
 */
const verifyToken = (adminOnly = false) => {
    return (req, res, next) => {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: 'Acceso denegado. No se proporciono token.' });
        }

        try {
            const verified = jwt.verify(token, process.env.JWT_SECRET);
            req.user = verified;

            if (adminOnly && req.user.role !== 'admin') {
                return res.status(403).json({ message: 'Acceso denegado. Se requiere ser administrador.' });
            }

            next();
        } catch (err) {
            res.status(400).json({ message: 'Token invalido.' });
        }
    };
};

module.exports = {
    verifyToken
};
