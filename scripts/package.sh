#!/bin/bash

# 获取环境参数
ENV=${1:-dev}  # 默认为 dev 环境

# 验证环境参数
if [ "$ENV" != "dev" ] && [ "$ENV" != "prod" ]; then
  echo "错误: 环境参数必须是 'dev' 或 'prod'"
  exit 1
fi

# 获取当前时间戳
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# 设置打包文件名
PACKAGE_NAME="starter-template_${ENV}_${TIMESTAMP}.tar.gz"

# 复制对应环境的配置文件
echo "正在应用 ${ENV} 环境的配置..."
cp "src/resource/application_${ENV}.js" "src/resource/application.js"

# 创建 dist 目录（如果不存在）
mkdir -p dist

# 打包项目，排除不需要的文件和目录
tar --exclude='node_modules' \
    --exclude='.git' \
    --exclude='dist' \
    --exclude='.env' \
    --exclude='tests' \
    --exclude='.DS_Store' \
    --exclude='src/resource/application_*.js' \
    -czf "dist/${PACKAGE_NAME}" .

echo "打包完成: dist/${PACKAGE_NAME}" 