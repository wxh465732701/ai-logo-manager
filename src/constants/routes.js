// 路由枚举
export const Routes = {
  // auth
  REGISTER_BY_EMAIL: '/auth/register/email',
  REGISTER_BY_DEVICE: '/auth/register/device',
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',

  // user
  GET_USER: '/auth/user',

  // config
  GET_GUIDE_CONFIG: '/config/guide',
  ADD_CONFIG: '/c/r/add',

  // file
  FILE_UPLOAD: '/files/upload',

  // ping
  PING: '/ping'
};

// HTTP 方法枚举
export const HttpMethod = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE'
};

// 公开路由配置
export const PublicRoutes = [
  Routes.REGISTER_BY_EMAIL,
  Routes.REGISTER_BY_DEVICE,
  Routes.LOGIN,
  Routes.PING,
  Routes.GET_GUIDE_CONFIG,
  Routes.ADD_CONFIG
];

// 检查是否是公开路由
export const isPublicRoute = (path) => PublicRoutes.includes(path); 