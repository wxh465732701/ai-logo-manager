import { ResponseCode, ResponseMessage, formatResponse, HttpStatus } from './common/GlobalConstants.js';
import { isPublicRoute } from './constants/routes.js';
import serviceContainer from './common/ServiceContainer.js';
import authMiddleware from './common/GlobalAuth.js';
import config from './resource/application.js';
import RequestContext from './common/RequestContext.js';

// Appwrite 函数入口
export default async ({ req, res, log, error }) => {
  try {
    log(`main start`);

    // 创建请求上下文
    const context = new RequestContext(req, res, log, error);

    // 日志记录
    context.log(`环境: ${config.server.environment}`);
    context.log(`请求路径: ${req.path}`);
    context.log(`请求方法: ${req.method}`);
    context.log(`请求体: ${JSON.stringify(req.body)}`);

    // 检查是否需要认证
    if (!isPublicRoute(req.path)) {
      // 使用认证中间件
      const auth = authMiddleware(serviceContainer.getUserTokenService());
      
      // 等待认证完成
      const authResponse = await auth(req, res);
      context.log(`authResponse: ${JSON.stringify(authResponse)}`);

      // 验证失败直接结束
      if (authResponse.statusCode !== HttpStatus.OK) {
        return authResponse;
      }
    }

    // 获取路由处理器
    const routeHandler = serviceContainer.getRouteHandler();

    // 处理请求
    await routeHandler.handleRequest(context);
  } catch (err) {
    error(`服务器错误: ${err.message}`);
    return context.getResponse().json(formatResponse(
      ResponseCode.ERROR,
      ResponseMessage.SERVER_ERROR,
      { error: err.message }
    ), HttpStatus.INTERNAL_ERROR);
  }
};