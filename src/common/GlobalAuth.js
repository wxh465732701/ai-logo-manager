import { ResponseCode, ResponseMessage, formatResponse, HttpStatus } from './GlobalConstants.js';
import ResponseDTO from '../models/ResponseDTO.js';

/**
 * 认证中间件
 * 用于验证用户是否已登录
 */
const authMiddleware = (userTokenService) => {
  return async (req, res) => {
    try {
      // 从请求头中获取 Authorization Bearer Token
      const authHeader = req.headers['authorization'];
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return ResponseDTO.unauthorized('No authentication token provided');
      }

      // 提取 token
      const authToken = authHeader.split(' ')[1];
      if (!authToken) {
        return ResponseDTO.unauthorized('Invalid authentication token');
      }

      try {
        // 验证会话并获取用户信息
        const user = await userTokenService.validateSession(authToken);
        
        // 将用户信息添加到请求对象中
        req.user = user;

        // 验证成功，返回成功响应
        return ResponseDTO.success({ user });

      } catch (error) {
        return ResponseDTO.unauthorized(error.message);
      }
    } catch (error) {
      return ResponseDTO.serverError(error.message);
    }
  };
};

export default authMiddleware; 