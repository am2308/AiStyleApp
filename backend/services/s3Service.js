import { PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { s3Client, S3_BUCKET } from '../config/aws.js';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';

export const uploadImageToS3 = async (file, userId, category) => {
  const fileExtension = path.extname(file.originalname);
  const fileName = `${userId}/${category}/${uuidv4()}${fileExtension}`;
  // Log the buffer length here
  console.log('Uploading image: ', file.originalname, 'Buffer length:', file.buffer ? file.buffer.length : 'undefined');

  const uploadParams = {
    Bucket: S3_BUCKET,
    Key: fileName,
    Body: file.buffer,
    ContentType: file.mimetype,
    ACL: 'public-read',
  };

  await s3Client.send(new PutObjectCommand(uploadParams));

  return `https://${S3_BUCKET}.s3.amazonaws.com/${fileName}`;
};

export const deleteImageFromS3 = async (imageUrl) => {
  try {
    const url = new URL(imageUrl);
    const key = url.pathname.substring(1); // Remove leading slash

    const deleteParams = {
      Bucket: S3_BUCKET,
      Key: key,
    };

    await s3Client.send(new DeleteObjectCommand(deleteParams));
  } catch (error) {
    console.error('Error deleting image from S3:', error);
    // Don't throw error as this is not critical
  }
};
