-- MariaDB Database Schema for Cellphone Store

CREATE DATABASE IF NOT EXISTS tienda_celulares;
USE tienda_celulares;

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Categories Table
CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT
);

-- Products Table
CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    stock INT DEFAULT 0,
    category_id INT,
    image_url VARCHAR(255),
    is_liquidation BOOLEAN DEFAULT FALSE,
    discount_percentage INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- Coupons Table
CREATE TABLE IF NOT EXISTS coupons (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(20) NOT NULL UNIQUE,
    discount_percentage INT NOT NULL,
    valid_until DATE,
    is_active BOOLEAN DEFAULT TRUE
);

-- Orders Table
CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    total DECIMAL(10, 2) NOT NULL,
    status ENUM('pending', 'completed', 'cancelled') DEFAULT 'pending',
    payment_method VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Order Items Table
CREATE TABLE IF NOT EXISTS order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT,
    product_id INT,
    quantity INT NOT NULL,
    price_at_time DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL
);

-- Initial Data
INSERT INTO categories (name, description) VALUES 
('Gama Alta', 'Celulares con las mejores prestaciones'),
('Gama Media', 'Equilibrio entre precio y rendimiento'),
('Gama Baja', 'Opciones económicas y funcionales');

-- Admin User (password: admin123 - should be hashed in production, but for script purposes)
-- Note: In the app, we will use bcrypt. 
-- For the SQL file, we just reserve the entry.
INSERT INTO users (username, email, password, role) VALUES 
('admin', 'admin@tienda.com', '$2y$10$x.I3kQoYFm9XG.Mv4wR0S.O3jQ1K5uVv8e.wVq/XgU0GqW.L5hU.', 'admin');

-- Sample Products
INSERT INTO products (name, description, price, stock, category_id, image_url, is_liquidation, discount_percentage) VALUES 
('Generic Flagship X', 'Potente procesador y camara de 108MP', 999.99, 10, 1, 'https://via.placeholder.com/300', FALSE, 0),
('Budget Mate 10', 'Bateria de larga duracion', 199.99, 50, 3, 'https://via.placeholder.com/300', TRUE, 15),
('Midrange Pro', 'Pantalla AMOLED de 120Hz', 450.00, 25, 2, 'https://via.placeholder.com/300', FALSE, 5);

-- Sample Coupon
INSERT INTO coupons (code, discount_percentage, valid_until) VALUES 
('BIENVENIDO10', 10, '2026-12-31');
