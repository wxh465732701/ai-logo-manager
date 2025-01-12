import { Routes, HttpMethod } from '../constants/routes.js';
import AuthController from '../controllers/AuthController.js';
import FileController from '../controllers/FileController.js';
import UserController from '../controllers/UserController.js';
import ConfigController from '../controllers/ConfigController.js';
import UserExtendController from '../controllers/UserExtendController.js';
import { formatResponse, ResponseCode, ResponseMessage } from '../common/GlobalConstants.js';


class RouteHandlerService {
  constructor(userService, fileService, configService, userExtendService) {
    // 初始化控制器
    this.authController = new AuthController(userService);
    this.fileController = new FileController(fileService);
    this.userController = new UserController(userService);
    this.configController = new ConfigController(configService);
    this.userExtendController = new UserExtendController(userExtendService);

    // 初始化路由处理器映射
    this.routeHandlers = new Map([
      [{
        path: Routes.REGISTER_BY_EMAIL,
        method: HttpMethod.POST
      }, (context) => this.authController.handleRegisterByEmail(context)],
      
      [{
        path: Routes.REGISTER_BY_DEVICE,
        method: HttpMethod.POST
      }, (context) => this.authController.handleRegisterByDevice(context)],

      [{
        path: Routes.LOGIN,
        method: HttpMethod.POST
      }, (context) => this.authController.handleLogin(context)],

      [{
        path: Routes.LOGOUT,
        method: HttpMethod.POST
      }, (context) => this.authController.handleLogout(context)],
      
      [{
        path: Routes.GET_USER,
        method: HttpMethod.GET
      }, (context) => this.authController.handleGetCurrentUser(context)],
      
      [{
        path: Routes.GET_GUIDE_CONFIG,
        method: HttpMethod.GET
      }, (context) => this.configController.handleGetGuideConfig(context)],
      
      [{
        path: Routes.ADD_CONFIG,
        method: HttpMethod.POST
      }, (context) => this.configController.handleAddConfigs(context)],

      [{
        path: Routes.PING,
        method: HttpMethod.GET
      }, (context) => this.userController.handlePing(context)],
      
      [{
        path: Routes.FILE_UPLOAD,
        method: HttpMethod.POST
      }, (context) => this.fileController.handleFileUpload(context)],

      // 用户扩展相关路由
      [{
        path: Routes.UPDATE_USER_BASE,
        method: HttpMethod.POST
      }, (context) => this.userExtendController.handleUpdateUserBase(context)],

    ]);
  }

  /**
   * 处理请求
   * @param {RequestContext} context - 请求上下文
   * @returns {Promise<void>}
   */
  async handleRequest(context) {
    const handler = this.getHandler(context.getRequest().path, context.getRequest().method);
    
    if (handler) {
      try{
        const response = await handler(context);
        if (response) {
          return response;
        }
      } catch (error) {
        context.log(`error: ${error.message}`);
        return context.getResponse().json(formatResponse(
          ResponseCode.ERROR,
          ResponseMessage.SERVER_ERROR,
          { message: error.message }
        ));
      }
    }

    return context.getResponse().json(formatResponse(
      ResponseCode.NOT_FOUND,
      ResponseMessage.NOT_FOUND
    ));
  }

  // 获取路由处理器
  getHandler(path, method) {
    for (const [route, handler] of this.routeHandlers) {
      if (this.matchRoute(route.path, path) && route.method === method) {
        return handler;
      }
    }
    return null;
  }

  // 路由匹配（支持参数）
  matchRoute(routePath, requestPath) {
    const routeParts = routePath.split('/');
    const requestParts = requestPath.split('/');

    if (routeParts.length !== requestParts.length) {
      return false;
    }

    return routeParts.every((part, index) => {
      return part.startsWith(':') || part === requestParts[index];
    });
  }
}

export default RouteHandlerService; 