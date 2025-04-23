const mysql = require('mysql2/promise');

async function createTables() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'sfl-db'
  });

  const tables = [

    `CREATE TABLE IF NOT EXISTS rol (
      id_rol INT AUTO_INCREMENT PRIMARY KEY,
      nom_rol VARCHAR(20)
    );`,

    `CREATE TABLE IF NOT EXISTS usuario (
      id_us INT AUTO_INCREMENT,
      nom_us VARCHAR(100) NOT NULL,
      mail_us VARCHAR(100) NOT NULL UNIQUE,
      pass_us VARCHAR(255) NOT NULL,
      rol_id_rol INT NOT NULL,
      PRIMARY KEY (id_us),
      FOREIGN KEY (rol_id_rol) REFERENCES rol(id_rol)
    );`,

    `CREATE TABLE IF NOT EXISTS categoria (
      id_categoria INT AUTO_INCREMENT PRIMARY KEY,
      nom_categoria VARCHAR(100) NOT NULL,
      des_categoria TEXT
    );`,

    `CREATE TABLE IF NOT EXISTS producto (
      id_producto INT AUTO_INCREMENT PRIMARY KEY,
      nom_producto VARCHAR(255) NOT NULL,
      des_producto TEXT,
      precio_producto DECIMAL(10,2) NOT NULL,
      cantidad_producto INT NOT NULL,
      categoria_id_categoria INT,
      FOREIGN KEY (categoria_id_categoria) REFERENCES categoria(id_categoria)
    );`,

    `CREATE TABLE IF NOT EXISTS color (
      id_color INT AUTO_INCREMENT PRIMARY KEY,
      nom_color VARCHAR(50) NOT NULL
    );`,

    `CREATE TABLE IF NOT EXISTS talla (
      id_talla INT AUTO_INCREMENT PRIMARY KEY,
      nom_talla VARCHAR(10) NOT NULL
    );`,

    `CREATE TABLE IF NOT EXISTS variante_producto (
      id_var INT AUTO_INCREMENT PRIMARY KEY,
      producto_id_producto INT NOT NULL,
      talla_id_talla INT NOT NULL,
      color_id_color INT NOT NULL,
      stock_var INT NOT NULL,
      precio_var DECIMAL(10,2),
      FOREIGN KEY (producto_id_producto) REFERENCES producto(id_producto),
      FOREIGN KEY (talla_id_talla) REFERENCES talla(id_talla),
      FOREIGN KEY (color_id_color) REFERENCES color(id_color)
    );`,

    `CREATE TABLE IF NOT EXISTS carrito (
      id_carrito INT AUTO_INCREMENT PRIMARY KEY,
      fec_carrito DATETIME,
      es_carrito VARCHAR(10),
      usuario_id_us INT NOT NULL,
      FOREIGN KEY (usuario_id_us) REFERENCES usuario(id_us)
    );`,

    `CREATE TABLE IF NOT EXISTS producto_carrito (
      id INT AUTO_INCREMENT PRIMARY KEY,
      precio DECIMAL(10,2),
      cantidad INT DEFAULT 1,
      carrito_id_carrito INT NOT NULL,
      producto_id_producto INT NOT NULL,
      FOREIGN KEY (carrito_id_carrito) REFERENCES carrito(id_carrito),
      FOREIGN KEY (producto_id_producto) REFERENCES producto(id_producto)
    );`,

    `CREATE TABLE IF NOT EXISTS pedido (
      id_pedido INT AUTO_INCREMENT PRIMARY KEY,
      usuario_id_us INT NOT NULL,
      est_pedido VARCHAR(50) DEFAULT 'pendiente',
      total_pedido DECIMAL(10,2) NOT NULL,
      hora_fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (usuario_id_us) REFERENCES usuario(id_us)
    );`,

    `CREATE TABLE IF NOT EXISTS producto_pedido (
      id INT AUTO_INCREMENT PRIMARY KEY,
      pedido_id_pedido INT NOT NULL,
      producto_id_producto INT NOT NULL,
      cantidad INT NOT NULL,
      precio DECIMAL(10,2) NOT NULL,
      FOREIGN KEY (pedido_id_pedido) REFERENCES pedido(id_pedido),
      FOREIGN KEY (producto_id_producto) REFERENCES producto(id_producto)
    );`,

    `CREATE TABLE IF NOT EXISTS envio (
      id_envio INT AUTO_INCREMENT PRIMARY KEY,
      pedido_id_pedido INT NOT NULL,
      num_segui VARCHAR(100),
      transp VARCHAR(100),
      est_envio VARCHAR(50) DEFAULT 'preparando',
      FOREIGN KEY (pedido_id_pedido) REFERENCES pedido(id_pedido)
    );`,

    `CREATE TABLE IF NOT EXISTS pago (
      id_pago INT AUTO_INCREMENT PRIMARY KEY,
      pedido_id_pedido INT NOT NULL,
      meto_pago VARCHAR(50) NOT NULL,
      est_pago VARCHAR(50) DEFAULT 'pendiente',
      monto_pago DECIMAL(10,2) NOT NULL,
      FOREIGN KEY (pedido_id_pedido) REFERENCES pedido(id_pedido)
    );`,

    `CREATE TABLE IF NOT EXISTS direccion (
      id_direccion INT AUTO_INCREMENT PRIMARY KEY,
      usuario_id_us INT NOT NULL,
      calle VARCHAR(255) NOT NULL,
      ciudad VARCHAR(100) NOT NULL,
      region VARCHAR(100) NOT NULL,
      cod_postal VARCHAR(20) NOT NULL,
      pais VARCHAR(100) NOT NULL,
      FOREIGN KEY (usuario_id_us) REFERENCES usuario(id_us)
    );`,

    `CREATE TABLE IF NOT EXISTS imagen_producto (
      id_img INT AUTO_INCREMENT PRIMARY KEY,
      producto_id_producto INT NOT NULL,
      url_img VARCHAR(255) NOT NULL,
      FOREIGN KEY (producto_id_producto) REFERENCES producto(id_producto)
    );`,

    `CREATE TABLE IF NOT EXISTS reg_usuario (
      id_reg INT AUTO_INCREMENT PRIMARY KEY,
      usuario_id_us INT,
      acc_reg VARCHAR(255),
      fec_reg DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (usuario_id_us) REFERENCES usuario(id_us)
    );`

  ];

  try {
    for (let i = 0; i < tables.length; i++) {
      await connection.execute(tables[i]);
    }
    console.log("✅ Base de Datos poblada de tablas correctamente - Version 1.0");
  } catch (error) {
    console.error("❌ Error al crear las tablas:", error.message);
  } finally {
    await connection.end();
  }
}

createTables();
