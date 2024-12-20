import { ResponseCode, ResponseMessage, formatResponse, HttpStatus } from '../common/GlobalConstants.js';

class ConfigController {
  constructor(configService) {
    this.configService = configService;
  }

  /**
   * 处理获取引导页配置请求
   * @param {RequestContext} context - 请求上下文
   * @returns {Promise<Object>} 响应结果
   */
  async handleGetGuideConfig(context) {
    try {
      const config = await this.configService.getGuideConfig();
      context.log('获取引导页配置成功');
      return context.getResponse().json(formatResponse(
        ResponseCode.SUCCESS,
        ResponseMessage.SUCCESS,
        config
      ));
    } catch (error) {
      context.error(`获取引导页配置失败: ${error.message}`);
      return context.getResponse().status(HttpStatus.INTERNAL_ERROR).json(formatResponse(
        ResponseCode.ERROR,
        error.message
      ));
    }
  }
}

export default ConfigController; 