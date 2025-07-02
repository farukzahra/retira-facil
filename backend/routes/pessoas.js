const express = require('express');
const router = express.Router();
const db = require('../db');

// GET all pessoas
router.get('/', (req, res) => {
  db.all('SELECT * FROM pessoa ORDER BY nome', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// POST new pessoa
router.post('/', (req, res) => {
  const { nome, cpf } = req.body;
  const stmt = `INSERT INTO pessoa (nome, cpf) VALUES (?, ?)`;
  db.run(stmt, [nome, cpf], function (err) {
    if (err) return res.status(400).json({ error: err.message });
    res.status(201).json({ id: this.lastID, nome, cpf });
  });
});

module.exports = router;