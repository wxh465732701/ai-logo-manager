#!/bin/bash

# 获取当前时间戳
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# 设置打包文件名
PACKAGE_NAME="starter-template_${TIMESTAMP}.tar.gz"

# 创建 dist 目录（如果不存在）
mkdir -p dist

# 打包项目，排除不需要的文件和目录
tar --exclude='node_modules' \
    --exclude='.git' \
    --exclude='dist' \
    --exclude='.env' \
    --exclude='.DS_Store' \
    -czf "dist/${PACKAGE_NAME}" .

echo "打包完成: dist/${PACKAGE_NAME}" 