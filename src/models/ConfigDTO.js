/**
 * 配置数据传输对象
 */
class ConfigDTO {
  constructor(data) {
    this.config_id = data.config_id || data.$id || '';
    this.key = data.key || '';
    this.value = data.value || '';
    this.create_time = data.create_time || data.$createdAt || new Date();
    this.update_time = data.update_time || data.$updatedAt || new Date();
  }

  /**
   * 转换为JSON对象
   * @returns {Object} JSON对象
   */
  toJSON() {
    return {
      config_id: this.config_id,
      key: this.key,
      value: this.value,
      create_time: this.create_time,
      update_time: this.update_time
    };
  }

  /**
   * 转换为API响应格式
   * @returns {Object} API响应对象
   */
  toResponse() {
    return {
      key: this.key,
      value: this.value,
      createTime: this.create_time,
      updateTime: this.update_time
    };
  }

  /**
   * 转换为引导页图片格式
   * @returns {Object} 引导页图片对象
   */
  toGuideImage() {
    return {
      imageUrl: this.value,
      updateTime: this.update_time,
      createTime: this.create_time
    };
  }
}

export default ConfigDTO;
