import { ResponseCode, ResponseMessage, formatResponse, HttpStatus } from '../common/GlobalConstants.js';

/**
 * 认证中间件
 * 用于验证用户是否已登录
 */
const authMiddleware = (userTokenService) => {
  return async (req, res, next) => {
    try {
      // 从请求头中获取 Auth_Token
      const authToken = req.headers['auth_token'];
      
      if (!authToken) {
        return res.status(HttpStatus.UNAUTHORIZED).json(
          formatResponse(
            ResponseCode.UNAUTHORIZED,
            ResponseMessage.UNAUTHORIZED,
            { message: 'No authentication token provided' }
          )
        );
      }

      try {
        // 验证会话并获取用户信息
        const user = await userTokenService.validateSession(authToken);
        
        // 将用户信息添加到请求对象中
        req.user = user;
        
        // 继续处理请求
        next();
      } catch (error) {
        return res.status(HttpStatus.UNAUTHORIZED).json(
          formatResponse(
            ResponseCode.UNAUTHORIZED,
            ResponseMessage.UNAUTHORIZED,
            { message: error.message }
          )
        );
      }
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_ERROR).json(
        formatResponse(
          ResponseCode.ERROR,
          ResponseMessage.SERVER_ERROR,
          { message: error.message }
        )
      );
    }
  };
};

export default authMiddleware; 