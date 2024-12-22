import { ConfigKey } from '../common/GlobalConstants.js';

class ConfigService {
  constructor(configRepository) {
    this.configRepository = configRepository;
  }

  /**
   * 获取指定key的配置
   * @param {string} key - 配置键
   * @returns {Promise<Object[]>} 配置信息集合
   */
  async getConfig(key) {
    try {
      const configs = await this.configRepository.findConfigByKey(key);
      if (!configs || configs.length === 0) {
        throw new Error(`配置不存在: ${key}`);
      }
      return configs.map(config => config.toResponse());
    } catch (error) {
      throw new Error(`获取配置失败: ${error.message}`);
    }
  }

  /**
   * 获取引导页配置
   * @returns {Promise<Object>} 引导页配置信息
   */
  async getGuideConfig() {
    try {
      const configs = await this.getConfigs([ConfigKey.GUIDE_HOME_IMAGE, ConfigKey.GUIDE_THIRD_PARTY_IMAGE]);
      
      // 初始化默认值
      const homeImages = [];
      const thirdPartyImages = [];

      // 处理主页图片
      if (configs[ConfigKey.GUIDE_HOME_IMAGE]) {
        homeImages.push(...configs[ConfigKey.GUIDE_HOME_IMAGE].map(config => config.toGuideImage()));
      }

      // 处理第三方图片
      if (configs[ConfigKey.GUIDE_THIRD_PARTY_IMAGE]) {
        thirdPartyImages.push(...configs[ConfigKey.GUIDE_THIRD_PARTY_IMAGE].map(config => config.toGuideImage()));
      }

      return {
        homeImages,
        thirdPartyImages
      };
    } catch (error) {
      throw new Error(`获取引导页配置失败: ${error.message}`);
    }
  }

  /**
   * 批量获取配置
   * @param {string[]} keys - 配置键数组
   * @returns {Promise<Object>} 配置信息映射
   */
  async getConfigs(keys) {
    try {
      const configs = await this.configRepository.findConfigsByKeys(keys);
      // 按键分组
      const groupedConfigs = configs.reduce((acc, config) => {
        if (!acc[config.key]) {
          acc[config.key] = [];
        }
        acc[config.key].push(config);
        return acc;
      }, {});

      return groupedConfigs;
    } catch (error) {
      throw new Error(`批量获取配置失败: ${error.message}`);
    }
  }

  /**
   * 添加配置
   * @param {string} key - 配置键
   * @param {string} value - 配置值
   * @returns {Promise<Object>} 配置信息
   */
  async addConfig(key, value) {
    try {
      // 验证 key 的格式
      if (!Object.values(ConfigKey).includes(key)) {
        throw new Error(`无效的配置键: ${key}`);
      }

      // 验证 value 的格式（根据不同的 key 可能有不同的验证规则）
      if (key === ConfigKey.GUIDE_HOME_IMAGE || key === ConfigKey.GUIDE_THIRD_PARTY_IMAGE) {
        try {
          new URL(value);
        } catch (e) {
          throw new Error(`无效的图片 URL: ${value}`);
        }
      }

      // 添加配置
      const config = await this.configRepository.addConfig(key, value);
      return config.toResponse();
    } catch (error) {
      throw new Error(`添加配置失败: ${error.message}`);
    }
  }
}

export default ConfigService; 