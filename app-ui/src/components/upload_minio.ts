import * as MinIO from 'minio';
const fs = require('fs');

// Connection and uploading token images to minio
// @ts-ignore
const upload_minio = async (req, res) => {
    const minioClient = new MinIO.Client({
        // @ts-ignore
        endPoint: import.meta.env.VITE_MIN_IO_ENDPOINT,
        port: 443,
        useSSL: true,
        // @ts-ignore
        accessKey: import.meta.env.VITE_MIN_IO_ACCESSKEY,
        // @ts-ignore
        secretKey: import.meta.env.VITE_MIN_IO_SECRETKEY,
    })
    const bucketName = import.meta.env.VITE_MIN_IO_BUCKET;
    try {
        const file = req.files[0];
        // Check if file is provided
        if (!file) {
            return res.status(400).json({ error: "File is required" });
        }

        // Create a unique file name
        const uniqueFileName = `${Date.now()}-${file.originalname}`;

        // Upload the file to MinIO
        // @ts-ignore
        await minioClient.fPutObject(bucketName, uniqueFileName, file.path, {
            'Content-Type': file.mimetype,
        });

        // Generate a public URL for the uploaded image
        const imageUrl = process.env.MIN_IO_ENDPOINT+`/api/v1/buckets/tokens-media/objects/download?preview=true&prefix=${encodeURIComponent(uniqueFileName)}&/v1/buckversion_id=null`
        fs.unlinkSync(file.path);

        return res.json({
            status: 'success',
            message: 'File uploaded successfully',
            imageUrl: imageUrl
        });
    } catch (error) {
        console.error('Error uploading file to MinIO:', error);
        return res.status(500).json({ error: "An error occurred while uploading the file." });
    }
};


module.exports = upload_minio;