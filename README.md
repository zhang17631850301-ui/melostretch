# MeloStretch · 办公室肌肉舒缓助手

MeloStretch 面向久坐、长期使用电脑和手机的办公人群，帮助用户快速定位不适部位，并在工位完成短时拉伸与放松练习。

> MeloStretch 当前是需要下载到电脑本地运行的开源项目，尚未提供在线网站。本项目采用“用户自带 Gemini API Key（BYOK）”模式，每位用户使用自己的 Key 和 API 配额。

## 主要功能

- **身体地图**：通过人体正面和背面地图定位肩颈、腰背、手腕及臀腿等部位
- **症状搜索**：用自然语言描述不适，由 Gemini 分析可能相关的肌肉与常见原因
- **办公室方案**：提供 1～5 分钟的肩颈、腰背、鼠标手和臀腿舒缓组合
- **动作跟练**：包含姿势提示、分步说明、倒计时、音效和安全注意事项
- **个人方案**：收藏动作、调整顺序并快速开始练习
- **练习统计**：记录累计次数、练习时长、今日表现和连续打卡天数
- **AI 动作扩展**：根据目标肌肉、可用设备及姿势偏好生成个性化动作

## API Key 使用方式

MeloStretch 不使用服务器统一提供的 Gemini Key，也不需要创建 `.env` 文件。

1. 打开 [Google AI Studio API Keys](https://aistudio.google.com/api-keys)，登录 Google 账号并创建自己的 Key。
2. 启动 MeloStretch。
3. 点击页面右上角带状态圆点的设置按钮。
4. 填入自己的 Gemini API Key，点击“保存并启用 AI”。

Key 仅保存在当前浏览器的本地存储中。AI 请求发生时，浏览器会通过网络临时将 Key 发送至 MeloStretch 后端，再由后端调用 Gemini；服务器不会持久化保存 Key。

用户可以随时在设置窗口中查看状态、更换或清除 Key。清除浏览器网站数据后，需要重新配置。

## 安全提示

- 只在自己信任的设备上填写 API Key
- 部署到公网时必须使用 HTTPS
- 不要在聊天、截图、Issue、PR 或源代码中公开完整 Key
- 不要将真实 Key 打包进项目或提交到 Git
- 公共或共享电脑使用完毕后，请在设置窗口中清除 Key
- 浏览器扩展或页面脚本可能访问本地存储，请保持依赖可信并及时处理安全更新

## 下载并运行（普通用户）

### 第一步：从 GitHub 下载

在项目 GitHub 页面点击绿色的 **Code** 按钮，然后选择 **Download ZIP**。下载完成后解压 ZIP。

> 请不要直接双击项目中的 `index.html`。MeloStretch 包含本地后端服务，必须按照下面的步骤启动，否则页面和 AI 功能无法正常工作。

### 第二步：安装 Node.js

1. 打开 [Node.js 官方下载页面](https://nodejs.org/zh-cn/download)。
2. 下载并安装 **LTS（长期支持版）**。
3. 安装 Node.js 时会自动附带 `npm`，不需要另外安装 npm 或 pnpm。

MeloStretch 需要 Node.js 18 或更高版本。首次安装完成后，建议关闭并重新打开终端。

### 第三步：一键启动 MeloStretch

- **Mac 用户**：双击 `Start-MeloStretch.command`
- **Windows 用户**：双击 `Start-MeloStretch.bat`

启动助手会自动检查 Node.js。第一次运行时，它会自动安装项目依赖；安装完成后会启动 MeloStretch 并打开浏览器。运行期间请保持启动窗口开启，关闭窗口后本地网站会停止。

如果 Mac 第一次打开时提示无法验证或没有权限，请右键点击 `Start-MeloStretch.command`，选择“打开”，再确认运行。

### 使用终端启动（备用方式）

打开电脑的“终端”或“命令提示符”，进入刚刚解压的 `melostretch` 文件夹，然后依次运行：

```bash
npm install
npm run dev
```

看到启动成功提示后，在浏览器打开 [http://localhost:3000](http://localhost:3000)。运行期间不要关闭终端窗口；关闭终端后，本地网站会停止。

`npm install` 通常只需在第一次下载或项目更新后执行。以后可以继续双击一键启动文件，或在项目文件夹运行 `npm run dev`。

身体地图、内置动作、跟练、收藏和统计等基础功能不需要 API Key；症状搜索与 AI 动作生成需要先在页面右上角配置自己的 Key。

## 构建与运行

```bash
# 类型检查
npm run lint

# 构建生产版本
npm run build

# 运行生产版本
npm run start
```

## 免费部署到 Vercel

项目已经同时支持本地运行与 Vercel 在线部署。Vercel 部署使用云端函数运行 Gemini 请求转发，普通访问者不需要下载代码、安装 Node.js 或打开终端。

1. 将项目代码上传到 GitHub 仓库。不要上传 `node_modules`、`dist` 或任何 API Key。
2. 登录 [Vercel](https://vercel.com)，选择 **Add New → Project**。
3. 连接 GitHub，并选择 MeloStretch 仓库。
4. Vercel 会自动读取项目中的 `vercel.json`，通常无需填写环境变量或修改构建设置。
5. 点击 **Deploy**，等待构建完成。
6. 使用 Vercel 提供的 HTTPS 网址访问网站。

项目采用用户自带 API Key 模式，因此 Vercel 后台不需要配置 `GEMINI_API_KEY`。用户在页面右上角填写自己的 Key，服务器只在当前请求中使用，不会持久化保存。

每次向 GitHub 仓库推送新版本后，Vercel 会自动重新部署。Vercel 免费额度和使用规则可能调整，请以 [Vercel 官方价格页面](https://vercel.com/pricing)为准。

## 项目结构

```text
melostretch/
├── Start-MeloStretch.command     # Mac 一键启动
├── Start-MeloStretch.bat         # Windows 一键启动
├── api/                         # Vercel 健康检查与 AI 云端函数入口
├── server.ts                    # Express 服务与 Gemini 请求转发
├── src/
│   ├── App.tsx                  # 应用入口组件
│   ├── components/
│   │   ├── ApiKeySettings.tsx   # 用户 API Key 设置界面
│   │   ├── BodyMap.tsx          # 身体地图与症状搜索
│   │   └── ...                  # 方案、详情、跟练与统计组件
│   ├── data/                    # 肌肉、症状、动作和方案数据
│   ├── utils/
│   │   ├── geminiKey.ts         # 浏览器端 Key 读取、保存与请求头
│   │   └── storage.ts           # 收藏、日志和统计的本地存储
│   ├── types.ts                 # TypeScript 类型定义
│   └── main.tsx                 # 前端入口
├── package.json
├── tsconfig.json
├── vercel.json                  # Vercel 构建、路由与函数配置
└── vite.config.ts
```

## 技术栈

- React 19、TypeScript、Vite、Tailwind CSS
- Node.js、Express
- Google Gemini（`@google/genai`）
- 浏览器 Local Storage

## 常见问题

### 普通用户需要安装开发环境吗？

当前版本尚未部署为在线网站，因此每位从 GitHub 下载并使用 MeloStretch 的用户都需要安装 Node.js。npm 会随 Node.js 自动安装，无需单独下载。

### 下载后应该双击哪个文件？

Mac 用户双击 `Start-MeloStretch.command`，Windows 用户双击 `Start-MeloStretch.bat`。请不要双击 `index.html`。

### 不填写 API Key 可以使用吗？

可以使用身体地图、内置动作、办公室方案、倒计时跟练、收藏和统计。AI 症状搜索与 AI 动作生成需要 Key。

### 每位用户使用谁的 API 配额？

使用该用户自己填写的 Gemini API Key 和对应账号配额，项目维护者的额度不会被消耗。

### Key 会上传或保存在服务器吗？

调用 Gemini 时，Key 必须随请求临时到达后端，但服务器不会把它写入数据库或配置文件。浏览器端会保存 Key，以便下次访问继续使用。

### 为什么换浏览器或设备后需要重新填写？

Key 保存在当前浏览器的本地存储中，不会在不同设备或浏览器之间同步。

## 健康与安全说明

MeloStretch 提供日常肌肉放松和健康教育内容，不构成医学诊断或治疗建议。出现剧烈疼痛、明显麻木无力、外伤、持续或加重的不适时，请停止练习并及时咨询专业医疗人员。

## License

MIT
