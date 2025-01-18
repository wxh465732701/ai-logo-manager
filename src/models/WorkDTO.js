import { GlobalConstants } from '../common/GlobalConstants.js';

// 作品状态常量
export const WorkStatus = {
  LOCKED: 0,    // 未解锁
  UNLOCKED: 1   // 已解锁
};

// 作品类型常量
export const WorkType = {
  LOGO: 0,     // logo
  BANNER: 1,   // banner
  ICON: 2      // icon
};

// 作品数据传输对象
export class WorkDTO {
  constructor(data = {}) {
    this.work_id = data.work_id || '';
    this.user_id = data.user_id || '';
    this.work_feature_id = data.work_feature_id || '';
    this.work_status = data.work_status || WorkStatus.LOCKED;
    this.work_type = data.work_type || WorkType.LOGO;
    this.work_name = data.work_name || '';
    this.work_description = data.work_description || '';
    this.create_time = data.create_time || new Date();
    this.update_time = data.update_time || new Date();
  }

  validate() {
    const errors = [];

    if (!this.user_id) {
      errors.push('用户ID不能为空');
    }

    if (!this.work_feature_id) {
      errors.push('作品特征ID不能为空');
    }

    if (![WorkType.LOGO, WorkType.BANNER, WorkType.ICON].includes(this.work_type)) {
      errors.push('无效的作品类型');
    }

    if (!this.work_name) {
      errors.push('作品名称不能为空');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  toJSON() {
    return {
      work_id: this.work_id,
      user_id: this.user_id,
      work_feature_id: this.work_feature_id,
      work_status: this.work_status,
      work_type: this.work_type,
      work_name: this.work_name,
      work_description: this.work_description,
      create_time: this.create_time.toISOString(),
      update_time: this.update_time.toISOString()
    };
  }

  static fromJSON(json) {
    return new WorkDTO({
      ...json,
      create_time: new Date(json.create_time),
      update_time: new Date(json.update_time)
    });
  }
}

// 作品特征数据传输对象
export class WorkFeatureDTO {
  constructor(data = {}) {
    this.feature_id = data.feature_id || '';
    this.user_id = data.user_id || '';
    this.industry = data.industry || '';
    this.brand_name = data.brand_name || '';
    this.slogan = data.slogan || '';
    this.key_words = data.key_words || '';
    this.key_word_description = data.key_word_description || '';
    this.logo_style = data.logo_style || '';
    this.logo_domain = data.logo_domain || '';
    this.logo_color = data.logo_color || '';
    this.visibility = data.visibility || 0; // 0:公开 1:私密
    this.create_time = data.create_time || new Date();
    this.update_time = data.update_time || new Date();
  }

  validate() {
    const errors = [];

    if (!this.user_id) {
      errors.push('用户ID不能为空');
    }

    if (!this.brand_name) {
      errors.push('品牌名称不能为空');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  toJSON() {
    return {
      feature_id: this.feature_id,
      user_id: this.user_id,
      industry: this.industry,
      brand_name: this.brand_name,
      slogan: this.slogan,
      key_words: this.key_words,
      key_word_description: this.key_word_description,
      logo_style: this.logo_style,
      logo_domain: this.logo_domain,
      logo_color: this.logo_color,
      visibility: this.visibility,
      create_time: this.create_time.toISOString(),
      update_time: this.update_time.toISOString()
    };
  }

  static fromJSON(json) {
    return new WorkFeatureDTO({
      ...json,
      create_time: new Date(json.create_time),
      update_time: new Date(json.update_time)
    });
  }
}

// 作品图片数据传输对象
export class WorkImageDTO {
  constructor(data = {}) {
    this.image_id = data.image_id || '';
    this.user_id = data.user_id || '';
    this.work_id = data.work_id || '';
    this.image_type = data.image_type || 0; // 0:png 1:svg 2:jpeg 3:gif 4:webp
    this.image_url = data.image_url || '';
    this.create_time = data.create_time || new Date();
    this.update_time = data.update_time || new Date();
  }

  validate() {
    const errors = [];

    if (!this.user_id) {
      errors.push('用户ID不能为空');
    }

    if (!this.work_id) {
      errors.push('作品ID不能为空');
    }

    if (!this.image_url) {
      errors.push('图片URL不能为空');
    }

    if (![0, 1, 2, 3, 4].includes(this.image_type)) {
      errors.push('无效的图片类型');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  toJSON() {
    return {
      image_id: this.image_id,
      user_id: this.user_id,
      work_id: this.work_id,
      image_type: this.image_type,
      image_url: this.image_url,
      create_time: this.create_time.toISOString(),
      update_time: this.update_time.toISOString()
    };
  }

  static fromJSON(json) {
    return new WorkImageDTO({
      ...json,
      create_time: new Date(json.create_time),
      update_time: new Date(json.update_time)
    });
  }
}

// 作品收藏数据传输对象
export class WorkFavoriteDTO {
  constructor(data = {}) {
    this.favorite_id = data.favorite_id || '';
    this.user_id = data.user_id || '';
    this.work_id = data.work_id || '';
    this.create_time = data.create_time || new Date();
  }

  validate() {
    const errors = [];

    if (!this.user_id) {
      errors.push('用户ID不能为空');
    }

    if (!this.work_id) {
      errors.push('作品ID不能为空');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  toJSON() {
    return {
      favorite_id: this.favorite_id,
      user_id: this.user_id,
      work_id: this.work_id,
      create_time: this.create_time.toISOString()
    };
  }

  static fromJSON(json) {
    return new WorkFavoriteDTO({
      ...json,
      create_time: new Date(json.create_time)
    });
  }
} 