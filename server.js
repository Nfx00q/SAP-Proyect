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

app.use(express.json());

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/', 'index.html'));
});
