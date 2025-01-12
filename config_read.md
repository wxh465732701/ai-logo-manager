# 新增配置
/c/r/add

参数： 
- key: 配置键
- value: 配置值

header:
- Content-Type: application/json

【示例】
```json
[
    {
        "key": "GUIDE_HOME_IMAGE",
        "value": "https://magic-logo-dev.s3.us-east-005.backblazeb2.com/dev/Image+Container.png"
    },
    {
        "key": "GUIDE_HOME_IMAGE",
        "value": "https://magic-logo-dev.s3.us-east-005.backblazeb2.com/dev/Image+Container+(1).png"
    }
]
```

response:
```json
{
    "code": 200,
    "message": "success",
    "data": null
}
```

# 用户登录
/auth/login

说明：
- 支持邮箱登录和设备登录两种方式
- 如果用户/设备不存在，会自动注册

参数：
- loginType: 登录类型（email-邮箱登录，device-设备登录）
- email: 邮箱（邮箱登录时必填）
- password: 密码（邮箱登录时必填）
- deviceId: 设备ID（设备登录时必填）

header:
- Content-Type: application/json

【邮箱登录示例】
```json
{
    "loginType": "email",
    "email": "user@example.com",
    "password": "password123"
}
```

【设备登录示例】
```json
{
    "loginType": "device",
    "deviceId": "device123"
}
```

response:
```json
{
    "code": 0,
    "msg": "success",
    "data": {
        "session": {
            "userId": "user123",
            "token": "token123",
            "expireTime": "2024-01-21"
        }
    }
}
```

错误码：
- 0: 成功
- -1: 系统错误
- 401: 未授权（登录失败）
- 400: 请求参数错误


# 获取引导页配置
/config/guide

参数： 
- key: 配置键
- value: 配置值

header:
- Content-Type: application/json

【示例】


response:
```json
{"code":0,"msg":"success","data":{"homeImages":[{"imageUrl":"https://magic-logo-dev.s3.
us-east-005.backblazeb2.com/dev/Image+Container.png","updateTime":"2024-12-22T03:08:47.620
+00:00","createTime":"2024-12-22T03:08:47.620+00:00"},{"imageUrl":"https://magic-logo-dev.s3.
us-east-005.backblazeb2.com/dev/Image+Container+(1).png","updateTime":"2024-12-22T03:08:47.790
+00:00","createTime":"2024-12-22T03:08:47.790+00:00"},{"imageUrl":"https://magic-logo-dev.s3.
us-east-005.backblazeb2.com/dev/Image+Container+(2).png","updateTime":"2024-12-22T03:08:47.928
+00:00","createTime":"2024-12-22T03:08:47.928+00:00"}],"thirdPartyImages":[]},
"timestamp":1734837141564}
```

错误码：
- 0: 成功
- -1: 系统错误
- 400: 请求参数错误
- 500: 服务器错误

# 更新用户基本信息
/user/update/base

说明：
- 更新用户的通知状态和最后查看页面
- 需要用户登录认证

参数：
- notifyStatus: 通知状态（0: 关闭, 1: 开启）
- lastViewedPage: 最后查看页面（0: 首页, 1: 个人中心, 2: 设置页面, 3: VIP页面）

header:
- Content-Type: application/json
- Authorization: Bearer <session_id>

【示例】
```json
{
  "notifyStatus": 1,
  "lastViewedPage": "home"
}
```

response:
```json
{
  "code": 0,
  "msg": "success",
  "data": null
}
```

错误码：
- 0: 成功
- 401: 未授权（未登录）
- 400: 请求参数错误
- 500: 服务器内部错误


