import NameGenerator from '../common/utils/NameGenerator.js';
import { UserInfoDTO as User, UserLoginDTO as UserLoginRequest } from '../models/UserInfoDTO.js';

class UserService {
  constructor(userRepository, userTokenService, userExtendService) {
    this.userRepository = userRepository;
    this.userTokenService = userTokenService;
    this.userExtendService = userExtendService;
  }

  /**
   * 通过邮箱查找用户
   * @param {string} email - 邮箱
   * @returns {Promise<User|null>} 用户信息
   */
  async findUserByEmail(email) {
    return await this.userRepository.findUserByEmail(email);
  }

  /**
   * 通过设备ID查找用户
   * @param {string} deviceId - 设备ID
   * @returns {Promise<User|null>} 用户信息
   */
  async findUserByDeviceId(deviceId) {
    return await this.userRepository.findUserByDeviceId(deviceId);
  }

  async registerByEmail(email, password) {
    // 创建用户
    const user = new User({
      email,
      password
    });

    // 验证用户对象
    const userValidation = user.validate();
    if (!userValidation.isValid) {
      throw new Error(userValidation.errors.join(', '));
    }

    user.user_name = NameGenerator.generate(10);

    // 创建用户
    const createdUser = await this.userRepository.createByEmailAndPassword(user);
    await this.userExtendService.createDefaultUserExtend(createdUser.user_id);
    return createdUser;
  }

  async registerByDevice(deviceId) {
    // 创建用户
    const user = new User({
      device_id: deviceId
    });

    // 验证用户对象
    const userValidation = user.validate();
    if (!userValidation.isValid) {
      throw new Error(userValidation.errors.join(', '));
    }

    user.user_name = NameGenerator.generate(10);

    const createdUser = await this.userRepository.createByDevice(user);
    await this.userExtendService.createDefaultUserExtend(createdUser.user_id);
    return createdUser;
  }

  /**
   * 更新用户头像
   * @param {string} userId - 用户ID
   * @param {string} profileImage - 头像URL
   * @returns {Promise<User>} 更新后的用户信息
   */
  async updateUser(userId, profileImage, userName) {
    if (!userId) {
      throw new Error('User ID is required');
    }

    if (!profileImage) {
      throw new Error('Profile image URL is required');
    }

    if (!userName) {
      throw new Error('User name is required');
    }

    return await this.userRepository.updateUser(userId, profileImage, userName);
  }

  async login(email, password, loginType, deviceId) {
    // 创建并验证登录请求
    const loginRequest = new UserLoginRequest({ email: email, password: password, login_type: loginType, device_id: deviceId });
    const { isValid, errors } = loginRequest.validate();
    if (!isValid) {
      throw new Error(errors.join(', '));
    }

    let userId;

    // 根据登录类型验证用户
    if (loginType === 'email') {
      const user = await this.findUserByEmail(email);
      if (!user) {
        throw new Error('Invalid email or password');
      }

      if (user.password !== password) {
        throw new Error('Invalid email or password');
      }

      userId = user.user_id;
    } else if (loginType === 'device') {
      const user = await this.findUserByDeviceId(deviceId);
      if (!user) {
        throw new Error('Invalid User');
      }

      userId = user.user_id;
    } else {
      throw new Error('Invalid login type');
    }

    // 检查是否存在有效会话
    try {
      const existingSession = await this.userTokenService.getSession(userId);
      if (existingSession) {
        // 如果会话存在且有效，直接返回
        return existingSession;
      }
    } catch (error) {
      // 如果获取会话失败（可能是会话不存在或已过期），继续创建新会话
    }

    // 创建新会话
    return await this.userTokenService.createSession(userId);
  }

  async getCurrentUser(userId) {
    const userData = await this.userRepository.getCurrentUser(userId);
    return User.fromJSON(userData);
  }

  async listUsers(limit = 25, offset = 0) {
    const response = await this.userRepository.listUsers(limit, offset);
    return {
      ...response,
      users: response.documents.map(user => User.fromJSON(user))
    };
  }

  async logout(userId) {
    return await this.userTokenService.deleteSession(userId);
  }
}

export default UserService; 