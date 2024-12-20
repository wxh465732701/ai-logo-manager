import { ResponseCode, ResponseMessage, formatResponse, HttpStatus } from '../common/GlobalConstants.js';

class UserController {
  constructor(userService) {
    this.userService = userService;
  }

  async handleListUsers(context) {
    try {
      const { limit, offset } = context.getQuery() || {};
      const response = await this.userService.listUsers(
        parseInt(limit) || 25,
        parseInt(offset) || 0
      );
      context.log(`总用户数: ${response.total}`);
      return context.getResponse().json(formatResponse(
        ResponseCode.SUCCESS,
        ResponseMessage.SUCCESS,
        response
      ));
    } catch (err) {
      context.error(`获取用户列表错误: ${err.message}`);
      return context.getResponse().status(HttpStatus.INTERNAL_ERROR).json(formatResponse(
        ResponseCode.ERROR,
        err.message
      ));
    }
  }

  async handlePing(context) {
    return context.getResponse().json(formatResponse(
      ResponseCode.SUCCESS,
      `Pong from ${process.env.NODE_ENV}`
    ));
  }
}

export default UserController; 