import { DataType, TypeChecker } from '../common/types/BaseTypes.js';
import { Regex } from '../common/GlobalConstants.js';
import { GlobalConstants, UserType, UserSource } from '../common/GlobalConstants.js';

// 用户数据传输对象
export class UserInfoDTO {
  constructor(data = {}) {
    this.user_id = data.user_id || '';
    this.email = data.email || '';
    this.password = data.password || '';
    this.user_name = data.user_name || '';
    this.status = data.status || UserStatus.ACTIVE;
    this.source_type = data.source_type || UserSource.IOS;
    this.device_id = data.device_id || '';
    this.user_type = data.user_type || UserType.USER;
    this.create_time = data.create_time || new Date();
    this.update_time = data.update_time || new Date();
    this.update_user = data.update_user || GlobalConstants.SYSTEM_USER;
  }

  // 验证方法
  validate() {
    const errors = [];

    // 验证必填字段
    if (TypeChecker.isEmpty(this.email)) {
      errors.push('Email is required');
    }
    if (TypeChecker.isEmpty(this.password)) {
      errors.push('Password is required');
    }

    // 验证邮箱格式
    if (!TypeChecker.isEmpty(this.email) && !Regex.EMAIL.test(this.email)) {
      errors.push('Invalid email format');
    }

    // 验证密码强度
    if (!TypeChecker.isEmpty(this.password) && !Regex.PASSWORD.test(this.password)) {
      errors.push('Password must contain at least 8 characters, including uppercase, lowercase, numbers and special characters');
    }

    // 验证状态值
    if (![-1, 0, 1].includes(this.status)) {
      errors.push('Invalid status value');
    }

    // 验证用户类型
    if (![0, 1, 2].includes(this.user_type)) {
      errors.push('Invalid user type');
    }

    // 验证时间格式
    if (!(this.create_time instanceof Date)) {
      errors.push('Invalid create time format');
    }
    if (!(this.update_time instanceof Date)) {
      errors.push('Invalid update time format');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // 转换为JSON
  toJSON() {
    return {
      user_id: this.user_id,
      email: this.email,
      user_name: this.user_name,
      status: this.status,
      source_type: this.source_type,
      device_id: this.device_id,
      user_type: this.user_type,
      create_time: this.create_time.toISOString(),
      update_time: this.update_time.toISOString(),
      update_user: this.update_user
    };
  }

  // 从JSON创建实例
  static fromJSON(json) {
    return new UserInfoDTO({
      ...json,
      create_time: new Date(json.create_time),
      update_time: new Date(json.update_time)
    });
  }
}

// 用户登录请求DTO
export class UserLoginDTO {
  constructor(data = {}) {
    this.email = data.email;
    this.password = data.password;
  }

  validate() {
    const errors = [];

    if (TypeChecker.isEmpty(this.email)) {
      errors.push('Email is required');
    }
    if (TypeChecker.isEmpty(this.password)) {
      errors.push('Password is required');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
} 