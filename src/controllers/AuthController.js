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
      return context.getResponse().status(HttpStatus.BAD_REQUEST).json(formatResponse(
        ResponseCode.ERROR,
        err.message
      ));
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
      return context.getResponse().status(HttpStatus.BAD_REQUEST).json(formatResponse(
        ResponseCode.ERROR,
        err.message
      ));
    }
  }

  async handleLogin(context) {
    try {
      const { email, password, loginType, deviceId } = context.getBody();
      const session = await this.userService.login(email, password, loginType, deviceId);
      context.log(`用户登录成功: ${session.userId}`);
      return context.getResponse().json(formatResponse(
        ResponseCode.SUCCESS,
        ResponseMessage.SUCCESS,
        { session }
      ));
    } catch (err) {
      context.error(`登录错误: ${err.message}`);
      return context.getResponse().status(HttpStatus.UNAUTHORIZED).json(formatResponse(
        ResponseCode.UNAUTHORIZED,
        err.message
      ));
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
      return context.getResponse().status(HttpStatus.UNAUTHORIZED).json(formatResponse(
        ResponseCode.UNAUTHORIZED,
        err.message
      ));
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
      return context.getResponse().status(HttpStatus.INTERNAL_ERROR).json(formatResponse(
        ResponseCode.ERROR,
        err.message
      ));
    }
  }
}

export default AuthController; 