import { ResponseCode, ResponseMessage, formatResponse, HttpStatus } from './GlobalConstants.js';

/**
 * 认证中间件
 * 用于验证用户是否已登录
 */
const authMiddleware = (userTokenService) => {
  return async (req, res) => {
    try {
      // 从请求头中获取 Auth_Token
      const authToken = req.headers['auth_token'];
      
      if (!authToken) {
        return res.json(
          formatResponse(
            ResponseCode.UNAUTHORIZED,
            ResponseMessage.UNAUTHORIZED,
            { message: 'No authentication token provided' }
          ), HttpStatus.UNAUTHORIZED
        );
      }

      try {
        // 验证会话并获取用户信息
        const user = await userTokenService.validateSession(authToken);
        
        // 将用户信息添加到请求对象中
        req.user = user;
      } catch (error) {
        return res.json(
          formatResponse(
            ResponseCode.UNAUTHORIZED,
            ResponseMessage.UNAUTHORIZED,
            { message: error.message }
          ), HttpStatus.UNAUTHORIZED
        );
      }
    } catch (error) {
      return res.json(
        formatResponse(
          ResponseCode.ERROR,
          ResponseMessage.SERVER_ERROR,
          { message: error.message }
        ), HttpStatus.INTERNAL_ERROR
      );
    }
  };
};

export default authMiddleware; 