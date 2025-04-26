require('dotenv').config();
const express = require('express');
const cors = require('cors');
const uploadRoutes = require('./routes/upload');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());

// Rota de status opcional
app.get('/', (req, res) => res.send('Servidor de Upload Online'));

// Aponta /api para o router modular
app.use('/api', uploadRoutes);

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});