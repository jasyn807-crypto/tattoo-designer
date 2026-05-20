const AWS = require('aws-sdk');
const fs = require('fs');

// Configure AWS S3 (replace with your actual credentials and region)
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION || 'us-east-1' // Default region
});

const uploadFile = async (file) => {
    let body;
    if (file.buffer) {
        body = file.buffer;
    } else if (file.path) {
        body = fs.createReadStream(file.path);
    } else {
        throw new Error("File object must contain either 'path' or 'buffer'.");
    }

    const uploadParams = {
        Bucket: process.env.S3_BUCKET_NAME,
        Body: body,
        Key: file.filename,
        ContentType: file.mimetype
    };

    try {
        const data = await s3.upload(uploadParams).promise();
        console.log("S3 Upload Success:", data.Location);
        return data.Location; // Return the URL of the uploaded file
    } catch (err) {
        console.error("S3 Upload Error:", err);
        throw err;
    }
};

const getFileStream = (fileKey) => {
    const downloadParams = {
        Key: fileKey,
        Bucket: process.env.S3_BUCKET_NAME
    };
    return s3.getObject(downloadParams).createReadStream();
};

module.exports = {
    uploadFile,
    getFileStream
};