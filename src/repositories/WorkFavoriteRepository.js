import { ID, Databases, Query, Permission, Role } from 'node-appwrite';
import { WorkFavoriteDTO } from '../models/WorkDTO.js';
import config from '../resource/application.js';

class WorkFavoriteRepository {
  constructor(client) {
    this.databases = new Databases(client);
    this.databaseId = config.database.databaseId;
    this.workFavoriteCollectionId = config.database.workFavoriteCollectionId;
  }

  /**
   * 创建收藏
   * @param {WorkFavoriteDTO} favoriteData - 收藏数据
   * @returns {Promise<WorkFavoriteDTO>} 创建的收藏信息
   */
  async createFavorite(favoriteData) {
    try {
      favoriteData.favorite_id = ID.unique();
      
      const favorite = await this.databases.createDocument(
        this.databaseId,
        this.workFavoriteCollectionId,
        favoriteData.favorite_id,
        {
          ...favoriteData
        },
        [
          Permission.read(Role.any()),
          Permission.write(Role.any()),
          Permission.update(Role.any())
        ]
      );

      return WorkFavoriteDTO.fromJSON(favorite);
    } catch (error) {
      throw new Error(`创建收藏失败: ${error.message}`);
    }
  }

  /**
   * 取消收藏
   * @param {string} userId - 用户ID
   * @param {string} workId - 作品ID
   * @returns {Promise<void>}
   */
  async deleteFavorite(userId, workId) {
    try {
      const favorites = await this.databases.listDocuments(
        this.databaseId,
        this.workFavoriteCollectionId,
        [
          Query.equal('user_id', userId),
          Query.equal('work_id', workId)
        ]
      );

      if (favorites.documents.length > 0) {
        await this.databases.deleteDocument(
          this.databaseId,
          this.workFavoriteCollectionId,
          favorites.documents[0].$id
        );
      }
    } catch (error) {
      throw new Error(`取消收藏失败: ${error.message}`);
    }
  }

  /**
   * 获取用户的收藏列表
   * @param {string} userId - 用户ID
   * @param {number} limit - 限制数量
   * @param {number} offset - 偏移量
   * @returns {Promise<Array<WorkFavoriteDTO>>} 收藏列表
   */
  async getUserFavorites(userId, limit = 25, offset = 0) {
    try {
      const favorites = await this.databases.listDocuments(
        this.databaseId,
        this.workFavoriteCollectionId,
        [
          Query.equal('user_id', userId),
          Query.limit(limit),
          Query.offset(offset),
          Query.orderDesc('create_time')
        ]
      );

      return favorites.documents.map(favorite => WorkFavoriteDTO.fromJSON(favorite));
    } catch (error) {
      throw new Error(`获取用户收藏列表失败: ${error.message}`);
    }
  }

  /**
   * 检查作品是否被用户收藏
   * @param {string} userId - 用户ID
   * @param {string} workId - 作品ID
   * @returns {Promise<boolean>} 是否已收藏
   */
  async isFavorited(userId, workId) {
    try {
      const favorites = await this.databases.listDocuments(
        this.databaseId,
        this.workFavoriteCollectionId,
        [
          Query.equal('user_id', userId),
          Query.equal('work_id', workId)
        ]
      );

      return favorites.documents.length > 0;
    } catch (error) {
      throw new Error(`检查收藏状态失败: ${error.message}`);
    }
  }

  /**
   * 获取作品的收藏数量
   * @param {string} workId - 作品ID
   * @returns {Promise<number>} 收藏数量
   */
  async getFavoriteCount(workId) {
    try {
      const favorites = await this.databases.listDocuments(
        this.databaseId,
        this.workFavoriteCollectionId,
        [
          Query.equal('work_id', workId)
        ]
      );

      return favorites.total;
    } catch (error) {
      throw new Error(`获取收藏数量失败: ${error.message}`);
    }
  }

  /**
   * 批量删除作品的所有收藏
   * @param {string} workId - 作品ID
   * @returns {Promise<void>}
   */
  async deleteWorkFavorites(workId) {
    try {
      const favorites = await this.databases.listDocuments(
        this.databaseId,
        this.workFavoriteCollectionId,
        [Query.equal('work_id', workId)]
      );

      const deletePromises = favorites.documents.map(favorite => 
        this.databases.deleteDocument(
          this.databaseId,
          this.workFavoriteCollectionId,
          favorite.$id
        )
      );

      await Promise.all(deletePromises);
    } catch (error) {
      throw new Error(`批量删除作品收藏失败: ${error.message}`);
    }
  }
}

export default WorkFavoriteRepository; 