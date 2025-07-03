require('dotenv').config()
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
});

// Criação das tabelas e seed
async function initDb() {
  // Criação das tabelas
  await pool.query(`
    CREATE TABLE IF NOT EXISTS pessoa (
      id SERIAL PRIMARY KEY,
      nome TEXT NOT NULL,
      cpf TEXT NOT NULL UNIQUE,
      saldo REAL DEFAULT 0
    );
    CREATE TABLE IF NOT EXISTS lojas (
      id SERIAL PRIMARY KEY,
      nome TEXT NOT NULL UNIQUE
    );
    CREATE TABLE IF NOT EXISTS pacotes (
      id SERIAL PRIMARY KEY,
      rastreio TEXT,
      pessoa_id INTEGER REFERENCES pessoa(id),
      loja_id INTEGER REFERENCES lojas(id),
      data_retirada TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS configuracao (
      id SERIAL PRIMARY KEY,
      chave TEXT NOT NULL UNIQUE,
      valor TEXT NOT NULL
    );
  `);

  // Seed de pessoas
  const { rows: pessoasCount } = await pool.query('SELECT COUNT(*) AS total FROM pessoa');
  if (parseInt(pessoasCount[0].total) === 0) {
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
    for (const p of pessoas) {
      await pool.query('INSERT INTO pessoa (nome, cpf) VALUES ($1, $2)', [p.nome, p.cpf]);
    }
  }

  // Seed de lojas
  const { rows: lojasCount } = await pool.query('SELECT COUNT(*) AS total FROM lojas');
  if (parseInt(lojasCount[0].total) === 0) {
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
    for (const nome of lojas) {
      await pool.query('INSERT INTO lojas (nome) VALUES ($1)', [nome]);
    }
  }

  // Seed de configuração
  await pool.query(
    `INSERT INTO configuracao (chave, valor)
     VALUES ('valorPorRetirada', '1')
     ON CONFLICT (chave) DO NOTHING`
  );
}

// Executa a inicialização ao carregar o módulo
initDb().catch(console.error);

module.exports = pool;