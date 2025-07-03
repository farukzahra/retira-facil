const express = require('express')
const cors = require('cors')
const db = require('./db')

const app = express()
app.use(cors())
app.use(express.json())

app.get('/api/pessoas', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM pessoa ORDER BY nome')
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.post('/api/pessoas', async (req, res) => {
  const { nome, cpf } = req.body
  try {
    const result = await db.query(
      'INSERT INTO pessoa (nome, cpf) VALUES ($1, $2) RETURNING id',
      [nome, cpf]
    )
    res.json({ id: result.rows[0].id })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.put('/api/pessoas/:id/saldo', async (req, res) => {
  const { saldo } = req.body
  try {
    const result = await db.query(
      'UPDATE pessoa SET saldo = $1 WHERE id = $2',
      [saldo, req.params.id]
    )
    res.json({ updated: result.rowCount })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.put('/api/pessoas/:id', async (req, res) => {
  const { nome, cpf, saldo } = req.body
  try {
    const result = await db.query(
      'UPDATE pessoa SET nome = $1, cpf = $2, saldo = $3 WHERE id = $4',
      [nome, cpf, saldo, req.params.id]
    )
    res.json({ updated: result.rowCount })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.get('/api/lojas', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM lojas ORDER BY nome')
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.post('/api/lojas', async (req, res) => {
  const { nome } = req.body
  try {
    const result = await db.query(
      'INSERT INTO lojas (nome) VALUES ($1) RETURNING id',
      [nome]
    )
    res.json({ id: result.rows[0].id })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.put('/api/lojas/:id', async (req, res) => {
  const { nome } = req.body
  try {
    const result = await db.query(
      'UPDATE lojas SET nome = $1 WHERE id = $2',
      [nome, req.params.id]
    )
    res.json({ updated: result.rowCount })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.delete('/api/lojas/:id', async (req, res) => {
  try {
    const result = await db.query(
      'DELETE FROM lojas WHERE id = $1',
      [req.params.id]
    )
    res.json({ deleted: result.rowCount })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.get('/api/pacotes', async (req, res) => {
  const sql = `
    SELECT pacotes.id, pacotes.rastreio, pessoa.nome AS pessoa_nome, loja.nome AS loja_nome,
           pacotes.pessoa_id, pacotes.loja_id, pacotes.data_retirada
    FROM pacotes
    LEFT JOIN pessoa ON pessoa.id = pacotes.pessoa_id
    LEFT JOIN lojas AS loja ON loja.id = pacotes.loja_id
    ORDER BY pacotes.id DESC
  `
  try {
    const result = await db.query(sql)
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.post('/api/pacotes', async (req, res) => {
  const { rastreio, pessoa_id, loja_id } = req.body
  try {
    const result = await db.query(
      'INSERT INTO pacotes (rastreio, pessoa_id, loja_id) VALUES ($1, $2, $3) RETURNING id',
      [rastreio, pessoa_id, loja_id]
    )
    res.json({ id: result.rows[0].id })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.put('/api/pacotes/:id/retirar', async (req, res) => {
  const dataRetirada = new Date().toISOString()
  try {
    const result = await db.query(
      'UPDATE pacotes SET data_retirada = $1 WHERE id = $2',
      [dataRetirada, req.params.id]
    )
    res.json({ updated: result.rowCount, data_retirada: dataRetirada })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.delete('/api/pacotes/:id', async (req, res) => {
  try {
    const result = await db.query(
      'DELETE FROM pacotes WHERE id = $1',
      [req.params.id]
    )
    res.json({ deleted: result.rowCount })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.get('/api/configuracao/:chave', async (req, res) => {
  try {
    const result = await db.query(
      'SELECT valor FROM configuracao WHERE chave = $1',
      [req.params.chave]
    )
    res.json({ valor: result.rows[0] ? result.rows[0].valor : null })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.put('/api/configuracao/:chave', async (req, res) => {
  try {
    const result = await db.query(
      'UPDATE configuracao SET valor = $1 WHERE chave = $2',
      [req.body.valor, req.params.chave]
    )
    res.json({ updated: result.rowCount })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.listen(3001, () => {
  console.log('Servidor backend ouvindo na porta 3001')
})