const express = require('express')
const cors = require('cors')
const db = require('./db')

const app = express()
app.use(cors())
app.use(express.json())

app.get('/api/pessoas', (req, res) => {
  db.all('SELECT * FROM pessoa ORDER BY nome', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message })
    res.json(rows)
  })
})

app.post('/api/pessoas', (req, res) => {
  const { nome, cpf } = req.body
  db.run('INSERT INTO pessoa (nome, cpf) VALUES (?, ?)', [nome, cpf], function (err) {
    if (err) return res.status(500).json({ error: err.message })
    res.json({ id: this.lastID })
  })
})

app.put('/api/pessoas/:id/saldo', (req, res) => {
  const { saldo } = req.body
  db.run('UPDATE pessoa SET saldo = ? WHERE id = ?', [saldo, req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message })
    res.json({ updated: this.changes })
  })
})

app.put('/api/pessoas/:id', (req, res) => {
  const { nome, cpf, saldo } = req.body
  db.run(
    'UPDATE pessoa SET nome = ?, cpf = ?, saldo = ? WHERE id = ?',
    [nome, cpf, saldo, req.params.id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message })
      res.json({ updated: this.changes })
    }
  )
})

app.get('/api/lojas', (req, res) => {
  db.all('SELECT * FROM lojas ORDER BY nome', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message })
    res.json(rows)
  })
})

app.post('/api/lojas', (req, res) => {
  const { nome } = req.body
  db.run('INSERT INTO lojas (nome) VALUES (?)', [nome], function (err) {
    if (err) return res.status(500).json({ error: err.message })
    res.json({ id: this.lastID })
  })
})

app.put('/api/lojas/:id', (req, res) => {
  const { nome } = req.body
  db.run('UPDATE lojas SET nome = ? WHERE id = ?', [nome, req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message })
    res.json({ updated: this.changes })
  })
})

app.delete('/api/lojas/:id', (req, res) => {
  db.run('DELETE FROM lojas WHERE id = ?', [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message })
    res.json({ deleted: this.changes })
  })
})

app.get('/api/pacotes', (req, res) => {
  const sql = `
    SELECT pacotes.id, pacotes.rastreio, pessoa.nome AS pessoa_nome, loja.nome AS loja_nome,
           pacotes.pessoa_id, pacotes.loja_id
    FROM pacotes
    LEFT JOIN pessoa ON pessoa.id = pacotes.pessoa_id
    LEFT JOIN lojas AS loja ON loja.id = pacotes.loja_id
    ORDER BY pacotes.id DESC
  `
  db.all(sql, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message })
    res.json(rows)
  })
})

app.post('/api/pacotes', (req, res) => {
  const { rastreio, pessoa_id, loja_id } = req.body
  db.run(
    'INSERT INTO pacotes (rastreio, pessoa_id, loja_id) VALUES (?, ?, ?)',
    [rastreio, pessoa_id, loja_id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message })
      res.json({ id: this.lastID })
    }
  )
})

app.put('/api/pacotes/:id', (req, res) => {
  const { rastreio, pessoa_id, loja_id } = req.body
  db.run(
    'UPDATE pacotes SET rastreio = ?, pessoa_id = ?, loja_id = ? WHERE id = ?',
    [rastreio, pessoa_id, loja_id, req.params.id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message })
      res.json({ updated: this.changes })
    }
  )
})

app.delete('/api/pacotes/:id', (req, res) => {
  db.run('DELETE FROM pacotes WHERE id = ?', [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message })
    res.json({ deleted: this.changes })
  })
})

app.get('/api/configuracao/:chave', (req, res) => {
  db.get('SELECT valor FROM configuracao WHERE chave = ?', [req.params.chave], (err, row) => {
    if (err) return res.status(500).json({ error: err.message })
    res.json({ valor: row ? row.valor : null })
  })
})

app.put('/api/configuracao/:chave', (req, res) => {
  db.run(
    'UPDATE configuracao SET valor = ? WHERE chave = ?',
    [req.body.valor, req.params.chave],
    function (err) {
      if (err) return res.status(500).json({ error: err.message })
      res.json({ updated: this.changes })
    }
  )
})

app.listen(3001, () => {
  console.log('Servidor backend ouvindo na porta 3001')
})
