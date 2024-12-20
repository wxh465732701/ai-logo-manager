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
      return configs;
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
      const configs = await this.getConfig('GUIDE_HOME_IMAGE');
      return {
        images: configs.map(config => ({
          imageUrl: config.config_value,
          updateTime: config.update_time,
          createTime: config.create_time
        }))
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
        if (!acc[config.config_key]) {
          acc[config.config_key] = [];
        }
        acc[config.config_key].push({
          value: config.config_value,
          updateTime: config.update_time,
          createTime: config.create_time
        });
        return acc;
      }, {});

      return groupedConfigs;
    } catch (error) {
      throw new Error(`批量获取配置失败: ${error.message}`);
    }
  }
}

export default ConfigService; 