const Database = require('better-sqlite3');
const db = new Database('pacotes.db');

db.prepare(`
  CREATE TABLE IF NOT EXISTS pacotes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    rastreio TEXT NOT NULL
  )
`).run();

module.exports = db;