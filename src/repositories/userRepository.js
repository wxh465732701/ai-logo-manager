import { ID, Databases, Query, Permission, Role } from 'node-appwrite';
import { UserInfoDTO } from '../models/UserInfoDTO.js';
import config from '../resource/application.js';

class UserRepository {
  constructor(client) {
    this.databases = new Databases(client);
    
    // 数据库和集合的 ID
    this.databaseId = config.database.databaseId;
    this.userCollectionId = config.database.userCollectionId;
  }

  /**
   * 通过邮箱查找用户
   * @param {string} email - 邮箱
   * @returns {Promise<UserInfoDTO|null>} 用户信息
   */
  async findUserByEmail(email) {
    try {
      const users = await this.databases.listDocuments(
        this.databaseId,
        this.userCollectionId,
        [Query.equal('email', email)]
      );

      if (users.documents.length === 0) {
        return null;
      }

      return new UserInfoDTO(users.documents[0]);
    } catch (error) {
      throw new Error(`查找用户失败: ${error.message}`);
    }
  }

  /**
   * 通过设备ID查找用户
   * @param {string} deviceId - 设备ID
   * @returns {Promise<UserInfoDTO|null>} 用户信息
   */
  async findUserByDeviceId(deviceId) {
    try {
      const users = await this.databases.listDocuments(
        this.databaseId,
        this.userCollectionId,
        [Query.equal('device_id', deviceId)]
      );

      if (users.documents.length === 0) {
        return null;
      }

      return new UserInfoDTO(users.documents[0]);
    } catch (error) {
      throw new Error(`查找用户失败: ${error.message}`);
    }
  }

  async createByEmailAndPassword(user) {
    try {
      // 设置用户id
      user.user_id = ID.unique();

      console.log(user);

      // 然后在数据库中创建用户记录
      const userData = await this.databases.createDocument(
        this.databaseId,
        this.userCollectionId,
        user.user_id,
        {
            ...user
        },
        [
            Permission.read(Role.any()),
            Permission.write(Role.any()),
            Permission.update(Role.any()),
            Permission.delete(Role.any())
        ]
      );

      return { ...user, profile: userData };
    } catch (error) {
      throw new Error(`创建用户失败: ${error.message}`);
    }
  }

  async createByDevice(user) {
    try {
      // 设置用户id
      user.user_id = ID.unique();

      const userData = await this.databases.createDocument(
        this.databaseId,
        this.userCollectionId,
        user.user_id,
        {
            ...user
        },
        [
            Permission.read(Role.any()),
            Permission.write(Role.any()),
            Permission.update(Role.any()),
            Permission.delete(Role.any())
        ]   
      );

      return { ...user, profile: userData };
    } catch (error) {
      throw new Error(`创建用户失败: ${error.message}`);
    }
  }

  /**
   * 更新用户头像
   * @param {string} userId - 用户ID
   * @param {string} profileImage - 头像URL
   * @returns {Promise<UserInfoDTO>} 更新后的用户信息
   */
  async updateUser(userId, profileImage, userName) {
    try {
      const updatedUser = await this.databases.updateDocument(
        this.databaseId,
        this.userCollectionId,
        userId,
        {
          profile_image: profileImage,
          user_name: userName
        }
      );

      return new UserInfoDTO(updatedUser);
    } catch (error) {
      throw new Error(`更新用户头像失败: ${error.message}`);
    }
  }

  async getUserByUserId(userId) {
    try {
      const users = await this.databases.listDocuments(
        this.databaseId,
        this.userCollectionId,
        [Query.equal('user_id', userId)]
      );
      return users.documents[0];
    } catch (error) {
      throw new Error(`通过用户ID获取用户失败: ${error.message}`);
    }
  }

  async listUsers(limit = 25, offset = 0) {
    try {
      return await this.databases.listDocuments(
        this.databaseId,
        this.userCollectionId,
        [
          Query.limit(limit),
          Query.offset(offset),
          Query.orderDesc('lastLoginAt')
        ]
      );
    } catch (error) {
      throw new Error(`获取用户列表失败: ${error.message}`);
    }
  }
}

export default UserRepository; 