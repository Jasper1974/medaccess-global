# MedAccess Global — Claude Code 项目上下文

## 项目一句话定位

MedAccess Global 是重症患者的全球用药导航平台。不卖药，做导航。
帮患者找到国内找不到的药物、免费临床试验、五大合规通路。
导航免费，服务收费，交易收佣。

---

## 技术栈（当前已实现 vs 规划）

```
已实现
  前端     Next.js 16 (App Router) + React 19 + TypeScript + Tailwind CSS 4
  数据     lib/mock/hub-data.ts（mock，待替换）
  部署目标 Vercel

规划（P0 后续接入，尚未安装依赖）
  数据库   Supabase PostgreSQL + Prisma
  认证     Supabase Auth（手机号 + 微信 OAuth）
  搜索     pg_trgm（P0）→ Meilisearch（P1，中文友好）
  异步队列 Inngest（AI、推送、爬虫异步化）
  Worker   Railway（爬虫、长时 AI 任务）
  缓存限流 Upstash Redis
  AI       GPT-4o（影像）+ Claude Sonnet（报告）+ GPT-4o-mini（问答）
  支付     微信支付
  私域     企业微信 API（Webhook 5 秒内返回 200，AI 必须异步）
  归因     utm → Cookie → User，多渠道 ROI
```

---

## 核心产品原则（已确认，开发必须遵守）

### 用户路径：C 方案「先浏览，再深服务」

```
任意渠道进入（SEO / 抖音 / 小红书 / 直接访问）
        ↓
网站浏览对应病种的公开资料（试验 / 慈善 / 通道）
        ↓
建立信任 + 产生强需求
        ↓
点击「我申请」或加平台企业微信
        ↓
上传资料 → AI 整理 → 医生审核 → 出方案（verified 模式）
        ↓
四条通路落地：试验进组 / 慈善赠药 / 国内购药 / 博鳌·港澳
```

- **不要**在网站门口强制上传资料或反复推企微（降低疑虑）
- **不要**在详情页申请区写「首次匹配核实完全免费」——留到资料提交后（企微自动回复）再告知
- 详情页申请：仅「我申请」按钮 → 弹窗二维码 +「请加平台企业微信，上传资料，验证进组资格」

### browse vs verified 两种模式

| 能力 | browse（默认） | verified（审核通过后） |
|------|----------------|------------------------|
| 公开试验/慈善/通道列表 | ✅ | ✅ |
| 「您适合…」类个性化表述 | ❌ | ✅ |
| 匹配度 / 可行性评分 | ❌ | ✅ |
| 具体购药/通道强推荐 | ❌ | ✅ |
| 付费服务入口 | 可选 | ✅ |

代码入口：`lib/access/modes.ts` → `canShow()` / `getAccessRules()`

### 产品定位边界（合规）

- 平台**永远不**销售药品，不参与药品交易
- 平台**永远不**提供诊断意见；对外说「资料整理与通道导航」，不说「验证诊断 / 防误诊」
- AI 输出必须含免责声明；最终方案须医生审核（`pending_review → approved → sent`）
- 试验详情页保留免责小字：「不提供诊断意见，不承诺入组结果」

---

## 当前目录结构（以仓库实际为准）

```
medaccess-global/
├── CLAUDE.md                      # 本文件
├── docs/
│   ├── architecture.md            # 技术架构（部分与实现不同步，以本文件+ disease-hub.md 为准）
│   └── disease-hub.md             # 病种 Hub 路由与字段清单
├── medaccess-global.html          # 早期静态首页（已迁移到 app/page.tsx，保留作设计参考）
├── app/
│   ├── layout.tsx                 # 根布局（Cormorant + DM Sans 字体）
│   ├── page.tsx                   # 首页
│   ├── d/[slug]/                  # 病种 Hub
│   │   ├── page.tsx               # 概览
│   │   ├── trials/
│   │   │   ├── page.tsx           # 试验列表（Excel 式列头筛选）
│   │   │   └── [id]/page.tsx      # 试验详情 + 我申请
│   │   ├── charity/page.tsx
│   │   ├── channels/page.tsx
│   │   └── plan-request/page.tsx  # 引导上传资料（企微）
│   └── plan/[id]/page.tsx         # 审核后方案页（verified，demo: /plan/demo）
├── components/
│   ├── home/                      # 首页区块（HeroSearch、各通道 Section、MatchFlow）
│   ├── trials/                    # TrialTable、TrialApplyPanel
│   ├── hub/                       # 病种 Hub 内列表组件
│   ├── disease/                   # BrowseModeBar、DiseasePicker（Hub 用）
│   ├── layout/                    # SiteNav、SiteFooter、Disclaimer
│   ├── wechat/                    # WechatQrModal
│   └── ui/                        # BackLink 等
├── lib/
│   ├── db/prisma.ts               # Prisma 单例
│   ├── trials/                    # 试验仓储（DB + mock 回退）
│   ├── nav-links.ts               # 导航配置、WECHAT_CTA
│   ├── access/modes.ts            # browse / verified 规则
│   ├── diseases/
│   │   ├── catalog.ts             # 病种词典（10 大类 + 细分）
│   │   └── search.ts              # 首页搜索匹配病种
│   └── mock/hub-data.ts           # Mock 种子（慈善/通道仍用）
├── app/api/trials/route.ts        # GET ?diseaseSlug= | ?id=
├── types/
│   ├── disease.ts
│   ├── trial.ts
│   ├── access.ts
│   └── report.ts
└── prisma/                        # schema、migrations、seed
```

**尚未实现：** `scripts/crawlers/`、Admin 后台、Route Groups `(marketing)`/`(app)`、企微/支付

---

## 路由与页面说明

### 首页 `/`

- Hero：输入框 + 快捷标签 + 金色「开始检索 →」
- 五大通路区块（各含介绍卡片 + 部分含数据列表）：
  1. `#trials` 免费临床试验招募
  2. `#charity` 慈善赠药项目
  3. `#boao` 海南博鳌乐城治疗项目
  4. `#hkmo` 港澳药械通
  5. `#domestic-pharmacy` 国内购药合作平台（京东/阿里导流，不参与交易）
- `#match-flow` 匹配四条通路全流程（企微→上传→报告→审核→四通路）
- `#about` 关于我们

导航配置：`lib/nav-links.ts` → `MAIN_NAV`（7 项）

### 病种 Hub `/d/[slug]`

- SEO / 社媒落地页直接进此路径（如 `/d/fei-ai-egfr`）
- 概览 + Tab：试验 / 慈善 / 四大通道（Hub 内仍用 BrowseModeBar，待后续简化）

### 试验二级页 `/d/[slug]/trials`

- **简洁布局**：返回链接 + 标题 + 表格（无独立筛选区、无 HubTabs、无 BrowseModeBar）
- **列头筛选**：点击列标题 ▼ 弹出该列筛选（编号来源、名称关键词、病种、分期、地点、日期、状态）
- 数据字段见 `types/trial.ts`（含 `crawledAt`、`recruitmentEndDate`、`locations[]` 等，对齐爬虫）

### 试验详情 `/d/[slug]/trials/[id]`

- 完整试验信息 + 灰色申请框（`bg-gold-dim`）
- 按钮文案：**「我申请」**（不是「加企业微信」）
- 点击 → `WechatQrModal`：二维码占位 +「请加平台企业微信，上传资料，验证进组资格」
- 框底保留免责小字

### 方案页 `/plan/[id]`（verified）

- 审核通过后访问；当前 demo：`/plan/demo`

---

## 匹配全流程（产品逻辑）

```
01 添加平台企业微信
02 上传医疗检查资料
03 生成匹配报告（AI 整理）
04 医生审核确认
        ↓
审核通过后 · 四个通路：
  通路01  医学实验招募进组
  通路02  慈善赠药
  通路03  国内有药 · 平台购药（京东大药房 / 阿里健康）
  通路04  国内无药 · 合规通道（博鳌乐城 / 港澳药械通）
```

---

## 病种词典

- 数据源：`lib/diseases/catalog.ts`
- 10 大类 + 细分（如 `fei-ai-egfr`、`sma`）
- 字段：`slug`、`name`、`shortName`、`aliases`、`searchKeywords`、`seoTitle` 等
- 首页搜索 → `resolveDiseaseFromQuery()` → 跳转 `/d/[slug]`
- 企微链接带参：`buildWechatUrl(slug, { trialId, intent })`

---

## 数据库模型（规划，Prisma 待落地）

在原有模型基础上，Report 须扩展状态机：

```prisma
model Report {
  id                      String   @id @default(cuid())
  userId                  String?
  sessionId               String
  status                  String   // uploaded | ai_extracted | pending_review | reviewed | rejected | sent
  navigationDiseaseSlug   String?
  condition               Json     // 加密存储
  conditionSummary        String?
  documentedDiagnosis     String?  // 引用原报告表述，非平台下结论
  matches                 Json?
  reviewedAt              DateTime?
  sentToUserAt            DateTime?
  createdAt               DateTime @default(now())
}

model Order {
  id            String   @id @default(cuid())
  userId        String
  type          String   // trial_assist | boao | hkmo | charity
  amount        Int
  status        String   // pending | paid | refunded
  reportId      String?
  createdAt     DateTime @default(now())
}

model ClinicalTrial {
  id                  String    @id
  source              String    // clinicaltrials | chictr
  sourceId            String    @unique
  title               String
  titleCn             String?
  diseaseSlugs        String[]
  diseaseLabel        String?
  phase               String?
  status              String
  locations           String[]
  eligibility         String?
  summary             String?
  isFree              Boolean   @default(true)
  crawledAt           DateTime
  recruitmentEndDate  DateTime?
  startDate           DateTime?
  syncedAt            DateTime
}
```

**Order（一次性服务费）与 Subscription（订阅）必须分表。**

---

## 收入模型

```
第一层  一次性服务费  试验协助799 / 博鳌2999 / 港澳1499 / 慈善399  → Order + ServiceCase
第二层  订阅          基础99 / 病种199 / 等待期299 / 企业5000/年   → Subscription
第三层  佣金          国内已上市药导流京东/阿里                    → AffiliateClick
第四层  ToB           药厂招募1500-3000元/人
```

---

## AI 集成规范

```typescript
type AITask = 'quick_answer' | 'condition_analysis' | 'report_generation' | 'image_analysis'

const modelRouter = {
  quick_answer:       'gpt-4o-mini',
  condition_analysis: 'claude-sonnet',
  report_generation:  'claude-sonnet',
  image_analysis:     'gpt-4o',
}
```

AI 报告必填：`disclaimer`、`condition_summary`、`channels`、`confidence`、`requires_doctor_review`、`generated_at`

---

## 开发进度与优先级

### ✅ 已完成（UI / 产品壳）

- [x] 首页迁移（Hero 搜索、五大通路 Section、匹配全流程、导航）
- [x] 病种词典 + `/d/[slug]` Hub 框架
- [x] browse / verified 访问规则（`lib/access/modes.ts`）
- [x] 试验列表页：列头筛选表格 + 返回链接
- [x] 试验详情页：「我申请」+ 企微二维码弹窗 + 免责小字
- [x] 方案页 placeholder（`/plan/demo`）
- [x] `docs/disease-hub.md`

### 🔜 下一步（按优先级）

**P0-A 真实数据（推荐先做）**
- [x] Prisma schema + migrations + seed（`npm run db:migrate` / `db:seed`）
- [ ] Supabase 项目 + `.env.local` 填 `DATABASE_URL` / `DIRECT_URL`
- [ ] ClinicalTrials.gov 同步 Worker（Railway）
- [x] `/api/trials` + `lib/trials` 仓储（无 DB 时自动 mock 回退）
- [x] 页面已走仓储层；表格筛选仍客户端，字段与 schema 对齐

**P0-B 体验一致**
- [ ] 慈善赠药二级页（同试验页：列表 + 列头筛选 + 详情 + 我申请）
- [ ] `public/wechat-qr.png` 替换弹窗占位
- [ ] 企微话术：资料提交后回复「首次匹配核实完全免费」

**P0-C 商业闭环**
- [ ] 企微 Webhook（异步，5s 内 200）
- [ ] Report 状态机 + Admin `/admin/reports`
- [ ] 微信支付 → Order
- [ ] `/plan/[id]` 接真实 Report

**P1**
- [ ] 订阅系统、政策追踪、博鳌/慈善爬虫、Meilisearch、用户中心、utm 归因报表

---

## 架构约束（避免踩坑）

1. **Vercel 不跑重活**：爬虫、长 AI、批量同步 → Railway Worker + Inngest
2. **企微 Webhook**：立即 200 → 入队 → Worker 调 AI → 主动推送
3. **中文搜索**：不用 PostgreSQL `'simple'` 分词；P0 `pg_trgm`，P1 Meilisearch
4. **导航逻辑**：首页导航指向各 Section（`/#trials` 等）；通道「介绍卡片」在各自 Section 顶部，不与导航重复堆叠
5. **顶部 CTA**：`加平台企业微信匹配方案`（`lib/nav-links.ts`）；详情申请区单独用「我申请」

---

## 合规要求

1. 全站 Disclaimer 组件（`components/layout/Disclaimer.tsx`）
2. AI 内容标注「仅供参考」
3. 不展示药品价格；购药仅导流合作平台
4. 医疗资料加密存储（接入 DB 后）
5. 不用「治愈」「有效」等绝对化表述
6. 对外不说「验证诊断 / 防误诊」

---

## 常用命令

```bash
# 本地预览（浏览器打开 http://localhost:3000）
npm run dev

# 生产构建验证
npm run build

# 接入 Supabase（见 docs/supabase-setup-zh.md，只需复制粘贴）
npm run setup:supabase

# 生产部署迁移
npm run db:deploy
```

本地打不开的常见原因：终端里 `npm run dev` 未运行或已 Ctrl+C 关闭。

---

## 环境变量（.env.local，待配置）

```
DATABASE_URL=
DIRECT_URL=

OPENAI_API_KEY=
ANTHROPIC_API_KEY=

WECHAT_CORP_ID=
WECHAT_CORP_SECRET=
WECHAT_AGENT_ID=

WECHAT_PAY_MCH_ID=
WECHAT_PAY_KEY=

CLINICALTRIALS_API_BASE=https://clinicaltrials.gov/api/v2

NEXT_PUBLIC_SITE_URL=https://medaccessglobal.com
```

---

## 设计规范（视觉）

- 主色：navy `#0a1628`、gold `#c9a84c`、cream `#f4f1eb`、teal `#2dd4bf`
- 字体：Cormorant Garamond（标题）+ DM Sans（正文），见 `app/layout.tsx`
- 静态设计参考：`medaccess-global.html`

---

## 文档同步说明

| 文件 | 状态 |
|------|------|
| `CLAUDE.md` | **主上下文，优先读本文件** |
| `docs/disease-hub.md` | 病种 Hub 路由与字段，与实现同步 |
| `docs/architecture.md` | 早期架构稿，部分条目未实现 |
| `docs/product.md` / `docs/api.md` | 尚未创建 |

更新实现时，请同步修改 `CLAUDE.md` 与 `docs/disease-hub.md`。
