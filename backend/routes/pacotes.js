const express = require('express');
const router = express.Router();
const db = require('../db');

// GET all pacotes
router.get('/', (req, res) => {
  db.all('SELECT * FROM pacotes', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// POST new pacote
router.post('/', (req, res) => {
  const { nome, rastreio, pessoa_id } = req.body;
  const stmt = `INSERT INTO pacotes (nome, rastreio, pessoa_id) VALUES (?, ?, ?)`;
  db.run(stmt, [nome, rastreio, pessoa_id?.id ?? null], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id: this.lastID, nome, rastreio, pessoa_id });
  });
});

// PUT update pacote
router.put('/:id', (req, res) => {
  const { nome, rastreio, pessoa_id } = req.body;
  const stmt = `UPDATE pacotes SET nome = ?, rastreio = ?, pessoa_id = ? WHERE id = ?`;
  db.run(stmt, [nome, rastreio, pessoa_id?.id ?? null, req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.sendStatus(200);
  });
});

// DELETE pacote
router.delete('/:id', (req, res) => {
  db.run('DELETE FROM pacotes WHERE id = ?', [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.sendStatus(200);
  });
});

module.exports = router;