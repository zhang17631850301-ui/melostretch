#!/bin/bash

cd "$(dirname "$0")" || exit 1

echo ""
echo "========================================"
echo "  MeloStretch 本地启动助手"
echo "========================================"
echo ""

if ! command -v node >/dev/null 2>&1 || ! command -v npm >/dev/null 2>&1; then
  echo "尚未检测到 Node.js。"
  echo "即将打开 Node.js 官方下载页面，请安装 LTS 版本后再次双击本文件。"
  open "https://nodejs.org/zh-cn/download"
  echo ""
  read -r -p "按回车键关闭窗口..."
  exit 1
fi

echo "已检测到 Node.js $(node --version)"

if curl -fsS "http://127.0.0.1:3000/api/health" >/dev/null 2>&1; then
  echo "MeloStretch 已经在运行，正在打开浏览器..."
  open "http://localhost:3000"
  exit 0
fi

if [ ! -d "node_modules" ]; then
  echo ""
  echo "首次运行：正在安装项目依赖，请保持网络连接..."
  npm install
  if [ $? -ne 0 ]; then
    echo ""
    echo "依赖安装失败，请检查网络后重试。"
    read -r -p "按回车键关闭窗口..."
    exit 1
  fi
fi

echo ""
echo "正在启动 MeloStretch..."
echo "启动后请保持此窗口开启。关闭窗口将停止网站。"

(
  sleep 3
  open "http://localhost:3000"
) &

npm run dev

echo ""
echo "MeloStretch 已停止。"
read -r -p "按回车键关闭窗口..."
