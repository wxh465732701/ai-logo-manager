import { ID, Databases, Query, Permission, Role } from 'node-appwrite';
import { UserInfoDTO } from '../models/UserInfoDTO.js';

class UserRepository {
  constructor(client) {
    this.databases = new Databases(client);
    this.account = client.account;
    
    // 数据库和集合的 ID
    this.databaseId = '6761243a0025b0056e19';
    this.collectionId = '67612c4c002ab937009a';
  }

  async createByEmailAndPassword(user) {
    try {
      // 设置用户id
      user.user_id = ID.unique();

      console.log(user);

      // 然后在数据库中创建用户记录
      const userData = await this.databases.createDocument(
        this.databaseId,
        this.collectionId,
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
        this.collectionId,
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

  async getUserByUserId(userId) {
    try {
      const users = await this.databases.listDocuments(
        this.databaseId,
        this.collectionId,
        [Query.equal('userId', userId)]
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
        this.collectionId,
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