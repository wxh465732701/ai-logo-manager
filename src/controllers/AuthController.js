import { ResponseCode, ResponseMessage, formatResponse, HttpStatus } from '../common/GlobalConstants.js';

class AuthController {
  constructor(userService, logger) {
    this.userService = userService;
    this.logger = logger;
  }

  async handleRegisterByEmail(req, res) {
    try {
      const { email, password } = req.body;
      const user = await this.userService.registerByEmailAndPassword(email, password);
      this.logger.log(`用户注册成功: ${user.user_id}`);
      return res.json(formatResponse(
        ResponseCode.SUCCESS,
        ResponseMessage.SUCCESS,
        { user }
      ));
    } catch (err) {
      this.logger.error(`注册错误: ${err.message}`);
      return res.json(formatResponse(
        ResponseCode.ERROR,
        err.message
      ), HttpStatus.BAD_REQUEST);
    }
  }

  async handleRegisterByDevice(req, res) {
    try {
      const { deviceId } = req.body;
      const user = await this.userService.registerByDevice(deviceId);
      this.logger.log(`用户注册成功: ${user.user_id}`);
      return res.json(formatResponse(
        ResponseCode.SUCCESS,
        ResponseMessage.SUCCESS,
        { user }
      ));
    } catch (err) {
      this.logger.error(`注册错误: ${err.message}`);
      return res.json(formatResponse(
        ResponseCode.ERROR,
        err.message
      ), HttpStatus.BAD_REQUEST);
    }
  }

  async handleLogin(req, res) {
    try {
      const { email, password } = req.body;
      const session = await this.userService.login(email, password);
      this.logger.log(`用户登录成功: ${session.userId}`);
      return res.json(formatResponse(
        ResponseCode.SUCCESS,
        ResponseMessage.SUCCESS,
        { session }
      ));
    } catch (err) {
      this.logger.error(`登录错误: ${err.message}`);
      return res.json(formatResponse(
        ResponseCode.UNAUTHORIZED,
        err.message
      ), HttpStatus.UNAUTHORIZED);
    }
  }

  async handleGetCurrentUser(req, res) {
    try {
      const user = await this.userService.getCurrentUser();
      return res.json(formatResponse(
        ResponseCode.SUCCESS,
        ResponseMessage.SUCCESS,
        { user }
      ));
    } catch (err) {
      this.logger.error(`获取用户信息错误: ${err.message}`);
      return res.json(formatResponse(
        ResponseCode.UNAUTHORIZED,
        err.message
      ), HttpStatus.UNAUTHORIZED);
    }
  }
}

export default AuthController; 