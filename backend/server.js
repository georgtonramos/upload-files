require('dotenv').config();

// Importa módulos necessários
const express = require('express');
const multer = require('multer');
const { uploadToMinio } = require('./upload');
const cors = require('cors');
const path = require('path');

// Instancia o app Express
const app = express();
const PORT = 3000;

// Configura o middleware CORS para aceitar chamadas do frontend
app.use(cors());

// Configura o Multer para armazenar uploads em memória
const storage = multer.memoryStorage();
//const upload = multer({ storage: storage });
// Configura o Multer para armazenar uploads em memória e limitar tamanho
const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5 MB em bytes
    }
});

// Rota de teste
app.get('/', (req, res) => {
    res.send('Servidor de Upload Ativo');
});

// Rota de upload que o FilePond vai usar
app.post('/upload', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'NO_FILE_UPLOADED' });
        }

        const result = await uploadToMinio(req.file);
        res.status(200).send(result); // Aqui ainda é texto simples (URL), tá OK
    } catch (error) {
        console.error('Erro ao fazer upload:', error);

        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(413).json({ error: 'LIMIT_FILE_SIZE' });
        }

        return res.status(500).json({ error: 'INTERNAL_SERVER_ERROR' });
    }
});

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});