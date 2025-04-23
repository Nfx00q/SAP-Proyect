const express = require('express');
const mysql = require('mysql2');
const chalk = require('chalk');
const path = require('path');

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

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/session/login/index.html'));
});

app.post('/api/login', (req, res) => {
  const { email, pass } = req.body;
  const query = 'SELECT * FROM usuario WHERE mail_us = ? AND pass_us = ?';

  db.query(query, [email, pass], (err, results) => {
    if (err) return res.status(500).send('Error del servidor');
    if (results.length > 0) {
      res.send('Login exitoso. Bienvenido ' + email);
    } else {
      res.send('Usuario o contraseña incorrectos');
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