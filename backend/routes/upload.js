const express = require('express');
const multer = require('multer');
const { uploadToMinio } = require('../upload');

const router = express.Router();

// Configura multer para armazenamento em memória + limite de 5MB
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

// POST /api/upload
router.post('/upload', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'NO_FILE_UPLOADED' });
        }

        const url = await uploadToMinio(req.file);
        res.status(200).send(url);
    } catch (error) {
        console.error('Erro no upload:', error);

        if (error.message.includes('tamanho')) {
            return res.status(413).json({ error: 'LIMIT_FILE_SIZE' });
        }

        res.status(500).json({ error: 'INTERNAL_SERVER_ERROR' });
    }
});

module.exports = router;