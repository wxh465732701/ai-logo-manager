import { ID, Databases, Query } from 'node-appwrite';
import config from '../resource/application.js';

class UserTokenService {
  constructor(sessionRepository, userRepository) {
    this.sessionRepository = sessionRepository;
    this.userRepository = userRepository;
  }

  /**
   * 获取用户会话
   * @param {string} userId - 用户ID
   * @returns {Promise<Object|null>} 会话信息，如果不存在则返回null
   */
  async getSession(userId) {
    try {
      const session = await this.sessionRepository.findSessionByUserId(userId);
      if (!session) {
        return null;
      }

      // 更新会话时间
      await this.sessionRepository.updateSessionTime(session.$id);
      return session;
    } catch (error) {
      throw new Error(`获取会话失败: ${error.message}`);
    }
  }

  /**
   * 验证用户会话
   * @param {string} sessionId - 会话ID
   * @returns {Promise<Object>} 用户信息
   * @throws {Error} 如果会话无效或已过期
   */
  async validateSession(sessionId) {
    try {
      // 查询会话信息
      const session = await this.sessionRepository.findSession(sessionId);
      if (!session) {
        throw new Error('无效或已过期的会话');
      }

      // 查询用户信息
      const user = await this.userRepository.getUserByUserId(session.user_id);
      if (!user) {
        throw new Error('用户不存在');
      }

      // 更新会话时间
      await this.sessionRepository.updateSessionTime(session.$id);

      return user;
    } catch (error) {
      throw new Error(`会话验证失败: ${error.message}`);
    }
  }

  /**
   * 创建新的会话
   * @param {string} userId - 用户ID
   * @returns {Promise<Object>} 会话信息
   */
  async createSession(userId) {
    try {
      return await this.sessionRepository.createSession(userId);
    } catch (error) {
      throw new Error(`创建会话失败: ${error.message}`);
    }
  }

  /**
   * 删除会话
   * @param {string} sessionId - 会话ID
   * @returns {Promise<void>}
   */
  async deleteSession(sessionId) {
    try {
      await this.sessionRepository.deleteSession(sessionId);
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
      await this.sessionRepository.cleanExpiredSessions();
    } catch (error) {
      throw new Error(`清理过期会话失败: ${error.message}`);
    }
  }
}

export default UserTokenService; 