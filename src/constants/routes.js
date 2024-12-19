// 路由枚举
export const Routes = {
  REGISTER_BY_EMAIL: '/auth/register/email',
  REGISTER_BY_DEVICE: '/auth/register/device',
  LOGIN: '/auth/login',
  GET_USER: '/auth/user',
  LIST_USERS: '/users/list',
  PING: '/ping',
  FILE_UPLOAD: '/files/upload',
  FILE_DELETE: '/files/:fileKey',
  FILE_URL: '/files/:fileKey/url'
};

// HTTP 方法枚举
export const HttpMethod = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE'
}; 