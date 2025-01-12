import { ResponseCode, ResponseMessage, formatResponse, HttpStatus } from '../common/GlobalConstants.js';
import RequestContext from '../common/RequestContext.js';
import ResponseDTO from '../models/ResponseDTO.js';

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
      return ResponseDTO.success(config);
    } catch (error) {
      context.error(`获取引导页配置失败: ${error.message}`);
      return ResponseDTO.serverError(error.message);
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
        return ResponseDTO.businessError(ResponseCode.ERROR, '请求体必须是数组格式');
      }

      // 验证数组不为空
      if (configs.length === 0) {
        return ResponseDTO.businessError(ResponseCode.ERROR, '配置数组不能为空');
      }

      // 验证每个配置项
      for (const config of configs) {
        const { key, value } = config;
        
        // 验证必要字段
        if (!key || !value) {
          return ResponseDTO.businessError(ResponseCode.ERROR, '配置项必须包含 key 和 value 字段');
        }

        // 验证字段类型
        if (typeof key !== 'string' || typeof value !== 'string') {
          return ResponseDTO.businessError(ResponseCode.ERROR, 'key 和 value 必须是字符串类型');
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
      return ResponseDTO.success({ configs: results });
    } catch (error) {
      context.error(`添加配置失败: ${error.message}`);
      return ResponseDTO.serverError(error.message);
    }
  }
}

export default ConfigController; 