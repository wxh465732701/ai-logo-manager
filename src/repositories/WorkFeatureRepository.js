import { ID, Databases, Query, Permission, Role } from 'node-appwrite';
import { WorkFeatureDTO } from '../models/WorkDTO.js';
import config from '../resource/application.js';

class WorkFeatureRepository {
  constructor(client) {
    this.databases = new Databases(client);
    this.databaseId = config.database.databaseId;
    this.workFeatureCollectionId = config.database.workFeatureCollectionId;
  }

  /**
   * 创建作品特征
   * @param {WorkFeatureDTO} featureData - 特征数据
   * @returns {Promise<WorkFeatureDTO>} 创建的特征信息
   */
  async createFeature(featureData) {
    try {
      featureData.feature_id = ID.unique();
      
      const feature = await this.databases.createDocument(
        this.databaseId,
        this.workFeatureCollectionId,
        featureData.feature_id,
        {
          ...featureData
        },
        [
          Permission.read(Role.any()),
          Permission.write(Role.any()),
          Permission.update(Role.any())
        ]
      );

      return WorkFeatureDTO.fromJSON(feature);
    } catch (error) {
      throw new Error(`创建作品特征失败: ${error.message}`);
    }
  }

  /**
   * 更新作品特征
   * @param {string} featureId - 特征ID
   * @param {Object} updateData - 更新数据
   * @returns {Promise<WorkFeatureDTO>} 更新后的特征信息
   */
  async updateFeature(featureId, updateData) {
    try {
      const updatedFeature = await this.databases.updateDocument(
        this.databaseId,
        this.workFeatureCollectionId,
        featureId,
        updateData
      );

      return WorkFeatureDTO.fromJSON(updatedFeature);
    } catch (error) {
      throw new Error(`更新作品特征失败: ${error.message}`);
    }
  }

  /**
   * 获取用户的作品特征列表
   * @param {string} userId - 用户ID
   * @param {number} limit - 限制数量
   * @param {number} offset - 偏移量
   * @returns {Promise<Array<WorkFeatureDTO>>} 特征列表
   */
  async getUserFeatures(userId, limit = 25, offset = 0) {
    try {
      const features = await this.databases.listDocuments(
        this.databaseId,
        this.workFeatureCollectionId,
        [
          Query.equal('user_id', userId),
          Query.limit(limit),
          Query.offset(offset),
          Query.orderDesc('create_time')
        ]
      );

      return features.documents.map(feature => WorkFeatureDTO.fromJSON(feature));
    } catch (error) {
      throw new Error(`获取用户作品特征列表失败: ${error.message}`);
    }
  }

  /**
   * 根据特征ID获取特征详情
   * @param {string} featureId - 特征ID
   * @returns {Promise<WorkFeatureDTO|null>} 特征信息
   */
  async getFeatureById(featureId) {
    try {
      const feature = await this.databases.getDocument(
        this.databaseId,
        this.workFeatureCollectionId,
        featureId
      );

      return feature ? WorkFeatureDTO.fromJSON(feature) : null;
    } catch (error) {
      throw new Error(`获取作品特征详情失败: ${error.message}`);
    }
  }

  /**
   * 删除作品特征
   * @param {string} featureId - 特征ID
   * @returns {Promise<void>}
   */
  async deleteFeature(featureId) {
    try {
      await this.databases.deleteDocument(
        this.databaseId,
        this.workFeatureCollectionId,
        featureId
      );
    } catch (error) {
      throw new Error(`删除作品特征失败: ${error.message}`);
    }
  }
}

export default WorkFeatureRepository; 