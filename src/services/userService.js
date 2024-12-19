import NameGenerator from '../common/utils/NameGenerator.js';
import { UserInfoDTO as User, UserLoginDTO as UserLoginRequest } from '../models/UserInfoDTO.js';

class UserService {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async registerByEmail(email, password) {
    // 创建并验证注册请求
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

  async login(email, password) {
    // 创建并验证登录请求
    const loginRequest = new UserLoginRequest({ email, password });
    const { isValid, errors } = loginRequest.validate();
    if (!isValid) {
      throw new Error(errors.join(', '));
    }

    return await this.userRepository.createSession(email, password);
  }

  async getCurrentUser() {
    const userData = await this.userRepository.getCurrentUser();
    return User.fromJSON(userData);
  }

  async listUsers(limit = 25, offset = 0) {
    const response = await this.userRepository.listUsers(limit, offset);
    return {
      ...response,
      users: response.documents.map(user => User.fromJSON(user))
    };
  }
}

export default UserService; 