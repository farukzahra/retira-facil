const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('retira-facil.db');

// Criação das tabelas e seed
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS pessoa (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT NOT NULL,
  cpf TEXT NOT NULL UNIQUE,
  saldo REAL DEFAULT 0
  )`);

    db.get(`SELECT COUNT(*) as total FROM pessoa`, (err, row) => {
    if (!err && row.total === 0) {
      const pessoas = [
        { nome: 'Maria Silva', cpf: '123.456.789-00' },
        { nome: 'João Souza', cpf: '234.567.890-11' },
        { nome: 'Ana Oliveira', cpf: '345.678.901-22' },
        { nome: 'Pedro Santos', cpf: '456.789.012-33' },
        { nome: 'Lucas Lima', cpf: '567.890.123-44' },
        { nome: 'Juliana Costa', cpf: '678.901.234-55' },
        { nome: 'Gabriel Almeida', cpf: '789.012.345-66' },
        { nome: 'Fernanda Pereira', cpf: '890.123.456-77' },
        { nome: 'Rafael Rodrigues', cpf: '901.234.567-88' },
        { nome: 'Camila Fernandes', cpf: '012.345.678-99' }
      ];
      const stmt = db.prepare('INSERT INTO pessoa (nome, cpf) VALUES (?, ?)');
      pessoas.forEach(p => stmt.run(p.nome, p.cpf));
      stmt.finalize();
    }
  });

  db.run(`CREATE TABLE IF NOT EXISTS lojas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL UNIQUE
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS pacotes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  rastreio TEXT,
  pessoa_id INTEGER,
  loja_id INTEGER,
  data_retirada TEXT,
  FOREIGN KEY (pessoa_id) REFERENCES pessoas(id),
  FOREIGN KEY (loja_id) REFERENCES lojas(id)
  )`)

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

  db.run(`CREATE TABLE IF NOT EXISTS configuracao (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    chave TEXT NOT NULL UNIQUE,
    valor TEXT NOT NULL
  )`);

  db.run(`INSERT OR IGNORE INTO configuracao (chave, valor) VALUES ('valorPorRetirada', '1')`);

});

module.exports = db;
