# MeloStretch · 办公室肌肉舒缓助手

MeloStretch 是一款面向久坐办公、长期使用电脑和手机人群的肌肉舒缓网站，帮助用户定位不适部位，并通过短时间拉伸和放松缓解日常肌肉酸痛。

当前在线版本部署于 Vercel，并使用 Gemini API。受网络及服务地区限制影响，部分地区可能无法稳定访问或使用 AI 功能。请遵守所在地法律法规及相关服务条款。

## 在线使用

MeloStretch 已经部署为在线网站：

**网站地址：[https://melostretch.vercel.app](https://melostretch.vercel.app)**

普通用户直接打开网站即可使用，无需：

- 下载源代码
- 安装 Node.js
- 打开终端
- 注册 Vercel
- 自己部署网站

身体地图、内置动作、办公室方案、倒计时跟练、收藏和统计等基础功能不需要 API Key。

使用 AI 症状搜索或 AI 动作生成功能时，需要填写用户自己的 Gemini API Key。

## 主要功能

- **身体地图**：通过人体正面和背面地图定位肩颈、腰背、手腕及臀腿等部位
- **症状搜索**：使用自然语言描述不适，由 Gemini 分析可能相关的肌肉和常见原因
- **办公室方案**：提供1～5分钟的肩颈、腰背、鼠标手和臀腿舒缓组合
- **动作跟练**：包含姿势提示、分步说明、倒计时、音效和安全注意事项
- **个人方案**：收藏动作、调整顺序并快速开始练习
- **练习统计**：记录累计次数、练习时间、今日表现和连续打卡天数
- **AI 动作扩展**：根据目标肌肉、可用设备及姿势偏好生成个性化动作

---

# 普通用户使用说明

## 第一步：打开网站

在浏览器中访问：

[https://melostretch.vercel.app](https://melostretch.vercel.app)

推荐使用较新版本的 Chrome、Edge、Safari 或 Firefox。

## 第二步：直接使用基础功能

不填写 API Key 也可以使用：

- 身体地图
- 内置舒缓动作
- 办公室练习方案
- 倒计时跟练
- 动作收藏
- 个人方案
- 练习记录和统计

## 第三步：启用 AI 功能

AI 症状搜索和 AI 动作生成功能需要使用 Gemini API Key。

配置方法：

1. 打开 [Google AI Studio API Keys](https://aistudio.google.com/api-keys)。
2. 登录自己的 Google 账号。
3. 创建一个 Gemini API Key。
4. 返回 MeloStretch 网站。
5. 点击页面右上角带状态圆点的设置按钮。
6. 填入自己的 Gemini API Key。
7. 点击“保存并启用 AI”。

每位用户使用的是自己的 Gemini API Key及其对应账号的 API 配额，不会消耗网站维护者的 Gemini API 配额。

## API Key 如何保存

API Key 会保存在当前浏览器的本地存储中，以便下次打开网站时继续使用。

需要注意：

- 更换电脑后需要重新填写
- 更换浏览器后需要重新填写
- 使用无痕浏览时，关闭窗口后可能需要重新填写
- 清除浏览器网站数据后需要重新填写
- 服务器不会将 API Key 持久化保存到数据库
- 调用 Gemini 时，Key 会随当前请求临时发送到 MeloStretch 后端

## 练习数据如何保存

收藏、个人方案、练习记录和统计数据保存在当前浏览器中。

因此：
- 请固定使用正式网站地址：https://melostretch.vercel.app
- 请尽量始终使用同一个浏览器访问网站
- 关闭网站后再次打开，数据通常仍然存在
- 更换浏览器或电脑后，原有数据不会自动同步
- 清除浏览器网站数据可能会同时清除练习记录
- 当前版本没有账号登录和云端数据同步功能

## 普通用户安全提示

- 只在官方网站和自己信任的设备上填写 API Key
- 不要把完整 API Key 发给其他人
- 不要在聊天、截图、GitHub Issue 或社交平台中公开 Key
- 不要把 Key 写入公开代码
- 在公共或共享电脑上使用完毕后，请在设置窗口中清除 Key
- 如果怀疑 Key 已经泄露，请前往 Google AI Studio 删除旧 Key 并创建新 Key

---

# 网站维护者与开发者说明

以下内容只面向网站维护者、开发者，以及希望复制、修改或独立部署 MeloStretch 的用户。

普通使用者不需要执行这一部分。

## 获取源代码

在 GitHub 项目页面点击绿色的 **Code** 按钮，然后选择 **Download ZIP**。

下载完成后解压项目文件。

也可以使用 Git 克隆项目：

```bash
git clone 你的仓库地址
cd melostretch
```

## 本地开发环境

本地运行需要：

- Node.js 18 或更高版本
- npm（安装 Node.js 时会自动安装）

Node.js 可以从官方网站下载：

[https://nodejs.org/zh-cn/download](https://nodejs.org/zh-cn/download)

## 本地一键启动

项目提供了本地启动文件：

- **Mac 用户**：双击 `Start-MeloStretch.command`
- **Windows 用户**：双击 `Start-MeloStretch.bat`

第一次启动时，启动助手会自动安装项目依赖，然后启动 MeloStretch 并打开浏览器。

本地运行期间需要保持启动窗口开启。关闭窗口后，本地网站会停止运行。

如果 Mac 第一次打开时提示无法验证或没有权限，请右键点击 `Start-MeloStretch.command`，选择“打开”，然后确认运行。

## 使用终端启动

在项目文件夹中运行：

```bash
npm install
npm run dev
```

启动成功后，在浏览器打开：

[http://localhost:3000](http://localhost:3000)

本地网站运行期间不要关闭终端窗口。

## 检查与构建

执行 TypeScript 类型检查：

```bash
npm run lint
```

构建网站前端：

```bash
npm run build:web
```

构建完整的本地生产版本：

```bash
npm run build
```

运行本地生产版本：

```bash
npm run start
```

---

# 网站维护者：部署到 Vercel

只需要网站维护者部署一次。

部署完成后，普通用户直接打开 Vercel 提供的网站地址即可，不需要自己注册 Vercel或重复部署。

## 第一次部署

1. 将项目源代码上传到 GitHub 仓库。
2. 不要上传 `node_modules`、`dist`、`.env` 或任何真实 API Key。
3. 登录 [Vercel](https://vercel.com)。
4. 选择 **Add New → Project**。
5. 连接 GitHub 账号。
6. 选择 MeloStretch 所在的 GitHub 仓库。
7. 确认应用预设为 **Vite**。
8. 确认项目根目录为 `./`。
9. 无需在 Vercel 中配置 `GEMINI_API_KEY`。
10. 点击 **Deploy**。
11. 等待状态变成 **Ready**。
12. 使用 Vercel 提供的 HTTPS 地址访问网站。

项目中的 `vercel.json` 已经包含构建、路由和云端函数配置，通常不需要手动修改 Vercel 的构建设置。

## 为什么 Vercel 不需要填写 Gemini API Key

MeloStretch 使用“用户自带 API Key”模式，即 BYOK（Bring Your Own Key）。

具体流程是：

1. 普通用户在网站中填写自己的 Gemini API Key。
2. Key 保存在该用户当前浏览器的本地存储中。
3. 用户使用 AI 功能时，浏览器把 Key 临时发送到 MeloStretch 云端接口。
4. 云端接口使用该 Key 调用 Gemini。
5. 请求结束后，服务器不会将 Key写入数据库或配置文件。

因此，网站维护者不需要在 Vercel 后台提供统一的 Gemini API Key。

## 更新在线网站

Vercel 已经与 GitHub 仓库连接。

以后更新网站时：

1. 修改项目代码。
2. 将修改后的文件提交到 GitHub。
3. Vercel 检测到 GitHub 更新后会自动重新部署。
4. 等待 Vercel 状态重新变成 **Ready**。
5. 刷新在线网站检查新版本。

只修改 `README.md` 一般不会改变网站功能，但也可能触发一次自动部署，这是正常现象。

## Vercel 免费额度

MeloStretch 可以使用 Vercel Hobby 方案部署。

Vercel 的免费额度、功能限制和使用规则可能发生变化，请以官方页面为准：

[https://vercel.com/pricing](https://vercel.com/pricing)

如果以后访问量或云端函数使用量明显增加，可能需要关注 Vercel 的额度提示或升级方案。

---

# 项目结构

```text
melostretch/
├── api/
│   ├── health.ts
│   └── ai/
│       ├── search-pain.ts
│       └── generate-exercises.ts
├── src/
│   ├── App.tsx
│   ├── components/
│   │   ├── ApiKeySettings.tsx
│   │   ├── BodyMap.tsx
│   │   ├── MuscleDetailModal.tsx
│   │   └── ...
│   ├── data/
│   ├── utils/
│   │   ├── geminiKey.ts
│   │   └── storage.ts
│   ├── types.ts
│   └── main.tsx
├── Start-MeloStretch.command
├── Start-MeloStretch.bat
├── server.ts
├── index.html
├── package.json
├── tsconfig.json
├── vercel.json
└── vite.config.ts
```

主要文件说明：

- `api/`：Vercel 在线版本使用的云端接口
- `server.ts`：本地运行时使用的 Express 服务
- `src/components/`：网站页面和功能组件
- `src/data/`：肌肉、动作和办公室方案数据
- `src/utils/geminiKey.ts`：浏览器端 API Key 管理
- `src/utils/storage.ts`：收藏、日志和统计数据管理
- `vercel.json`：Vercel 构建、路由和云端函数配置
- `Start-MeloStretch.command`：Mac 本地一键启动
- `Start-MeloStretch.bat`：Windows 本地一键启动

# 技术栈

- React
- TypeScript
- Vite
- Tailwind CSS
- Node.js
- Express
- Vercel Functions
- Google Gemini API
- 浏览器 Local Storage

# 常见问题

## 普通用户需要部署网站吗？

不需要。

网站维护者已经完成部署，普通用户直接打开在线网站即可。

## 普通用户需要安装 Node.js 吗？

使用在线网站不需要。

只有需要在本地运行、修改源代码或参与开发的人才需要安装 Node.js。

## 普通用户需要下载源代码吗？

不需要。

普通用户直接访问在线网站即可。下载源代码只适合开发者或希望独立部署项目的人。

## 不填写 API Key 可以使用吗？

可以。

身体地图、内置动作、办公室方案、倒计时跟练、收藏和统计可以正常使用。

AI 症状搜索和 AI 动作生成需要配置 Gemini API Key。

## 用户填写的是谁的 API Key？

每位用户填写自己的 Gemini API Key，使用自己的 Gemini API 配额。

## 网站维护者需要提供统一 API Key 吗？

不需要。

MeloStretch 采用用户自带 API Key 模式。

## API Key 会被服务器保存吗？

不会被持久化保存到服务器或数据库。

Key 会保存在用户当前浏览器的本地存储中，并在发起 Gemini 请求时临时经过 MeloStretch 后端。

## 为什么更换浏览器或设备后需要重新填写 Key？

因为 Key 保存在当前浏览器中，不会自动同步到其他浏览器或设备。

## 为什么更换浏览器后练习记录不见了？

因为当前版本的练习记录和统计数据保存在浏览器本地，没有账号系统和云端同步功能。

## 网站更新后，普通用户需要重新下载吗？

不需要。

维护者将更新提交到 GitHub 后，Vercel 会自动重新部署。普通用户刷新在线网站即可使用新版本。

# 健康与安全说明

MeloStretch 提供的是日常肌肉放松、拉伸指导和健康教育内容，不构成医学诊断或治疗建议。

如果出现以下情况，请停止练习并及时咨询医生、物理治疗师或其他专业医疗人员：

- 剧烈或突然出现的疼痛
- 明显麻木或无力
- 外伤后疼痛
- 关节明显肿胀或活动受限
- 胸痛、呼吸困难或眩晕
- 疼痛持续加重或长时间没有缓解

拉伸过程中应保持动作缓慢、呼吸自然，不要强行追求幅度。

# 开源协议

本项目使用 MIT License。
