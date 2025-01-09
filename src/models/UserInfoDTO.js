import { DataType, TypeChecker } from '../common/types/BaseTypes.js';
import { Regex } from '../common/GlobalConstants.js';
import { GlobalConstants, UserType, UserSource, UserStatus } from '../common/GlobalConstants.js';

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
    this.user_type = data.user_type || UserType.NORMAL;
    this.create_time = data.create_time || new Date();
    this.update_time = data.update_time || new Date();
    this.update_user = data.update_user || GlobalConstants.SYSTEM_USER;
  }

  /**
   * 验证用户数据
   * @param {string} [validationType] - 验证类型：'email' - 邮箱验证，'device' - 设备验证，不传则验证任一方式
   * @returns {Object} 验证结果
   */
  validate(validationType) {
    const errors = [];

    // 根据验证类型检查必填字段
    if (validationType === 'email') {
      // 邮箱登录验证
      if (TypeChecker.isEmpty(this.email)) {
        errors.push('Email is required');
      }
      if (TypeChecker.isEmpty(this.password)) {
        errors.push('Password is required');
      }
    } else if (validationType === 'device') {
      // 设备登录验证
      if (TypeChecker.isEmpty(this.device_id)) {
        errors.push('Device ID is required');
      }
    } else {
      // 默认验证：邮箱+密码 或 设备ID 必须存在其一
      if (TypeChecker.isEmpty(this.device_id) && 
          (TypeChecker.isEmpty(this.email) || TypeChecker.isEmpty(this.password))) {
        errors.push('Either email and password or device ID is required');
      }
    }

    // 如果有邮箱，验证邮箱格式
    if (!TypeChecker.isEmpty(this.email) && !Regex.EMAIL.test(this.email)) {
      errors.push('Invalid email format');
    }

    // 如果有密码，验证密码强度
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
    this.device_id = data.device_id;
    this.login_type = data.login_type;
  }

  validate() {
    const errors = [];

    if (this.login_type === 'email') {
      if (TypeChecker.isEmpty(this.email)) {
        errors.push('Email is required');
      }
      if (TypeChecker.isEmpty(this.password)) {
        errors.push('Password is required');
      }
    } else if (this.login_type === 'device') {
      if (TypeChecker.isEmpty(this.device_id)) {
        errors.push('Device ID is required');
      }
    } else {
      errors.push('Invalid login type');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
} 