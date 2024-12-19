// HTTP 状态码
export const HttpStatus = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_ERROR: 500
};

// 响应码
export const ResponseCode = {
  SUCCESS: 0,
  ERROR: -1,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404
};

// 响应消息
export const ResponseMessage = {
  SUCCESS: 'success',
  ERROR: 'error',
  UNAUTHORIZED: 'unauthorized',
  FORBIDDEN: 'forbidden',
  NOT_FOUND: 'not found',
  INVALID_PARAMS: 'invalid parameters',
  SERVER_ERROR: 'server error'
};

// 用户状态
export const UserStatus = {
  ACTIVE: 1,
  INACTIVE: 0,
  SUSPENDED: -1
};

// 用户类型
export const UserType = {
  NORMAL: 0,
  ADMIN: 1,
  SUPER_ADMIN: 2
};

// 用户来源
export const UserSource = {
  IOS: 0,
  ANDROID: 1,
  WEB: 2
};

// 文件类型
export const FileType = {
  IMAGE: 'image',
  VIDEO: 'video',
  DOCUMENT: 'document',
  AUDIO: 'audio'
};

// 文件大小限制
export const FileSizeLimit = {
  IMAGE: 5 * 1024 * 1024, // 5MB
  VIDEO: 50 * 1024 * 1024, // 50MB
  DOCUMENT: 10 * 1024 * 1024, // 10MB
  AUDIO: 20 * 1024 * 1024 // 20MB
};

// 分页默认值
export const Pagination = {
  DEFAULT_PAGE_SIZE: 25,
  MAX_PAGE_SIZE: 100,
  DEFAULT_PAGE: 1
};

// 时间相关常量
export const Time = {
  SECOND: 1,
  MINUTE: 60,
  HOUR: 3600,
  DAY: 86400,
  WEEK: 604800,
  MONTH: 2592000 // 30天
};

// 正则表达式
export const Regex = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  PHONE: /^1[3456789]\d{9}$/,
  URL: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/
};

// 环境变量
export const Environment = {
  DEVELOPMENT: 'development',
  PRODUCTION: 'production',
  TEST: 'test'
};

// 缓存键前缀
export const CachePrefix = {
  USER: 'user:',
  TOKEN: 'token:',
  FILE: 'file:'
};

// 响应格式化
export const formatResponse = (code = ResponseCode.SUCCESS, msg = ResponseMessage.SUCCESS, data = null) => {
  return {
    code,
    msg,
    data,
    timestamp: Date.now()
  };
}; 

export const GlobalConstants = {
    SYSTEM_USER: 'system_user'
}