import { ID, Databases, Query, Permission, Role } from 'node-appwrite';
import { UserExtendDTO } from '../models/UserInfoDTO.js';
import config from '../resource/application.js';

class UserExtendRepository {
  constructor(client) {
    this.databases = new Databases(client);
    
    // 数据库和集合的 ID
    this.databaseId = config.database.databaseId;
    this.userExtendCollectionId = config.database.userExtendCollectionId;
  }

  /**
   * 通过用户ID查找扩展信息
   * @param {string} userId - 用户ID
   * @returns {Promise<UserExtendDTO|null>} 用户扩展信息
   */
  async findByUserId(userId) {
    try {
      const results = await this.databases.listDocuments(
        this.databaseId,
        this.userExtendCollectionId,
        [Query.equal('user_id', userId)]
      );

      if (results.documents.length === 0) {
        return null;
      }

      return new UserExtendDTO(results.documents[0]);
    } catch (error) {
      throw new Error(`查找用户扩展信息失败: ${error.message}`);
    }
  }

  /**
   * 创建用户扩展信息
   * @param {UserExtendDTO} userExtend - 用户扩展信息
   * @returns {Promise<UserExtendDTO>} 创建的用户扩展信息
   */
  async create(userExtend) {
    try {
      const data = await this.databases.createDocument(
        this.databaseId,
        this.userExtendCollectionId,
        ID.unique(),
        {
          user_id: userExtend.user_id,
          notify_status: userExtend.notify_status,
          vip_status: userExtend.vip_status,
          vip_type: userExtend.vip_type,
          vip_start_time: userExtend.vip_start_time,
          vip_end_time: userExtend.vip_end_time,
          last_viewed_page: userExtend.last_viewed_page,
          create_time: new Date(),
          update_time: new Date()
        },
        [
          Permission.read(Role.any()),
          Permission.write(Role.any()),
          Permission.update(Role.any()),
          Permission.delete(Role.any())
        ]
      );

      return new UserExtendDTO(data);
    } catch (error) {
      throw new Error(`创建用户扩展信息失败: ${error.message}`);
    }
  }

  /**
   * 更新用户扩展信息
   * @param {string} userId - 用户ID
   * @param {Object} updateData - 要更新的字段
   * @returns {Promise<UserExtendDTO>} 更新后的用户扩展信息
   */
  async update(userId, updateData) {
    try {
      // 先查找文档ID
      const results = await this.databases.listDocuments(
        this.databaseId,
        this.userExtendCollectionId,
        [Query.equal('user_id', userId)]
      );

      if (results.documents.length === 0) {
        throw new Error('用户扩展信息不存在');
      }

      const documentId = results.documents[0].$id;

      // 更新文档
      const data = await this.databases.updateDocument(
        this.databaseId,
        this.userExtendCollectionId,
        documentId,
        {
          ...updateData,
          update_time: new Date()
        }
      );

      return new UserExtendDTO(data);
    } catch (error) {
      throw new Error(`更新用户扩展信息失败: ${error.message}`);
    }
  }

  /**
   * 更新VIP信息
   * @param {string} userId - 用户ID
   * @param {number} vipStatus - VIP状态
   * @param {number} vipType - VIP类型
   * @param {Date} startTime - 开始时间
   * @param {Date} endTime - 结束时间
   * @returns {Promise<UserExtendDTO>} 更新后的用户扩展信息
   */
  async updateVipInfo(userId, vipStatus, vipType, startTime, endTime) {
    return await this.update(userId, {
      vip_status: vipStatus,
      vip_type: vipType,
      vip_start_time: startTime,
      vip_end_time: endTime
    });
  }

  /**
   * 更新通知状态
   * @param {string} userId - 用户ID
   * @param {number} notifyStatus - 通知状态
   * @returns {Promise<UserExtendDTO>} 更新后的用户扩展信息
   */
  async updateNotifyStatus(userId, notifyStatus) {
    return await this.update(userId, {
      notify_status: notifyStatus
    });
  }

  /**
   * 更新最后查看的页面
   * @param {string} userId - 用户ID
   * @param {number} pageNumber - 页面编号
   * @returns {Promise<UserExtendDTO>} 更新后的用户扩展信息
   */
  async updateLastViewedPage(userId, pageNumber) {
    return await this.update(userId, {
      last_viewed_page: pageNumber
    });
  }

  /**
   * 删除用户扩展信息
   * @param {string} userId - 用户ID
   * @returns {Promise<void>}
   */
  async delete(userId) {
    try {
      const results = await this.databases.listDocuments(
        this.databaseId,
        this.userExtendCollectionId,
        [Query.equal('user_id', userId)]
      );

      if (results.documents.length === 0) {
        return;
      }

      const documentId = results.documents[0].$id;
      await this.databases.deleteDocument(
        this.databaseId,
        this.userExtendCollectionId,
        documentId
      );
    } catch (error) {
      throw new Error(`删除用户扩展信息失败: ${error.message}`);
    }
  }
}

export default UserExtendRepository; 