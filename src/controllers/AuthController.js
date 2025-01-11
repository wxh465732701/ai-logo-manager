import { ResponseCode, ResponseMessage, formatResponse, HttpStatus } from '../common/GlobalConstants.js';

class AuthController {
  constructor(userService) {
    this.userService = userService;
  }

  async handleRegisterByEmail(context) {
    try {
      const { email, password } = context.getBody();

      // 检查用户是否已存在
      const existingUser = await this.userService.findUserByEmail(email);
      if (existingUser) {
        context.log(`用户注册失败: 邮箱 ${email} 已存在`);
        return context.getResponse().json(formatResponse(
          ResponseCode.USER_EXISTS,
          ResponseMessage.USER_EXISTS,
          { email }
        ));
      }

      // 创建新用户
      const user = await this.userService.registerByEmail(email, password);
      context.log(`用户注册成功: ${user.user_id}`);
      return context.getResponse().json(formatResponse(
        ResponseCode.SUCCESS,
        ResponseMessage.SUCCESS,
        { user }
      ));
    } catch (err) {
      context.error(`注册错误: ${err.message}`);
      return context.getResponse().json(formatResponse(
        ResponseCode.ERROR,
        err.message
      ), HttpStatus.BAD_REQUEST);
    }
  }

  async handleRegisterByDevice(context) {
    try {
      const { deviceId } = context.getBody();

      // 检查设备是否已注册
      const existingUser = await this.userService.findUserByDeviceId(deviceId);
      if (existingUser) {
        context.log(`设备注册失败: 设备 ${deviceId} 已注册`);
        return context.getResponse().json(formatResponse(
          ResponseCode.DEVICE_EXISTS,
          ResponseMessage.DEVICE_EXISTS,
          { deviceId }
        ));
      }

      // 创建新用户
      const user = await this.userService.registerByDevice(deviceId);
      context.log(`设备注册成功: ${user.user_id}`);
      return context.getResponse().json(formatResponse(
        ResponseCode.SUCCESS,
        ResponseMessage.SUCCESS,
        { user }
      ));
    } catch (err) {
      context.error(`注册错误: ${err.message}`);
      return context.getResponse().json(formatResponse(
        ResponseCode.ERROR,
        err.message
      ), HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * 处理用户登录请求
   * 支持邮箱登录和设备登录两种方式
   * 如果用户/设备不存在，会自动注册
   * 
   * 路由: /auth/login
   * 方法: POST
   * 
   * 请求参数：
   * {
   *   "loginType": "email" | "device",  // 登录类型：email-邮箱登录，device-设备登录
   *   "email": "user@example.com",      // 邮箱（邮箱登录时必填）
   *   "password": "password123",        // 密码（邮箱登录时必填）
   *   "deviceId": "device123"          // 设备ID（设备登录时必填）
   * }
   * 
   * 响应结果：
   * {
   *   "code": 0,                      // 状态码：0-成功，其他-失败
   *   "msg": "success",               // 状态信息
   *   "data": {
   *     "session": {
   *       "userId": "user123",        // 用户ID
   *       "token": "token123",        // 会话token
   *       "expireTime": "2024-01-21"  // 过期时间
   *     }
   *   }
   * }
   * 
   * @param {RequestContext} context - 请求上下文
   * @returns {Promise<Object>} 响应结果
   */
  async handleLogin(context) {
    try {
      const { email, password, loginType, deviceId } = context.getBody();
      
      let user;
      
      // 根据登录类型检查用户是否存在
      if (loginType === 'email') {
        // 邮箱登录
        user = await this.userService.findUserByEmail(email);
        if (!user) {
          // 用户不存在，自动注册
          context.log(`用户不存在，自动注册: ${email}`);
          user = await this.userService.registerByEmail(email, password);
        }
      } else if (loginType === 'device') {
        // 设备登录
        user = await this.userService.findUserByDeviceId(deviceId);
        if (!user) {
          // 设备不存在，自动注册
          context.log(`设备不存在，自动注册: ${deviceId}`);
          user = await this.userService.registerByDevice(deviceId);
        }
      } else {
        return context.getResponse().json(formatResponse(
          ResponseCode.ERROR,
          '无效的登录类型'
        ), HttpStatus.BAD_REQUEST);
      }

      // 执行登录
      const session = await this.userService.login(email, password, loginType, deviceId);
      context.log(`用户登录成功: ${session.user_id}`);
      return context.getResponse().json(formatResponse(
        ResponseCode.SUCCESS,
        ResponseMessage.SUCCESS,
        { session }
      ));
    } catch (err) {
      context.error(`登录错误: ${err.message}`);
      return context.getResponse().json(formatResponse(
        ResponseCode.UNAUTHORIZED,
        err.message
      ), HttpStatus.UNAUTHORIZED);
    }
  }

  async handleGetCurrentUser(context) {
    try {
      const userId = context.getUser().user_id;
      const user = await this.userService.getCurrentUser(userId);
      return context.getResponse().json(formatResponse(
        ResponseCode.SUCCESS,
        ResponseMessage.SUCCESS,
        { user }
      ));
    } catch (err) {
      context.error(`获取用户信息错误: ${err.message}`);
      return context.getResponse().json(formatResponse(
        ResponseCode.UNAUTHORIZED,
        err.message
      ), HttpStatus.UNAUTHORIZED);
    }
  }

  async handleLogout(context) {
    try {
      const userId = context.getUser().user_id;
      await this.userService.logout(userId);
      return context.getResponse().json(formatResponse(
        ResponseCode.SUCCESS,
        ResponseMessage.SUCCESS
      ));
    } catch (err) {
      context.error(`登出错误: ${err.message}`);
      return context.getResponse().json(formatResponse(
        ResponseCode.ERROR,
        err.message
      ), HttpStatus.INTERNAL_ERROR);
    }
  }
}

export default AuthController; 