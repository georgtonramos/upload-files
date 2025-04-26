require('dotenv').config();
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const { uploadToMinio } = require('./upload');

const app = express();
const port = process.env.PORT || 3000;

// Middleware CORS (permite requisições do frontend)
app.use(cors());

// Multer para processar arquivos
const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 } // 5 MB
});

// Rota principal de teste (opcional)
app.get('/', (req, res) => {
    res.send('Uploader de arquivos está no ar!');
});

// Endpoint de upload
app.post('/upload', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'NO_FILE_UPLOADED' });
        }

        const url = await uploadToMinio(req.file);

        return res.status(200).send(url); // Frontend espera a URL como string
    } catch (error) {
        console.error('Erro no upload:', error);

        if (error.message.includes('tamanho')) {
            return res.status(413).json({ error: 'LIMIT_FILE_SIZE' });
        }

        return res.status(500).json({ error: 'INTERNAL_SERVER_ERROR' });
    }
});

// Inicia o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
