import express from 'express';
import bodyParser from 'body-parser';
import mainHandler from './main.js';
import config from './resource/application.js';

const app = express();

// 中间件配置
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 日志中间件
const logger = (req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
};

app.use(logger);

// 路由处理
app.all('*', async (req, res) => {
  try {
    // 构造 Appwrite 风格的请求上下文
    const context = {
      req: {
        path: req.path,
        method: req.method,
        body: req.body,
        headers: req.headers
      },
      res: {
        json: (data, status = 200) => {
          res.status(status).json(data);
        }
      },
      log: (message) => {
        console.log(`[LOG] ${message}`);
      },
      error: (message) => {
        console.error(`[ERROR] ${message}`);
      }
    };

    // 调用主处理函数
    await mainHandler(context);
  } catch (error) {
    console.error('Server Error:', error);
    res.status(500).json({
      code: -1,
      msg: 'Internal Server Error',
      error: error.message
    });
  }
});

// 启动服务器
const PORT = process.env.PORT || config.server.port || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${config.server.environment}`);
  console.log('API endpoints:');
  console.log('- POST /auth/login         - 用户登录');
  console.log('- POST /auth/register/email - 邮箱注册');
  console.log('- POST /auth/register/device - 设备注册');
  console.log('- GET  /auth/user          - 获取当前用户');
  console.log('- POST /auth/logout        - 用户登出');
  console.log('- GET  /config/guide       - 获取引导页配置');
  console.log('- POST /c/r/add           - 添加配置');
}); 