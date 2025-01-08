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



