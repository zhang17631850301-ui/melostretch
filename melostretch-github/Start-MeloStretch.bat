@echo off
chcp 65001 >nul
cd /d "%~dp0"

echo.
echo ========================================
echo   MeloStretch 本地启动助手
echo ========================================
echo.

where node >nul 2>nul
if errorlevel 1 goto :missing_node
where npm >nul 2>nul
if errorlevel 1 goto :missing_node

for /f "delims=" %%v in ('node --version') do set NODE_VERSION=%%v
echo 已检测到 Node.js %NODE_VERSION%

powershell -NoProfile -Command "try { Invoke-WebRequest -UseBasicParsing http://127.0.0.1:3000/api/health -TimeoutSec 2 ^| Out-Null; exit 0 } catch { exit 1 }"
if not errorlevel 1 (
  echo MeloStretch 已经在运行，正在打开浏览器...
  start "" "http://localhost:3000"
  exit /b 0
)

if not exist "node_modules" (
  echo.
  echo 首次运行：正在安装项目依赖，请保持网络连接...
  call npm install
  if errorlevel 1 (
    echo.
    echo 依赖安装失败，请检查网络后重试。
    pause
    exit /b 1
  )
)

echo.
echo 正在启动 MeloStretch...
echo 启动后请保持此窗口开启。关闭窗口将停止网站。
start "" powershell -NoProfile -WindowStyle Hidden -Command "Start-Sleep -Seconds 3; Start-Process 'http://localhost:3000'"
call npm run dev

echo.
echo MeloStretch 已停止。
pause
exit /b 0

:missing_node
echo 尚未检测到 Node.js。
echo 即将打开 Node.js 官方下载页面，请安装 LTS 版本后再次双击本文件。
start "" "https://nodejs.org/zh-cn/download"
echo.
pause
exit /b 1
