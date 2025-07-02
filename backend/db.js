const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('retira-facil.db');

// Criação das tabelas e seed
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS pessoa (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    cpf TEXT NOT NULL UNIQUE
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS lojas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL UNIQUE
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS pacotes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    rastreio TEXT NOT NULL,
    pessoa_id INTEGER,
    loja_id INTEGER,
    FOREIGN KEY (pessoa_id) REFERENCES pessoa(id),
    FOREIGN KEY (loja_id) REFERENCES lojas(id)
  )`);

  db.get(`SELECT COUNT(*) as total FROM lojas`, (err, row) => {
    if (!err && row.total === 0) {
      const lojas = [
        'Mercado Livre',
        'Amazon Brasil',
        'Shopee',
        'AliExpress',
        'Magazine Luiza',
        'Americanas',
        'Submarino',
        'Shein',
        'Casas Bahia',
        'Carrefour',
        'Extra',
        'Netshoes',
        'Dafiti',
        'iFood Shop',
        'Petz',
        'Lojas Renner',
        'Leroy Merlin',
        'Centauro',
        'MadeiraMadeira',
        'Fast Shop'
      ];
      const stmt = db.prepare('INSERT INTO lojas (nome) VALUES (?)');
      lojas.forEach(nome => stmt.run(nome));
      stmt.finalize();
    }
  });
});

module.exports = db;
