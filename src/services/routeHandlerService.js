import { Routes, HttpMethod } from '../constants/routes.js';
import AuthController from '../controllers/AuthController.js';
import FileController from '../controllers/FileController.js';
import UserController from '../controllers/UserController.js';

class RouteHandlerService {
  constructor(userService, fileService, logger) {
    this.logger = logger;
    
    // 初始化控制器
    this.authController = new AuthController(userService, logger);
    this.fileController = new FileController(fileService, logger);
    this.userController = new UserController(userService, logger);

    // 初始化路由处理器映射
    this.routeHandlers = new Map([
      [{
        path: Routes.REGISTER_BY_EMAIL,
        method: HttpMethod.POST
      }, this.authController.handleRegisterByEmail.bind(this.authController)],
      
      [{
        path: Routes.REGISTER_BY_DEVICE,
        method: HttpMethod.POST
      }, this.authController.handleRegisterByDevice.bind(this.authController)],

      [{
        path: Routes.LOGIN,
        method: HttpMethod.POST
      }, this.authController.handleLogin.bind(this.authController)],
      
      [{
        path: Routes.GET_USER,
        method: HttpMethod.GET
      }, this.authController.handleGetCurrentUser.bind(this.authController)],
      
      [{
        path: Routes.LIST_USERS,
        method: HttpMethod.GET
      }, this.userController.handleListUsers.bind(this.userController)],
      
      [{
        path: Routes.PING,
        method: HttpMethod.GET
      }, this.userController.handlePing.bind(this.userController)],
      
      [{
        path: Routes.FILE_UPLOAD,
        method: HttpMethod.POST
      }, this.fileController.handleFileUpload.bind(this.fileController)],
      
      [{
        path: Routes.FILE_DELETE,
        method: HttpMethod.DELETE
      }, this.fileController.handleFileDelete.bind(this.fileController)],
      
      [{
        path: Routes.FILE_URL,
        method: HttpMethod.GET
      }, this.fileController.handleGetFileUrl.bind(this.fileController)]
    ]);
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