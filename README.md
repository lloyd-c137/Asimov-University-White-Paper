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
- **Backend:** Node.js, Express
- **Database:** SQLite (sql.js)

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation & Running

#### 1. Clone the Repository
```bash
git clone <repository-url>
cd AsimovUniversity
```

#### 2. Install Dependencies
```bash
npm install
```

#### 3. Start the Backend Server
Open a terminal and run:
```bash
cd server
node index.js
```
The backend API server will start on `http://localhost:3001`

#### 4. Start the Frontend Development Server
Open another terminal and run:
```bash
npm run dev
```
The frontend will be available at `http://localhost:5173`

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
├── server/                 # Backend source code
│   ├── index.js            # Express server
│   └── database.js         # SQLite database setup
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
- Username: `admin`
- Password: `asimov2024`

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
- **后端:** Node.js, Express
- **数据库:** SQLite (sql.js)

### 环境要求

- 已安装 Node.js 18+
- npm 或 yarn 包管理器

### 安装与运行

#### 1. 克隆仓库
```bash
git clone <仓库地址>
cd AsimovUniversity
```

#### 2. 安装依赖
```bash
npm install
```

#### 3. 启动后端服务器
打开一个终端，运行：
```bash
cd server
node index.js
```
后端API服务器将在 `http://localhost:3001` 启动

#### 4. 启动前端开发服务器
打开另一个终端，运行：
```bash
npm run dev
```
前端应用将在 `http://localhost:5173` 可用

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
├── server/                 # 后端源代码
│   ├── index.js            # Express服务器
│   └── database.js         # SQLite数据库配置
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
- 用户名: `admin`
- 密码: `asimov2024`

---

## License

MIT License
