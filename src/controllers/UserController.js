import { ResponseCode, ResponseMessage, formatResponse, HttpStatus } from '../common/GlobalConstants.js';

class UserController {
  constructor(userService, logger) {
    this.userService = userService;
    this.logger = logger;
  }

  async handleListUsers(req, res) {
    try {
      const { limit, offset } = req.query || {};
      const response = await this.userService.listUsers(
        parseInt(limit) || 25,
        parseInt(offset) || 0
      );
      this.logger.log(`总用户数: ${response.total}`);
      return res.json(formatResponse(
        ResponseCode.SUCCESS,
        ResponseMessage.SUCCESS,
        response
      ));
    } catch (err) {
      this.logger.error(`获取用户列表错误: ${err.message}`);
      return res.json(formatResponse(
        ResponseCode.ERROR,
        err.message
      ), HttpStatus.INTERNAL_ERROR);
    }
  }

  async handlePing(req, res) {
    return res.json(formatResponse(
      ResponseCode.SUCCESS,
      `Pong from ${process.env.NODE_ENV}`
    ));
  }
}

export default UserController; 