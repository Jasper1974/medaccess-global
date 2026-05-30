# MedAccess Global

重症患者全球用药导航平台（Next.js）。不卖药，做导航。

## 环境要求

- [Git](https://git-scm.com/) 2.x
- [Node.js](https://nodejs.org/) 18+（推荐 LTS）

## 本地开发

```bash
npm install
# 可选：配置 Supabase，见 docs/supabase-setup-zh.md
npm run setup:supabase
npm run dev
```

未配置 `DATABASE_URL` 时使用 mock 试验数据，仍可正常开发。

## 常用命令

| 命令 | 说明 |
|------|------|
| `npm run dev` | 本地 http://localhost:3000 |
| `npm run build` | 生产构建 |
| `npm run setup:supabase` | 粘贴连接串并 migrate + seed |
| `npm run db:deploy` | 生产库迁移 |

## 文档

- [CLAUDE.md](./CLAUDE.md) — 项目上下文（优先阅读）
- [docs/supabase-setup-zh.md](./docs/supabase-setup-zh.md) — 数据库配置
- [docs/disease-hub.md](./docs/disease-hub.md) — 病种 Hub

## 仓库说明

与 [paperstill](https://github.com/Jasper1974/paperstill) 同属 GitHub 账号下的**平行仓库**，互不嵌套。
