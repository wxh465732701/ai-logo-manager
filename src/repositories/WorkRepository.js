import { ID, Databases, Query, Permission, Role } from 'node-appwrite';
import { WorkDTO, WorkStatus, WorkType } from '../models/WorkDTO.js';
import config from '../resource/application.js';

class WorkRepository {
  constructor(client) {
    this.databases = new Databases(client);
    this.databaseId = config.database.databaseId;
    this.workCollectionId = config.database.workCollectionId;
  }

  /**
   * 创建作品
   * @param {WorkDTO} workData - 作品数据
   * @returns {Promise<WorkDTO>} 创建的作品信息
   */
  async createWork(workData) {
    try {
      workData.work_id = ID.unique();
      
      const work = await this.databases.createDocument(
        this.databaseId,
        this.workCollectionId,
        workData.work_id,
        {
          ...workData
        },
        [
          Permission.read(Role.any()),
          Permission.write(Role.any()),
          Permission.update(Role.any())
        ]
      );

      return WorkDTO.fromJSON(work);
    } catch (error) {
      throw new Error(`创建作品失败: ${error.message}`);
    }
  }

  /**
   * 更新作品
   * @param {string} workId - 作品ID
   * @param {Object} updateData - 更新数据
   * @returns {Promise<WorkDTO>} 更新后的作品信息
   */
  async updateWork(workId, updateData) {
    try {
      const updatedWork = await this.databases.updateDocument(
        this.databaseId,
        this.workCollectionId,
        workId,
        updateData
      );

      return WorkDTO.fromJSON(updatedWork);
    } catch (error) {
      throw new Error(`更新作品失败: ${error.message}`);
    }
  }

  /**
   * 获取用户的作品列表
   * @param {string} userId - 用户ID
   * @param {number} limit - 限制数量
   * @param {number} offset - 偏移量
   * @returns {Promise<Array<WorkDTO>>} 作品列表
   */
  async getUserWorks(userId, limit = 25, offset = 0) {
    try {
      const works = await this.databases.listDocuments(
        this.databaseId,
        this.workCollectionId,
        [
          Query.equal('user_id', userId),
          Query.limit(limit),
          Query.offset(offset),
          Query.orderDesc('create_time')
        ]
      );

      return works.documents.map(work => WorkDTO.fromJSON(work));
    } catch (error) {
      throw new Error(`获取用户作品列表失败: ${error.message}`);
    }
  }

  /**
   * 根据作品ID获取作品详情
   * @param {string} workId - 作品ID
   * @returns {Promise<WorkDTO|null>} 作品信息
   */
  async getWorkById(workId) {
    try {
      const work = await this.databases.getDocument(
        this.databaseId,
        this.workCollectionId,
        workId
      );

      return work ? WorkDTO.fromJSON(work) : null;
    } catch (error) {
      throw new Error(`获取作品详情失败: ${error.message}`);
    }
  }

  /**
   * 删除作品
   * @param {string} workId - 作品ID
   * @returns {Promise<void>}
   */
  async deleteWork(workId) {
    try {
      await this.databases.deleteDocument(
        this.databaseId,
        this.workCollectionId,
        workId
      );
    } catch (error) {
      throw new Error(`删除作品失败: ${error.message}`);
    }
  }
}

export default WorkRepository; 