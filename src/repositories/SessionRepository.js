import { ID, Databases, Query } from 'node-appwrite';
import config from '../resource/application.js';

class SessionRepository {
  constructor(client) {
    this.databases = new Databases(client);
    this.databaseId = config.database.databaseId;
    this.sessionCollectionId = config.database.sessionCollectionId;
  }

  /**
   * 创建会话
   * @param {string} userId - 用户ID
   * @returns {Promise<Object>} 会话信息
   */
  async createSession(userId) {
    try {
      const sessionId = ID.unique();
      return await this.databases.createDocument(
        this.databaseId,
        this.sessionCollectionId,
        sessionId,
        {
          session_id: sessionId,
          user_id: userId,
          create_time: new Date(),
          update_time: new Date()
        }
      );
    } catch (error) {
      throw new Error(`创建会话失败: ${error.message}`);
    }
  }

  /**
   * 查找会话
   * @param {string} sessionId - 会话ID
   * @returns {Promise<Object|null>} 会话信息
   */
  async findSession(sessionId) {
    try {
      return await this.databases.getDocument(
        this.databaseId,
        this.sessionCollectionId,
        sessionId
      );
    } catch (error) {
      if (error.code === 404) {
        return null;
      }
      throw new Error(`查找会话失败: ${error.message}`);
    }
  }

  /**
   * 根据用户ID查找会话
   * @param {string} userId - 用户ID
   * @returns {Promise<Object|null>} 会话信息
   */
  async findSessionByUserId(userId) {
    try {
      const sessions = await this.databases.listDocuments(
        this.databaseId,
        this.sessionCollectionId,
        [Query.equal('user_id', userId)]
      );

      if (sessions.documents.length === 0) {
        return null;
      }

      return sessions.documents[0];
    } catch (error) {
      throw new Error(`查找会话失败: ${error.message}`);
    }
  }

  /**
   * 更新会话时间
   * @param {string} sessionId - 会话ID
   * @returns {Promise<Object>} 更新后的会话信息
   */
  async updateSessionTime(sessionId) {
    try {
      return await this.databases.updateDocument(
        this.databaseId,
        this.sessionCollectionId,
        sessionId,
        {
          update_time: new Date()
        }
      );
    } catch (error) {
      throw new Error(`更新会话时间失败: ${error.message}`);
    }
  }

  /**
   * 删除会话
   * @param {string} sessionId - 会话ID
   * @returns {Promise<void>}
   */
  async deleteSession(sessionId) {
    try {
      await this.databases.deleteDocument(
        this.databaseId,
        this.sessionCollectionId,
        sessionId
      );
    } catch (error) {
      throw new Error(`删除会话失败: ${error.message}`);
    }
  }

  /**
   * 清理过期会话
   * @returns {Promise<void>}
   */
  async cleanExpiredSessions() {
    try {
      const expireTime = new Date();
      expireTime.setDate(expireTime.getDate() - 7); // 7天前的会话视为过期

      const sessions = await this.databases.listDocuments(
        this.databaseId,
        this.sessionCollectionId,
        [Query.lessThan('update_time', expireTime)]
      );

      for (const session of sessions.documents) {
        await this.deleteSession(session.$id);
      }
    } catch (error) {
      throw new Error(`清理过期会话失败: ${error.message}`);
    }
  }
}

export default SessionRepository; 