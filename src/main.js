import { Client } from 'node-appwrite';
import UserRepository from './repositories/userRepository.js';
import UserService from './services/userService.js';
import FileService from './services/fileService.js';
import RouteHandlerService from './services/routeHandlerService.js';
import { ResponseCode, ResponseMessage, formatResponse } from './common/GlobalConstants.js';
import config from './resource/application.js';

// Appwrite 函数入口
export default async ({ req, res, log, error }) => {
  try {
    // 创建日志服务
    const logger = { log, error };

    // 日志记录
    logger.log('环境:', config.server.environment);
    logger.log('请求路径:', req.path);
    logger.log('请求方法:', req.method);
    logger.log('请求体:', JSON.stringify(req.body));
    
    // 初始化 Appwrite 客户端
    const client = new Client()
      .setEndpoint(config.appwrite.endpoint)
      .setProject(config.appwrite.projectId)
      .setKey(config.appwrite.apiKey);

    // 依赖注入
    const userRepository = new UserRepository(client);
    const userService = new UserService(userRepository);
    const fileService = new FileService();

    // 初始化路由处理器
    const routeHandler = new RouteHandlerService(userService, fileService, logger);

    // 获取对应的处理器
    const handler = routeHandler.getHandler(req.path, req.method);

    if (handler) {
      // 执行处理器
      return await handler(req, res);
    }

    // 默认响应
    return res.json(formatResponse(
      ResponseCode.NOT_FOUND,
      ResponseMessage.NOT_FOUND
    ));
  } catch (err) {
    error(`服务器错误: ${err.message}`);
    return res.json(formatResponse(
      ResponseCode.ERROR,
      ResponseMessage.SERVER_ERROR,
      { error: err.message }
    ));
  }
}; 