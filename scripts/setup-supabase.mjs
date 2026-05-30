/**
 * 交互式写入 .env.local，并执行 migrate + seed。
 * 用法：npm run setup:supabase
 */
import { execSync } from "node:child_process";
import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const rl = createInterface({ input, output });

function trimUrl(value) {
  return value.trim().replace(/^["']|["']$/g, "");
}

function ensurePgbouncer(url) {
  if (!/:(6543)\//.test(url)) return url;
  if (url.includes("pgbouncer=true")) return url;
  return url.includes("?") ? `${url}&pgbouncer=true` : `${url}?pgbouncer=true`;
}

function validateUrl(url, label) {
  if (!/^postgres(ql)?:\/\//i.test(url)) {
    throw new Error(`${label} 必须以 postgresql:// 或 postgres:// 开头`);
  }
}

async function ask(question) {
  const answer = await rl.question(question);
  return answer.trim();
}

function writeEnvFiles({ databaseUrl, directUrl }) {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL?.trim() || "http://localhost:3000";
  const content = `# 由 npm run setup:supabase 生成，勿提交到 Git
DATABASE_URL="${databaseUrl}"
DIRECT_URL="${directUrl}"
NEXT_PUBLIC_SITE_URL="${siteUrl}"
`;

  writeFileSync(resolve(root, ".env.local"), content, "utf8");
  // Prisma CLI 默认读 .env，不写则 migrate 找不到变量
  writeFileSync(resolve(root, ".env"), content, "utf8");
}

function run(cmd, env) {
  execSync(cmd, {
    cwd: root,
    stdio: "inherit",
    env: { ...process.env, ...env },
    shell: true,
  });
}

console.log(`
╔══════════════════════════════════════════════════════════════╗
║  MedAccess · Supabase 一键配置                                ║
╚══════════════════════════════════════════════════════════════╝

说明：我无法替你登录 Supabase 账号，但下面只需「复制粘贴」。

【第 1 步】浏览器打开并登录（没有账号就先注册）：
  https://supabase.com/dashboard

【第 2 步】新建项目（或点进已有项目）→ 等数据库就绪（约 1～2 分钟）

【第 3 步】左侧点 Connect（或 设置 ⚙ → Database → Connection string）

【第 4 步】复制连接串（任选一种方式）：

  方式 A（推荐，两条）：
    · Transaction / Supavisor · 端口 6543 → 运行时
    · Session 或 Direct · 端口 5432 → 迁移用

  方式 B（省事，一条）：
    · 只复制 Direct connection（端口 5432 那条）
    · 脚本会同时用于 DATABASE_URL 和 DIRECT_URL（本地开发够用）

【第 5 步】若提示数据库密码：Settings → Database → Reset database password
`);

try {
  const mode = await ask("\n你有几条可粘贴的连接串？(1=只有一条 5432，2=有两条) [1/2]: ");

  let databaseUrl;
  let directUrl;

  if (mode === "2") {
    const pooled = trimUrl(
      await ask("\n粘贴 Transaction（6543）连接串:\n> "),
    );
    const direct = trimUrl(await ask("\n粘贴 Direct / Session（5432）连接串:\n> "));
    validateUrl(pooled, "Transaction");
    validateUrl(direct, "Direct");
    databaseUrl = ensurePgbouncer(pooled);
    directUrl = direct;
  } else {
    const single = trimUrl(
      await ask("\n粘贴 Direct（5432）连接串（整段 URI）:\n> "),
    );
    validateUrl(single, "连接串");
    directUrl = single;
    databaseUrl = single.includes(":6543/")
      ? ensurePgbouncer(single)
      : single;
  }

  writeEnvFiles({ databaseUrl, directUrl });
  console.log("\n✓ 已写入 .env.local 与 .env\n");

  console.log("正在测试连接并执行迁移…\n");
  run("npx prisma migrate deploy", {
    DATABASE_URL: databaseUrl,
    DIRECT_URL: directUrl,
  });

  console.log("\n正在导入试验种子数据…\n");
  run("npx prisma db seed", {
    DATABASE_URL: databaseUrl,
    DIRECT_URL: directUrl,
  });

  console.log(`
✓ 全部完成。

接下来：
  npm run dev
  打开 http://localhost:3000/d/fei-ai-egfr/trials

Vercel 部署时，在项目 Environment Variables 里添加同样的 DATABASE_URL、DIRECT_URL。
`);
} catch (error) {
  console.error("\n✗ 配置失败:", error.message ?? error);
  console.error(`
常见原因：
  · 密码错误 → Supabase 重置数据库密码后重新复制连接串
  · 项目还在创建中 → 等 1～2 分钟再运行 npm run setup:supabase
  · 只粘了主机名没粘完整 URI → 必须整段以 postgresql:// 开头
`);
  process.exitCode = 1;
} finally {
  rl.close();
}
