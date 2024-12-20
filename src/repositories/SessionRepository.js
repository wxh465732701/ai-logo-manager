import { ID, Databases, Query } from 'node-appwrite';
import config from '../resource/application.js';

class SessionRepository {
  constructor(client) {
    this.databases = new Databases(client);
    this.databaseId = config.database.databaseId;
    this.sessionCollectionId = config.database.sessionCollectionId;
  }

  /**
   * 查找会话
   * @param {string} sessionId - 会话ID
   * @returns {Promise<Object|null>} 会话信息
   */
  async findSession(sessionId) {
    try {
      const sessions = await this.databases.listDocuments(
        this.databaseId,
        this.sessionCollectionId,
        [
          Query.equal('session_id', sessionId),
          Query.greaterThan('update_time', new Date(Date.now() - 24 * 60 * 60 * 1000))
        ]
      );

      return sessions.documents.length ? sessions.documents[0] : null;
    } catch (error) {
      throw new Error(`查找会话失败: ${error.message}`);
    }
  }

  /**
   * 创建新的会话
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
   * 更新会话时间
   * @param {string} documentId - 文档ID
   * @returns {Promise<Object>} 更新后的会话信息
   */
  async updateSessionTime(documentId) {
    try {
      return await this.databases.updateDocument(
        this.databaseId,
        this.sessionCollectionId,
        documentId,
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
      const sessions = await this.databases.listDocuments(
        this.databaseId,
        this.sessionCollectionId,
        [Query.equal('session_id', sessionId)]
      );

      if (sessions.documents.length) {
        await this.databases.deleteDocument(
          this.databaseId,
          this.sessionCollectionId,
          sessions.documents[0].$id
        );
      }
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
      const expiredSessions = await this.databases.listDocuments(
        this.databaseId,
        this.sessionCollectionId,
        [
          Query.lessThan('update_time', new Date(Date.now() - 24 * 60 * 60 * 1000))
        ]
      );

      for (const session of expiredSessions.documents) {
        await this.databases.deleteDocument(
          this.databaseId,
          this.sessionCollectionId,
          session.$id
        );
      }
    } catch (error) {
      throw new Error(`清理过期会话失败: ${error.message}`);
    }
  }
}

export default SessionRepository; 