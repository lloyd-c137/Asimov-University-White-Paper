# Asimov University

[English](#english) | [中文](#中文)

---

<a name="english"></a>
## English

Welcome to Asimov University, the world's first AI-driven university. This project represents a pioneering step in education, blending artificial intelligence with human ingenuity to create a new paradigm of learning.

### About the Project

Asimov University is designed to be a hub for AI education, research, and innovation. Named after Isaac Asimov, the visionary science fiction writer who formulated the Three Laws of Robotics, our university aims to guide the development of AI for the betterment of humanity.

### Tech Stack

- **Frontend:** React 19, TypeScript, Vite
- **Styling:** Tailwind CSS 4
- **Routing:** React Router DOM
- **Animation:** Framer Motion
- **Backend (Local):** Node.js, Express, SQLite (sql.js)
- **Backend (Production):** Cloudflare Workers, Cloudflare D1

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- For Cloudflare deployment: Wrangler CLI (`npm install -g wrangler`)

### Installation & Running (Local Development)

#### 1. Clone the Repository
```bash
git clone <repository-url>
cd AsimovUniversity
```

#### 2. Install Dependencies
```bash
npm install
cd server && npm install && cd ..
```

#### 3. Configure Environment
```bash
cp .env.example .env
cp server/.env.example server/.env
```

#### 4. Start the Backend Server
Open a terminal and run:
```bash
cd server
npm start
```
The backend API server will start on `http://localhost:3001`

#### 5. Start the Frontend Development Server
Open another terminal and run:
```bash
npm run dev
```
The frontend will be available at `http://localhost:5173`

### Deployment to Cloudflare Pages

#### Frontend Deployment

1. Build the frontend:
```bash
npm run build
```

2. Deploy to Cloudflare Pages:
```bash
wrangler pages deploy dist
```

Or connect your GitHub repository to Cloudflare Pages for automatic deployments.

#### Backend (Workers) Deployment

1. Navigate to the worker directory:
```bash
cd worker
npm install
```

2. Create a D1 database:
```bash
wrangler d1 create asimov-university
```

3. Update `worker/wrangler.toml` with your database ID.

4. Run migrations:
```bash
wrangler d1 execute asimov-university --file=./schema.sql
```

5. Set secrets:
```bash
wrangler secret put AI_API_URL
wrangler secret put AI_API_KEY
wrangler secret put AI_MODEL
```

6. Deploy the worker:
```bash
npm run deploy
```

7. Update `public/_redirects` with your worker URL.

### Project Structure

```
AsimovUniversity/
├── src/                    # Frontend source code
│   ├── pages/              # Page components
│   │   ├── Home.tsx        # Homepage
│   │   ├── Application.tsx # Application form
│   │   ├── Admin.tsx       # Admin dashboard
│   │   └── Mailbox.tsx     # Simulated mailbox
│   ├── components/         # Reusable components
│   └── assets/             # Static assets
├── server/                 # Local backend (Node.js)
│   ├── index.js            # Express server
│   └── database.js         # SQLite database setup
├── worker/                 # Cloudflare Workers backend
│   ├── src/                # Worker source code
│   │   ├── index.ts        # Main worker entry
│   │   └── handlers/       # API handlers
│   ├── schema.sql          # D1 database schema
│   └── wrangler.toml       # Worker configuration
├── public/                 # Static public assets
│   └── _redirects          # Cloudflare Pages redirects
└── README.md
```

### Features

- **AI-Powered Application System**: Interactive application process with AI assistant Lyra
- **Admin Dashboard**: Manage applications, users, and email templates
- **Activity Logging**: Track all admin operations (optional, disabled by default)
- **Email Templates**: Create and manage custom email templates
- **Simulated Mailbox**: View emails sent to applicants

### Admin Access

Access the admin dashboard at `/admin` with these credentials:
- Username: `asimov2025`
- Password: `asimov2025`

---

<a name="中文"></a>
## 中文

欢迎来到阿西莫夫大学，全球首所AI驱动的大学。本项目代表了教育领域的开创性一步，将人工智能与人类智慧相结合，创造全新的学习范式。

### 关于项目

阿西莫夫大学旨在成为AI教育、研究和创新的中心。大学以艾萨克·阿西莫夫命名——这位富有远见的科幻作家提出了机器人三定律，我们的目标是引导AI的发展，造福人类。

### 技术栈

- **前端:** React 19, TypeScript, Vite
- **样式:** Tailwind CSS 4
- **路由:** React Router DOM
- **动画:** Framer Motion
- **后端（本地）:** Node.js, Express, SQLite (sql.js)
- **后端（生产）:** Cloudflare Workers, Cloudflare D1

### 环境要求

- 已安装 Node.js 18+
- npm 或 yarn 包管理器
- Cloudflare 部署需要: Wrangler CLI (`npm install -g wrangler`)

### 安装与运行（本地开发）

#### 1. 克隆仓库
```bash
git clone <仓库地址>
cd AsimovUniversity
```

#### 2. 安装依赖
```bash
npm install
cd server && npm install && cd ..
```

#### 3. 配置环境变量
```bash
cp .env.example .env
cp server/.env.example server/.env
```

#### 4. 启动后端服务器
打开一个终端，运行：
```bash
cd server
npm start
```
后端API服务器将在 `http://localhost:3001` 启动

#### 5. 启动前端开发服务器
打开另一个终端，运行：
```bash
npm run dev
```
前端应用将在 `http://localhost:5173` 可用

### 部署到 Cloudflare Pages

#### 前端部署

1. 构建前端：
```bash
npm run build
```

2. 部署到 Cloudflare Pages：
```bash
wrangler pages deploy dist
```

或者将 GitHub 仓库连接到 Cloudflare Pages 实现自动部署。

#### 后端（Workers）部署

1. 进入 worker 目录：
```bash
cd worker
npm install
```

2. 创建 D1 数据库：
```bash
wrangler d1 create asimov-university
```

3. 更新 `worker/wrangler.toml` 中的数据库 ID。

4. 运行数据库迁移：
```bash
wrangler d1 execute asimov-university --file=./schema.sql
```

5. 设置密钥：
```bash
wrangler secret put AI_API_URL
wrangler secret put AI_API_KEY
wrangler secret put AI_MODEL
```

6. 部署 Worker：
```bash
npm run deploy
```

7. 更新 `public/_redirects` 中的 Worker URL。

### 项目结构

```
AsimovUniversity/
├── src/                    # 前端源代码
│   ├── pages/              # 页面组件
│   │   ├── Home.tsx        # 首页
│   │   ├── Application.tsx # 申请表单
│   │   ├── Admin.tsx       # 管理后台
│   │   └── Mailbox.tsx     # 模拟邮箱
│   ├── components/         # 可复用组件
│   └── assets/             # 静态资源
├── server/                 # 本地后端（Node.js）
│   ├── index.js            # Express服务器
│   └── database.js         # SQLite数据库配置
├── worker/                 # Cloudflare Workers 后端
│   ├── src/                # Worker 源代码
│   │   ├── index.ts        # Worker 入口
│   │   └── handlers/       # API 处理器
│   ├── schema.sql          # D1 数据库架构
│   └── wrangler.toml       # Worker 配置
├── public/                 # 静态公共资源
│   └── _redirects          # Cloudflare Pages 重定向规则
└── README.md
```

### 功能特性

- **AI驱动的申请系统**: 与AI助手Lyra进行交互式申请流程
- **管理后台**: 管理申请、用户和邮件模板
- **操作日志**: 记录所有管理操作（可选，默认关闭）
- **邮件模板**: 创建和管理自定义邮件模板
- **模拟邮箱**: 查看发送给申请人的邮件

### 管理员访问

在 `/admin` 访问管理后台，使用以下凭据：
- 用户名: `asimov2025`
- 密码: `asimov2025`

---

## License

Copyright © 2025 Asimov University. All rights reserved.

This is a private project. No license is granted to use, copy, modify, or distribute this software. See [LICENSE](LICENSE) for details.
