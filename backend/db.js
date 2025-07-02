const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('retira-facil.db')

// Criação das tabelas
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS pessoa (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    cpf TEXT NOT NULL UNIQUE
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS pacotes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    rastreio TEXT NOT NULL,
    pessoa_id INTEGER,
    FOREIGN KEY (pessoa_id) REFERENCES pessoa(id)
  )`);
});

module.exports = db;