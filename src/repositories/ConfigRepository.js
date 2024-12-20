import { Databases, Query } from 'node-appwrite';
import config from '../resource/application.js';

class ConfigRepository {
  constructor(client) {
    this.databases = new Databases(client);
    this.databaseId = config.database.databaseId;
    this.configCollectionId = config.database.configCollectionId;
  }

  /**
   * 根据key查询配置
   * @param {string} key - 配置键
   * @returns {Promise<Object[]>} 配置信息集合
   */
  async findConfigByKey(key) {
    try {
      const configs = await this.databases.listDocuments(
        this.databaseId,
        this.configCollectionId,
        [
          Query.equal('config_key', key),
          Query.orderDesc('create_time')  // 按创建时间倒序排序
        ]
      );

      return configs.documents;
    } catch (error) {
      throw new Error(`查询配置失败: ${error.message}`);
    }
  }

  /**
   * 批量查询配置
   * @param {string[]} keys - 配置键数组
   * @returns {Promise<Object[]>} 配置信息数组
   */
  async findConfigsByKeys(keys) {
    try {
      const configs = await this.databases.listDocuments(
        this.databaseId,
        this.configCollectionId,
        [
          Query.equal('config_key', keys),
          Query.orderDesc('create_time')  // 按创建时间倒序排序
        ]
      );

      return configs.documents;
    } catch (error) {
      throw new Error(`批量查询配置失败: ${error.message}`);
    }
  }
}

export default ConfigRepository; 