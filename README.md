# Auto Agent - 二手车智能平台

基于 AI Agent 的二手车行业智能助手平台，提供车辆评估、客户服务、市场分析、车辆检测、交易顾问五大智能 Agent。

## 在线预览

**[https://leij8993-coder.github.io/auto-agent](https://leij8993-coder.github.io/auto-agent)**

## 功能特性

- **5 个专业 Agent** — 车辆评估、客户服务、市场分析、车辆检测、交易顾问
- **对话历史** — 自动保存会话，切换对话不丢失上下文
- **知识库** — 内置车型、行情、法规等专业数据
- **现代 UI** — 玻璃态设计、渐变色彩、流畅动画
- **可配置 API** — 支持 OpenAI / Anthropic / 自定义 API 接入

## 技术栈

- Next.js 16 + React 19 + TypeScript
- Tailwind CSS v4
- OpenAI 兼容 API
- localStorage 会话持久化

## 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 访问 http://localhost:3000
```

在管理后台配置 API Key 后即可开始使用。

## 项目结构

```
src/
├── app/              # 页面路由
│   ├── agents/       # 5 个 Agent 对话页
│   ├── api/agent/    # API 路由
│   └── admin/        # 管理后台
├── components/       # ChatInterface + Sidebar
├── data/             # 知识库 JSON
├── lib/              # 工具函数 + 会话管理
└── types/            # TypeScript 类型
```

## License

MIT
