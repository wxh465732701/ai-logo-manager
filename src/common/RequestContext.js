/**
 * 请求上下文类
 * 用于统一管理请求相关的内容
 */
class RequestContext {
  constructor(req, res, logger, error) {
    this.req = req;
    this.res = res;
    this.logger = logger;
    this.error = error;
    this.startTime = Date.now();
  }

  /**
   * 获取请求对象
   */
  getRequest() {
    return this.req;
  }

  /**
   * 获取响应对象
   */
  getResponse() {
    return this.res;
  }

  /**
   * 获取日志对象
   */
  getLogger() {
    return this.logger;
  }

  /**
   * 获取错误对象
   */
  getError() {
    return this.error;
  }

  /**
   * 获取请求开始时间
   */
  getStartTime() {
    return this.startTime;
  }

  /**
   * 获取请求处理时长（毫秒）
   */
  getProcessTime() {
    return Date.now() - this.startTime;
  }

  /**
   * 记录日志
   * @param {string} message - 日志消息
   */
  log(message) {
    this.logger.log(`[${this.req.path}] ${message}`);
  }

  /**
   * 记录错误日志
   * @param {string} message - 错误消息
   */
  error(message) {
    this.logger.error(`[${this.req.path}] ${message}`);
  }

  /**
   * 获取请求头
   * @param {string} name - 请求头名称
   */
  getHeader(name) {
    return this.req.headers[name];
  }

  /**
   * 获取请求参数
   * @param {string} name - 参数名称
   */
  getParam(name) {
    return this.req.params[name];
  }

  /**
   * 获取查询参数
   * @param {string} name - 参数名称
   */
  getQuery(name) {
    return this.req.query[name];
  }

  /**
   * 获取请求体
   */
  getBody() {
    return this.req.body;
  }

  /**
   * 获取当前用户
   */
  getUser() {
    return this.req.user;
  }
}

export default RequestContext; 