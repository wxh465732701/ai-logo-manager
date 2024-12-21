import NameGenerator from '../common/utils/NameGenerator.js';
import { UserInfoDTO as User, UserLoginDTO as UserLoginRequest } from '../models/UserInfoDTO.js';

class UserService {
  constructor(userRepository, userTokenService) {
    this.userRepository = userRepository;
    this.userTokenService = userTokenService;
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
      password,
    });

    // 验证用户对象
    const userValidation = user.validate();
    if (!userValidation.isValid) {
      throw new Error(userValidation.errors.join(', '));
    }

    user.user_name = NameGenerator.generate(10);

    // 创建用户
    return await this.userRepository.createByEmailAndPassword(user);
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

    return await this.userRepository.createByDevice(user);
  }

  async login(email, password, loginType, deviceId) {
    // 创建并验证登录请求
    const loginRequest = new UserLoginRequest({ email, password, loginType, deviceId });
    const { isValid, errors } = loginRequest.validate();
    if (!isValid) {
      throw new Error(errors.join(', '));
    }

    if (loginType === 'email') {
      const user = await this.findUserByEmail(email);
      if (!user) {
        throw new Error('Invalid email or password');
      }

      if (user.password !== password) {
        throw new Error('Invalid email or password');
      }

      return await this.userTokenService.createSession(user.user_id);
    } else if (loginType === 'device') {
      const user = await this.findUserByDeviceId(deviceId);
      if (!user) {
        throw new Error('Invalid User');
      }

      return await this.userTokenService.createSession(user.user_id);
    }
    
    throw new Error('Invalid login type');
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