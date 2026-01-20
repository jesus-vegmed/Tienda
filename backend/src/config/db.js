const mariadb = require('mariadb');
require('dotenv').config();

const pool = mariadb.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    connectionLimit: 5
});

/**
 * Executes a database query with parameterized values to prevent SQL Injection.
 * @param {string} sql - SQL query string.
 * @param {Array} params - Parameters for the query.
 * @returns {Promise<any>} - Query result.
 */
async function query(sql, params) {
    let conn;
    try {
        conn = await pool.getConnection();
        const res = await conn.query(sql, params);
        return res;
    } catch (err) {
        console.error('Database query error:', err);
        throw err;
    } finally {
        if (conn) conn.end();
    }
}

module.exports = {
    query,
    pool
};
