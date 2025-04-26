require('dotenv').config();
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { v4: uuidv4 } = require('uuid');

const s3 = new S3Client({
    region: 'us-east-1', // Pode ser qualquer valor com MinIO
    endpoint: process.env.MINIO_ENDPOINT,
    credentials: {
        accessKeyId: process.env.MINIO_ACCESS_KEY,
        secretAccessKey: process.env.MINIO_SECRET_KEY
    },
    forcePathStyle: true // Obrigatório com MinIO
});

const BUCKET_NAME = process.env.MINIO_BUCKET;

async function uploadToMinio(file) {
    const maxSize = 5 * 1024 * 1024;
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
        ACL: 'public-read' // necessário se quiser acesso público direto
    };

    const command = new PutObjectCommand(params);
    await s3.send(command);

    // Retorna a URL pública no MinIO
    const publicUrl = `${process.env.MINIO_ENDPOINT}/${BUCKET_NAME}/${filename}`;
    return publicUrl;
}

module.exports = { uploadToMinio };