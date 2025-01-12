import { ResponseCode, ResponseMessage, HttpStatus } from '../common/GlobalConstants.js';
import ResponseDTO from '../models/ResponseDTO.js';

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
      return ResponseDTO.success(response);
    } catch (err) {
      context.error(`获取用户列表错误: ${err.message}`);
      return ResponseDTO.serverError(err.message);
    }
  }

  async handlePing(context) {
    return ResponseDTO.success(`Pong from ${process.env.NODE_ENV}`);
  }
}

export default UserController; 