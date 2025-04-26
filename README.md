# Uploader de Arquivos com MinIO + PWA

Uploader simples com suporte a:
- Uploads com FilePond
- Histórico de arquivos da sessão
- PWA (instalável no celular)
- Botão "Copiar Link"
- Limpeza com fade-out suave

### Requisitos
- Backend com endpoint `/upload`
- Bucket público no MinIO
- Servidor com HTTPS (para PWA funcionar)

### Deploy
Suba os arquivos em qualquer VPS com HTTPS e execute com Nginx ou Apache.