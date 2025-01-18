import { ID, Databases, Query, Permission, Role } from 'node-appwrite';
import { WorkImageDTO } from '../models/WorkDTO.js';
import config from '../resource/application.js';

class WorkImageRepository {
  constructor(client) {
    this.databases = new Databases(client);
    this.databaseId = config.database.databaseId;
    this.workImageCollectionId = config.database.workImageCollectionId;
  }

  /**
   * 创建作品图片
   * @param {WorkImageDTO} imageData - 图片数据
   * @returns {Promise<WorkImageDTO>} 创建的图片信息
   */
  async createImage(imageData) {
    try {
      imageData.image_id = ID.unique();
      
      const image = await this.databases.createDocument(
        this.databaseId,
        this.workImageCollectionId,
        imageData.image_id,
        {
          ...imageData
        },
        [
          Permission.read(Role.any()),
          Permission.write(Role.any()),
          Permission.update(Role.any())
        ]
      );

      return WorkImageDTO.fromJSON(image);
    } catch (error) {
      throw new Error(`创建作品图片失败: ${error.message}`);
    }
  }

  /**
   * 更新作品图片
   * @param {string} imageId - 图片ID
   * @param {Object} updateData - 更新数据
   * @returns {Promise<WorkImageDTO>} 更新后的图片信息
   */
  async updateImage(imageId, updateData) {
    try {
      const updatedImage = await this.databases.updateDocument(
        this.databaseId,
        this.workImageCollectionId,
        imageId,
        updateData
      );

      return WorkImageDTO.fromJSON(updatedImage);
    } catch (error) {
      throw new Error(`更新作品图片失败: ${error.message}`);
    }
  }

  /**
   * 获取作品的图片列表
   * @param {string} workId - 作品ID
   * @returns {Promise<Array<WorkImageDTO>>} 图片列表
   */
  async getWorkImages(workId) {
    try {
      const images = await this.databases.listDocuments(
        this.databaseId,
        this.workImageCollectionId,
        [
          Query.equal('work_id', workId),
          Query.orderDesc('create_time')
        ]
      );

      return images.documents.map(image => WorkImageDTO.fromJSON(image));
    } catch (error) {
      throw new Error(`获取作品图片列表失败: ${error.message}`);
    }
  }

  /**
   * 根据图片ID获取图片详情
   * @param {string} imageId - 图片ID
   * @returns {Promise<WorkImageDTO|null>} 图片信息
   */
  async getImageById(imageId) {
    try {
      const image = await this.databases.getDocument(
        this.databaseId,
        this.workImageCollectionId,
        imageId
      );

      return image ? WorkImageDTO.fromJSON(image) : null;
    } catch (error) {
      throw new Error(`获取作品图片详情失败: ${error.message}`);
    }
  }

  /**
   * 删除作品图片
   * @param {string} imageId - 图片ID
   * @returns {Promise<void>}
   */
  async deleteImage(imageId) {
    try {
      await this.databases.deleteDocument(
        this.databaseId,
        this.workImageCollectionId,
        imageId
      );
    } catch (error) {
      throw new Error(`删除作品图片失败: ${error.message}`);
    }
  }

  /**
   * 批量删除作品图片
   * @param {string} workId - 作品ID
   * @returns {Promise<void>}
   */
  async deleteWorkImages(workId) {
    try {
      const images = await this.getWorkImages(workId);
      const deletePromises = images.map(image => this.deleteImage(image.image_id));
      await Promise.all(deletePromises);
    } catch (error) {
      throw new Error(`批量删除作品图片失败: ${error.message}`);
    }
  }
}

export default WorkImageRepository; 