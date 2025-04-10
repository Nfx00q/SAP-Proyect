const mysql = require('mysql2');
const chalk = require('chalk');

// Conexión a la base de datos
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'sfl-db',
  multipleStatements: true
});

// Script para crear todas las tablas
const createTables = `
CREATE TABLE IF NOT EXISTS Users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'customer'
);

CREATE TABLE IF NOT EXISTS Addresses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT NOT NULL,
  street VARCHAR(255) NOT NULL,
  city VARCHAR(100) NOT NULL,
  state VARCHAR(100) NOT NULL,
  zip VARCHAR(20) NOT NULL,
  country VARCHAR(100) NOT NULL,
  FOREIGN KEY (userId) REFERENCES Users(id)
);

CREATE TABLE IF NOT EXISTS Categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT
);

CREATE TABLE IF NOT EXISTS Products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price FLOAT NOT NULL,
  stock INT NOT NULL,
  categoryId INT,
  FOREIGN KEY (categoryId) REFERENCES Categories(id)
);

CREATE TABLE IF NOT EXISTS ProductImages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  productId INT NOT NULL,
  imageUrl VARCHAR(255) NOT NULL,
  FOREIGN KEY (productId) REFERENCES Products(id)
);

CREATE TABLE IF NOT EXISTS Sizes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(10) NOT NULL
);

CREATE TABLE IF NOT EXISTS Colors (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS ProductVariants (
  id INT AUTO_INCREMENT PRIMARY KEY,
  productId INT NOT NULL,
  sizeId INT NOT NULL,
  colorId INT NOT NULL,
  stock INT NOT NULL,
  price FLOAT,
  FOREIGN KEY (productId) REFERENCES Products(id),
  FOREIGN KEY (sizeId) REFERENCES Sizes(id),
  FOREIGN KEY (colorId) REFERENCES Colors(id)
);

CREATE TABLE IF NOT EXISTS Carts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT NOT NULL,
  FOREIGN KEY (userId) REFERENCES Users(id)
);

CREATE TABLE IF NOT EXISTS CartItems (
  id INT AUTO_INCREMENT PRIMARY KEY,
  cartId INT NOT NULL,
  productId INT NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  FOREIGN KEY (cartId) REFERENCES Carts(id),
  FOREIGN KEY (productId) REFERENCES Products(id)
);

CREATE TABLE IF NOT EXISTS Orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT NOT NULL,
  addressId INT NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  total FLOAT NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES Users(id),
  FOREIGN KEY (addressId) REFERENCES Addresses(id)
);

CREATE TABLE IF NOT EXISTS OrderItems (
  id INT AUTO_INCREMENT PRIMARY KEY,
  orderId INT NOT NULL,
  productId INT NOT NULL,
  quantity INT NOT NULL,
  price FLOAT NOT NULL,
  FOREIGN KEY (orderId) REFERENCES Orders(id),
  FOREIGN KEY (productId) REFERENCES Products(id)
);

CREATE TABLE IF NOT EXISTS Payments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  orderId INT NOT NULL,
  paymentMethod VARCHAR(50) NOT NULL,
  paymentStatus VARCHAR(50) DEFAULT 'pending',
  amount FLOAT NOT NULL,
  FOREIGN KEY (orderId) REFERENCES Orders(id)
);

CREATE TABLE IF NOT EXISTS ProductReviews (
  id INT AUTO_INCREMENT PRIMARY KEY,
  productId INT NOT NULL,
  userId INT NOT NULL,
  rating INT NOT NULL,
  comment TEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (productId) REFERENCES Products(id),
  FOREIGN KEY (userId) REFERENCES Users(id)
);

CREATE TABLE IF NOT EXISTS Wishlist (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT NOT NULL,
  productId INT NOT NULL,
  FOREIGN KEY (userId) REFERENCES Users(id),
  FOREIGN KEY (productId) REFERENCES Products(id)
);

CREATE TABLE IF NOT EXISTS Coupons (
  id INT AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(50) NOT NULL,
  discountPercentage FLOAT,
  expiresAt DATETIME,
  usageLimit INT
);

CREATE TABLE IF NOT EXISTS Subscribers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS UserLogs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT,
  action VARCHAR(255),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES Users(id)
);

CREATE TABLE IF NOT EXISTS Shipments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  orderId INT NOT NULL,
  trackingNumber VARCHAR(100),
  carrier VARCHAR(100),
  status VARCHAR(50) DEFAULT 'preparing',
  FOREIGN KEY (orderId) REFERENCES Orders(id)
);
`;

// Ejecutar creación
db.connect((err) => {
  if (err) {
    console.error(chalk.red.bold('Error al conectar con la base de datos:'), err);
    return;
  }

  db.query(createTables, (err, results) => {
    if (err) {
      console.error(chalk.red.bold('Error al crear las tablas:'), err);
    } else {
      console.log(chalk.green.bold('✅ ¡Todas las tablas han sido creadas correctamente!'));
    }
    db.end();
  });
});
