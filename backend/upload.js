require('dotenv').config();
const AWS = require('aws-sdk');

// Configura o cliente S3 usando as variáveis do .env
const s3 = new AWS.S3({
    endpoint: process.env.MINIO_ENDPOINT,
    accessKeyId: process.env.MINIO_ACCESS_KEY,
    secretAccessKey: process.env.MINIO_SECRET_KEY,
    s3ForcePathStyle: true,
    signatureVersion: 'v4'
});

// Nome do bucket
const BUCKET_NAME = process.env.MINIO_BUCKET;

const { v4: uuidv4 } = require('uuid'); // Para gerar IDs únicos
// Instale também: npm install uuid

async function uploadToMinio(file) {
    const maxSize = 5 * 1024 * 1024; // 5 MB

    if (file.size > maxSize) {
        throw new Error('Arquivo excede o tamanho permitido.');
    }

    const extension = file.originalname.split('.').pop();
    const filename = `${uuidv4()}.${extension}`;

    const params = {
        Bucket: BUCKET_NAME,
        Key: filename,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: 'public-read'
    };

    const data = await s3.upload(params).promise();
    console.log('Arquivo enviado para:', data.Location);
    return data.Location;
}

module.exports = { uploadToMinio };