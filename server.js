const express = require('express');
const mysql = require('mysql2');
const chalk = require('chalk');
const path = require('path');

const bcrypt = require('bcrypt');

const app = express();
const port = 3000;

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

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/session/login/index.html'));
});

app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/session/register/index.html'));
});

app.post('/api/login', (req, res) => {
  const { email, pass } = req.body;

  const query = 'SELECT * FROM usuario WHERE mail_us = ?';
  db.query(query, [email], (err, results) => {
    if (err) return res.status(500).send('Error del servidor');

    if (results.length === 0) {
      return res.send('❌ Usuario o contraseña incorrectos');
    }

    const user = results[0];

    bcrypt.compare(pass, user.pass_us, (err, isMatch) => {
      if (err) return res.status(500).send('Error al verificar la contraseña');

      if (isMatch) {
        res.send('✅ Login exitoso. Bienvenido ' + user.nom_us);
      } else {
        res.send('❌ Usuario o contraseña incorrectos');
      }
    });
  });
});

app.post('/api/register', async (req, res) => {
  const { nom_us, mail_us, pass_us } = req.body;

  if (!nom_us || !mail_us || !pass_us) {
    return res.status(400).send('Faltan datos');
  }

  const checkQuery = 'SELECT * FROM usuario WHERE mail_us = ?';
  db.query(checkQuery, [mail_us], async (err, results) => {
    if (err) {
      console.error('❌ Error en SELECT:', err);
      return res.status(500).send('Error al verificar el correo: ' + err.message);
    }

    if (results.length > 0) {
      return res.send('❌ Ya existe un usuario con ese correo');
    }

    try {
      const hashedPassword = await bcrypt.hash(pass_us, 10);

      const insertQuery = 'INSERT INTO usuario (nom_us, mail_us, pass_us, rol_id_rol) VALUES (?, ?, ?, 1)';
      db.query(insertQuery, [nom_us, mail_us, hashedPassword, 1], (err, result) => {
        if (err) {
          console.error('❌ Error al insertar usuario:', err);
          return res.status(500).send('Error al registrar: ' + err.message);
        }

        res.send('✅ Usuario registrado con éxito');
      });
    } catch (error) {
      console.error('❌ Error en el proceso de registro:', error);
      return res.status(500).send('Error interno del servidor');
    }
  });
});


const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'sfl-db'
});

db.connect(err => {
  if (err) {
    console.log('----------------------------- DATABASE ----------------------------')
    console.error(chalk.red.bold('Error de conexión a la base de datos:'), chalk.red(err));
  } else {
    console.log('----------------------------- DATABASE ----------------------------')
    console.log(chalk.green('Conectado correctamente! ') + chalk.cyan('Database name: ') + chalk.bold(db.config.database));
    console.log(chalk.bold(`Conectado como: ${db.config.user}`))
    console.log('-------------------------------------------------------------------')
  }
});