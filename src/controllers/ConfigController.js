import { ResponseCode, ResponseMessage, formatResponse, HttpStatus } from '../common/GlobalConstants.js';
import RequestContext from '../common/RequestContext.js';

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
      return context.getResponse().json(formatResponse(
        ResponseCode.ERROR,
        error.message
      ), HttpStatus.INTERNAL_ERROR);
    }
  }

  /**
   * 处理添加引导页配置请求
   * @param {RequestContext} context - 请求上下文
   * @returns {Promise<Object>} 响应结果
   */
  async handleAddConfigs(context) {
    try {
      const configs = context.getRequest().body;

      // 验证请求体是否为数组
      if (!Array.isArray(configs)) {
        return context.getResponse().json(formatResponse(
          ResponseCode.ERROR,
          '请求体必须是数组格式'
        ), HttpStatus.BAD_REQUEST);
      }

      // 验证数组不为空
      if (configs.length === 0) {
        return context.getResponse().json(formatResponse(
          ResponseCode.ERROR,
          '配置数组不能为空'
        ), HttpStatus.BAD_REQUEST);
      }

      // 验证每个配置项
      for (const config of configs) {
        const { key, value } = config;
        
        // 验证必要字段
        if (!key || !value) {
          return context.getResponse().json(formatResponse(
            ResponseCode.ERROR,
            '配置项必须包含 key 和 value 字段'
          ), HttpStatus.BAD_REQUEST);
        }

        // 验证字段类型
        if (typeof key !== 'string' || typeof value !== 'string') {
          return context.getResponse().json(formatResponse(
            ResponseCode.ERROR,
            'key 和 value 必须是字符串类型'
          ), HttpStatus.BAD_REQUEST);
        }
      }

      // 批量添加配置
      const results = [];
      for (const config of configs) {
        const { key, value } = config;
        const result = await this.configService.addConfig(key, value);
        results.push(result);
      }

      context.log('配置添加成功');
      return context.getResponse().json(formatResponse(
        ResponseCode.SUCCESS,
        ResponseMessage.SUCCESS,
        { configs: results }
      ));
    } catch (error) {
      context.error(`添加配置失败: ${error.message}`);
      return context.getResponse().json(formatResponse(
        ResponseCode.ERROR,
        error.message
      ), HttpStatus.INTERNAL_ERROR);
    }
  }
}

export default ConfigController; 