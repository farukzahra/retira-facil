const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', (req, res) => {
  const pacotes = db.prepare('SELECT * FROM pacotes').all();
  res.json(pacotes);
});

router.post('/', (req, res) => {
  const { nome, rastreio } = req.body;
  const stmt = db.prepare('INSERT INTO pacotes (nome, rastreio) VALUES (?, ?)');
  const info = stmt.run(nome, rastreio);
  res.json({ id: info.lastInsertRowid, nome, rastreio });
});

router.put('/:id', (req, res) => {
  const { nome, rastreio } = req.body;
  const stmt = db.prepare('UPDATE pacotes SET nome = ?, rastreio = ? WHERE id = ?');
  stmt.run(nome, rastreio, req.params.id);
  res.sendStatus(200);
});

router.delete('/:id', (req, res) => {
  db.prepare('DELETE FROM pacotes WHERE id = ?').run(req.params.id);
  res.sendStatus(200);
});

module.exports = router;