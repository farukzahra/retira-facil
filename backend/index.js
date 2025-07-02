const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/pacotes', require('./routes/pacotes'));
app.use('/api/pessoas', require('./routes/pessoas')); // Nova rota

const PORT = 3001;
app.listen(PORT, () => console.log(`🚀 Backend rodando em http://localhost:${PORT}`));