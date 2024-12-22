import { ID, Databases, Query, Permission, Role } from 'node-appwrite';
import config from '../resource/application.js';
import ConfigDTO from '../models/ConfigDTO.js';

class ConfigRepository {
  constructor(client) {
    this.databases = new Databases(client);
    
    // 数据库和集合的 ID
    this.databaseId = config.database.databaseId;
    this.configCollectionId = config.database.configCollectionId;
  }

  /**
   * 通过key查找配置
   * @param {string} key - 配置键
   * @returns {Promise<ConfigDTO[]>} 配置信息列表
   */
  async findConfigByKey(key) {
    try {
      const configs = await this.databases.listDocuments(
        this.databaseId,
        this.configCollectionId,
        [Query.equal('key', key)]
      );

      return configs.documents.map(doc => new ConfigDTO(doc));
    } catch (error) {
      throw new Error(`查找配置失败: ${error.message}`);
    }
  }

  /**
   * 批量查找配置
   * @param {string[]} keys - 配置键数组
   * @returns {Promise<ConfigDTO[]>} 配置信息列表
   */
  async findConfigsByKeys(keys) {
    try {
      const configs = await this.databases.listDocuments(
        this.databaseId,
        this.configCollectionId,
        [Query.equal('key', keys)]
      );

      return configs.documents.map(doc => new ConfigDTO(doc));
    } catch (error) {
      throw new Error(`批量查找配置失败: ${error.message}`);
    }
  }

  /**
   * 添加配置
   * @param {string} key - 配置键
   * @param {string} value - 配置值
   * @returns {Promise<ConfigDTO>} 配置信息
   */
  async addConfig(key, value) {
    try {
      const configId = ID.unique();
      const config = await this.databases.createDocument(
        this.databaseId,
        this.configCollectionId,
        configId,
        {
          config_id: configId,
          key: key,
          value: value,
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

      return new ConfigDTO(config);
    } catch (error) {
      throw new Error(`添加配置失败: ${error.message}`);
    }
  }

  /**
   * 更新配置
   * @param {string} configId - 配置ID
   * @param {string} value - 新的配置值
   * @returns {Promise<ConfigDTO>} 更新后的配置信息
   */
  async updateConfig(configId, value) {
    try {
      const config = await this.databases.updateDocument(
        this.databaseId,
        this.configCollectionId,
        configId,
        {
          value: value,
          update_time: new Date()
        }
      );

      return new ConfigDTO(config);
    } catch (error) {
      throw new Error(`更新配置失败: ${error.message}`);
    }
  }

  /**
   * 删除配置
   * @param {string} configId - 配置ID
   * @returns {Promise<void>}
   */
  async deleteConfig(configId) {
    try {
      await this.databases.deleteDocument(
        this.databaseId,
        this.configCollectionId,
        configId
      );
    } catch (error) {
      throw new Error(`删除配置失败: ${error.message}`);
    }
  }
}

export default ConfigRepository; 