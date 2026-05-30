# Supabase 连接串配置（复制粘贴版）

> 约 5 分钟。不需要理解 URI 结构，只要从控制台复制两段文字。

## 1. 创建项目

1. 打开 [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. 用 GitHub / 邮箱注册并登录
3. 点击 **New project**
4. 填：
   - **Name**：`medaccess-global`（任意）
   - **Database Password**：自己设一个强密码，**记下来**
   - **Region**：选离用户近的（如 Northeast Asia）
5. 点 **Create new project**，等待状态变为绿色（约 1～2 分钟）

## 2. 复制连接串

1. 进入刚建好的项目
2. 左侧点 **Connect**（或 **Project Settings** → **Database**）
3. 在 **Connection string** 区域：
   - 类型选 **URI**
   - 若提示密码，用你在第 1 步设的密码；忘了就 **Database** → **Reset database password**

### 方式 A：两条（推荐，与线上一致）

| 用途 | 在 Supabase 里找 | 端口 |
|------|------------------|------|
| 应用运行时 `DATABASE_URL` | **Transaction** / Supavisor transaction | **6543** |
| 迁移 `DIRECT_URL` | **Session** 或 **Direct connection** | **5432** |

复制后，在项目根目录执行：

```bash
npm run setup:supabase
```

按提示：选 `2`，依次粘贴 6543 和 5432 两条。

### 方式 B：一条（本地开发省事）

只复制 **Direct connection**（端口 **5432**）整段 URI。

```bash
npm run setup:supabase
```

选 `1`，粘贴这一条即可。

## 3. 脚本会自动完成

- 写入 `.env.local` / `.env`（已在 `.gitignore`，不会进 Git）
- `prisma migrate deploy`
- `prisma db seed`（导入 mock 试验数据）

## 4. 验证

```bash
npm run dev
```

浏览器打开：

- [http://localhost:3000/d/fei-ai-egfr/trials](http://localhost:3000/d/fei-ai-egfr/trials)
- [http://localhost:3000/api/trials?diseaseSlug=fei-ai-egfr](http://localhost:3000/api/trials?diseaseSlug=fei-ai-egfr)

## 5. 部署到 Vercel

在 Vercel 项目 **Settings → Environment Variables** 添加：

- `DATABASE_URL`（6543 + `?pgbouncer=true`，与本地相同）
- `DIRECT_URL`（5432）
- `NEXT_PUBLIC_SITE_URL`（你的域名）

构建命令已包含 `prisma generate`；首次部署前在本地对生产库执行一次 `npm run db:deploy`。

## 常见问题

| 现象 | 处理 |
|------|------|
| `password authentication failed` | Supabase 重置数据库密码，重新复制 URI |
| 迁移卡住 | 确认 `DIRECT_URL` 是 **5432**，不是 6543 |
| `prepared statement already exists` | `DATABASE_URL` 末尾要有 `?pgbouncer=true`（脚本会自动加） |
| 不想用数据库 | 删除 `.env.local` 里的 `DATABASE_URL`，站点自动用 mock |
