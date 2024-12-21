import { Client } from 'node-appwrite';
import UserRepository from '../repositories/userRepository.js';
import UserService from '../services/userService.js';
import UserTokenService from '../services/UserTokenService.js';
import FileService from '../services/fileService.js';
import RouteHandlerService from '../services/routeHandlerService.js';
import ConfigRepository from '../repositories/ConfigRepository.js';
import ConfigService from '../services/ConfigService.js';
import config from '../resource/application.js';
import SessionRepository from '../repositories/sessionRepository.js';
/**
 * 服务容器类
 * 用于管理服务实例的生命周期
 */
class ServiceContainer {
  constructor() {
    if (!ServiceContainer.instance) {
      this.initialize();
      ServiceContainer.instance = this;
    }
    return ServiceContainer.instance;
  }

  /**
   * 初始化服务容器
   * @private
   */
  initialize() {
    // 初始化 Appwrite 客户端
    this.client = new Client()
      .setEndpoint(config.appwrite.endpoint)
      .setProject(config.appwrite.projectId)
      .setKey(config.appwrite.apiKey);

    // 初始化服务
    this.initializeServices();
  }

  /**
   * 初始化所有服务
   * @private
   */
  initializeServices() {
    // 存储服务实例
    this.services = {
      userRepository: null,
      userService: null,
      userTokenService: null,
      fileService: null,
      configRepository: null,
      configService: null,
      routeHandler: null,
      sessionRepository: null
      };
  }

  /**
   * 获取用户仓库服务
   * @returns {UserRepository}
   */
  getUserRepository() {
    if (!this.services.userRepository) {
      this.services.userRepository = new UserRepository(this.client);
    }
    return this.services.userRepository;
  }

  /**
   * 获取用户服务
   * @returns {UserService}
   */
  getUserService() {
    if (!this.services.userService) {
      this.services.userService = new UserService(this.getUserRepository(), this.getUserTokenService());
    }
    return this.services.userService;
  }

  /**
   * 获取用户令牌服务
   * @returns {UserTokenService}
   */
  getUserTokenService() {
    if (!this.services.userTokenService) {
      this.services.userTokenService = new UserTokenService(this.getUserRepository(), this.getSessionRepository());
    }
    return this.services.userTokenService;
  }

  /**
   * 获取会话仓库服务
   * @returns {SessionRepository}
   */
  getSessionRepository() {
    if (!this.services.sessionRepository) {
      this.services.sessionRepository = new SessionRepository(this.client);
    }
    return this.services.sessionRepository;
  }

  /**
   * 获取文件服务
   * @returns {FileService}
   */
  getFileService() {
    if (!this.services.fileService) {
      this.services.fileService = new FileService();
    }
    return this.services.fileService;
  }

  /**
   * 获取配置仓库服务
   * @returns {ConfigRepository}
   */
  getConfigRepository() {
    if (!this.services.configRepository) {
      this.services.configRepository = new ConfigRepository(this.client);
    }
    return this.services.configRepository;
  }

  /**
   * 获取配置服务
   * @returns {ConfigService}
   */
  getConfigService() {
    if (!this.services.configService) {
      this.services.configService = new ConfigService(this.getConfigRepository());
    }
    return this.services.configService;
  }

  /**
   * 获取路由处理器服务
   * @returns {RouteHandlerService}
   */
  getRouteHandler() {
    if (!this.services.routeHandler) {
      this.services.routeHandler = new RouteHandlerService(
        this.getUserService(),
        this.getFileService(),
        this.getConfigService()
      );
    }
    return this.services.routeHandler;
  }

  /**
   * 重置服务容器
   * 用于测试或需要重新初始化的场景
   */
  static reset() {
    ServiceContainer.instance = null;
  }
}

// 导出单例实例
export default new ServiceContainer(); 