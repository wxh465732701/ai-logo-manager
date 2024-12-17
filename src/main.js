import { Client, Users, Account } from 'node-appwrite';

// Appwrite 函数入口
export default async ({ req, res, log, error }) => {
  try {
    log('Appwrite 函数入口');
    // 初始化 Appwrite 客户端
    const client = new Client()
      .setEndpoint(process.env.APPWRITE_FUNCTION_API_ENDPOINT)
      .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
      .setKey(req.headers['x-appwrite-key'] ?? '');

    // 初始化 Users 和 Account 服务
    const users = new Users(client);
    const account = new Account(client);

    // 路由处理
    switch (req.path) {
      case '/auth/register':
        if (req.method !== 'POST') {
          return res.json({ error: '方法不允许' }, 405);
        }
        try {
          const { email, password, name } = req.body;
          if (!email || !password || !name) {
            return res.json({ error: '邮箱、密码和用户名都是必需的' }, 400);
          }
          const user = await account.create('unique()', email, password, name);
          log(`用户注册成功: ${user.$id}`);
          return res.json({ message: '注册成功', user });
        } catch (err) {
          error(`注册错误: ${err.message}`);
          return res.json({ error: err.message }, 500);
        }

      case '/auth/login':
        if (req.method !== 'POST') {
          return res.json({ error: '方法不允许' }, 405);
        }
        try {
          const { email, password } = req.body;
          if (!email || !password) {
            return res.json({ error: '邮箱和密码都是必需的' }, 400);
          }
          const session = await account.createEmailSession(email, password);
          log(`用户登录成功: ${session.userId}`);
          return res.json({ message: '登录成功', session });
        } catch (err) {
          error(`登录错误: ${err.message}`);
          return res.json({ error: err.message }, 401);
        }

      case '/auth/user':
        if (req.method !== 'GET') {
          return res.json({ error: '方法不允许' }, 405);
        }
        try {
          const user = await account.get();
          return res.json(user);
        } catch (err) {
          error(`获取用户信息错误: ${err.message}`);
          return res.json({ error: err.message }, 401);
        }

      case '/users/list':
        if (req.method !== 'GET') {
          return res.json({ error: '方法不允许' }, 405);
        }
        try {
          const response = await users.list();
          log(`总用户数: ${response.total}`);
          return res.json(response);
        } catch (err) {
          error(`获取用户列表错误: ${err.message}`);
          return res.json({ error: err.message }, 500);
        }

      case '/ping':
        return res.text('Pong');

      default:
        return res.json({
          motto: 'Build like a team of hundreds_',
          learn: 'https://appwrite.io/docs',
          connect: 'https://appwrite.io/discord',
          getInspired: 'https://builtwith.appwrite.io',
        });
    }
  } catch (err) {
    error(`服务器错误: ${err.message}`);
    return res.json({ error: '服务器内部错误' }, 500);
  }
}; 