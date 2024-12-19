import { S3Client } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import fs from 'fs';
import path from 'path';
import config from '../resource/application.js';

class FileService {
  constructor() {
    // 初始化 S3 客户端
    this.s3Client = new S3Client({
      endpoint: config.b2.endpoint,
      region: config.b2.region,
      credentials: {
        accessKeyId: config.b2.keyId,
        secretAccessKey: config.b2.appKey
      }
    });

    this.bucketName = config.b2.bucketName;
  }

  async uploadFile(file) {
    try {
      const fileStream = fs.createReadStream(file.path);
      const fileKey = `${Date.now()}-${path.basename(file.originalname)}`;

      const uploadParams = {
        Bucket: this.bucketName,
        Key: fileKey,
        Body: fileStream,
        ContentType: file.mimetype
      };

      // 使用 Upload 类来处理大文件上传
      const upload = new Upload({
        client: this.s3Client,
        params: uploadParams
      });

      // 添加上传进度监听
      upload.on('httpUploadProgress', (progress) => {
        console.log(`Upload progress: ${progress.loaded}/${progress.total}`);
      });

      // 执行上传
      const result = await upload.done();

      // 清理临时文件
      fs.unlinkSync(file.path);

      return {
        success: true,
        fileUrl: `${process.env.B2_PUBLIC_URL}/${fileKey}`,
        key: fileKey,
        etag: result.ETag,
        size: file.size
      };
    } catch (error) {
      // 确保清理临时文件
      if (file.path && fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
      throw new Error(`文件上传失败: ${error.message}`);
    }
  }

  async deleteFile(fileKey) {
    try {
      const deleteParams = {
        Bucket: this.bucketName,
        Key: fileKey
      };

      await this.s3Client.deleteObject(deleteParams);
      return { success: true, message: '文件删除成功' };
    } catch (error) {
      throw new Error(`文件删除失败: ${error.message}`);
    }
  }

  // 生成预签名URL用于临时访问
  async getSignedUrl(fileKey, expiresIn = 3600) {
    try {
      const command = {
        Bucket: this.bucketName,
        Key: fileKey,
        Expires: expiresIn
      };

      const url = await this.s3Client.getSignedUrl('getObject', command);
      return { success: true, url };
    } catch (error) {
      throw new Error(`生成预签名URL失败: ${error.message}`);
    }
  }
}

export default FileService; 