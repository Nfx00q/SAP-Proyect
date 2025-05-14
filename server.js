const express = require('express');
const mysql = require('mysql2/promise');
const chalk = require('chalk');
const path = require('path');
const bcrypt = require('bcrypt');
const app = express();
const port = 3000;

const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'sfl-db'
});


app.use(express.static(path.join(__dirname, 'frontend/public')));

app.listen(port, () => {
    console.log('----------------------------- SERVIDOR ----------------------------')
    console.log(`Servidor corriendo en ` + chalk.green('http://localhost:') + chalk.green(port));
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/public', express.static(path.join(__dirname, 'frontend/public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/public/index.html'));
});

app.get('/productos', async (req, res) => {
  const [rows] = await db.query(`
    SELECT 
      p.id_producto,
      p.nom_producto,
      p.des_producto,
      p.categoria_id_categoria,
      vp.id_var,
      vp.stock_var,
      vp.precio_var,
      t.nom_talla,
      c.nom_color,
      ip.url_img
    FROM producto p
    LEFT JOIN variante_producto vp ON p.id_producto = vp.producto_id_producto
    LEFT JOIN talla t ON vp.talla_id_talla = t.id_talla
    LEFT JOIN color c ON vp.color_id_color = c.id_color
    LEFT JOIN imagen_producto ip ON p.id_producto = ip.producto_id_producto
  `);

  // Agrupar productos con variantes e imágenes
  const productosMap = {};
  for (const row of rows) {
    if (!productosMap[row.id_producto]) {
      productosMap[row.id_producto] = {
        id_producto: row.id_producto,
        nom_producto: row.nom_producto,
        des_producto: row.des_producto,
        categoria_id_categoria: row.categoria_id_categoria,
        img: [], // ← múltiples imágenes si es necesario
        variantes: []
      };
    }

    // Solo agregar la imagen si aún no está
    if (row.url_img && !productosMap[row.id_producto].img.includes(row.url_img)) {
      productosMap[row.id_producto].img.push(row.url_img);
    }

    // Agregar la variante
    if (row.id_var) {
      productosMap[row.id_producto].variantes.push({
        id_var: row.id_var,
        stock: row.stock_var,
        precio: row.precio_var,
        talla: row.nom_talla,
        color: row.nom_color
      });
    }
  }

  const productos = Object.values(productosMap);
  res.json(productos);
});



app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/session/login/index.html'));
});

app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/session/register/index.html'));
});

app.post('/api/login', async (req, res) => {
  const { email, pass } = req.body;

  try {
    const [results] = await db.query('SELECT * FROM usuario WHERE mail_us = ?', [email]);

    if (results.length === 0) {
      return res.send('❌ Usuario o contraseña incorrectos');
    }

    const user = results[0];
    const isMatch = await bcrypt.compare(pass, user.pass_us);

    if (isMatch) {
      res.send('✅ Login exitoso. Bienvenido ' + user.nom_us);
    } else {
      res.send('❌ Usuario o contraseña incorrectos');
    }
  } catch (err) {
    console.error('Error en login:', err);
    res.status(500).send('Error del servidor');
  }
});

app.post('/api/register', async (req, res) => {
  const { nom_us, mail_us, pass_us } = req.body;

  if (!nom_us || !mail_us || !pass_us) {
    return res.status(400).send('Faltan datos');
  }

  try {
    const [existingUser] = await db.query('SELECT * FROM usuario WHERE mail_us = ?', [mail_us]);

    if (existingUser.length > 0) {
      return res.send('❌ Ya existe un usuario con ese correo');
    }

    const hashedPassword = await bcrypt.hash(pass_us, 10);

    await db.query(
      'INSERT INTO usuario (nom_us, mail_us, pass_us, rol_id_rol) VALUES (?, ?, ?, 1)',
      [nom_us, mail_us, hashedPassword]
    );

    res.send('✅ Usuario registrado con éxito');
  } catch (err) {
    console.error('❌ Error al registrar usuario:', err);
    res.status(500).send('Error del servidor: ' + err.message);
  }
});
