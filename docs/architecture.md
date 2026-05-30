# MedAccess Global — 技术架构文档 v3.0

> 版本：v3.0 · 最后更新：2025年
> 整合两轮工程审查意见，为最终执行版本
> 本文档是所有技术决策的依据，开发中如有疑问以本文档为准

---

## 一、产品核心逻辑（架构的出发点）

**这个产品的商业闭环是：**

```
患者选病种 → 精准落地页 → 加企微 → AI预分析
→ 医生审核报告 → 用户付费 → 平台履约
```

**不是：**
```
患者搜数据库 → 自己决策 → 自己购药
```

所有架构决策必须服务于这个闭环，而不是先堆一个「ClinicalTrials.gov中文版」。

---

## 二、系统全景

```
┌─────────────────────────────────────────────────────────────┐
│                        用户终端                              │
│     浏览器（PC/手机）· 企业微信 · 抖音/小红书落地页           │
└──────────────┬──────────────────────────────────────────────┘
               │ HTTPS
┌──────────────▼──────────────────────────────────────────────┐
│              Vercel — 薄层，只做路由和渲染                    │
│  ┌─────────────┐  ┌──────────────┐  ┌─────────────────────┐ │
│  │ 病种Hub     │  │ 功能页面     │  │ API Routes（薄层）  │ │
│  │ /d/[slug]/  │  │ /dashboard   │  │ 不跑耗时任务        │ │
│  │ SSG/ISR     │  │ /admin       │  │                     │ │
│  └─────────────┘  └──────────────┘  └──────────┬──────────┘ │
└─────────────────────────────────────────────────┼────────────┘
                                                  │
          ┌──────────────┬───────────────────────┤
          │              │                       │
┌─────────▼────┐  ┌──────▼──────┐  ┌────────────▼──────────┐
│  Supabase    │  │Upstash Redis │  │   Inngest Queue       │
│  PostgreSQL  │  │ 限流+缓存    │  │   异步任务队列         │
│  + Storage   │  └─────────────┘  └────────────┬──────────┘
│  + Auth      │                               │
└──────────────┘                   ┌───────────▼──────────┐
                                   │  独立Worker服务       │
                                   │  Railway / Fly.io    │
                                   │                      │
                                   │ · 数据同步/爬虫       │
                                   │ · AI异步任务          │
                                   │ · 政策追踪推送        │
                                   │ · 企微消息回复        │
                                   └──────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│              外部服务                                        │
│  Meilisearch（搜索）· 微信支付 · 企业微信API · 阿里云SMS     │
│  ClinicalTrials.gov API · ChiCTR · 京东/阿里健康联盟        │
└─────────────────────────────────────────────────────────────┘
```

---

## 三、路由架构（病种Hub为核心）

### 路由结构

```
/                              首页（病种选择）
/d/[slug]                      病种Hub首页（概览）
/d/[slug]/trials               该病种临床试验列表
/d/[slug]/charity              该病种慈善赠药
/d/[slug]/drugs                该病种药物/通道信息
/d/[slug]/report               轻量AI入口（深度服务导企微）

/search                        全库检索（跨病种）
/channels/boao                 博鳌通道介绍
/channels/trials               临床试验通道介绍
/channels/hkmo                 港澳药械通介绍
/channels/charity              慈善赠药介绍

/dashboard                     用户中心
/dashboard/subscriptions       订阅管理
/dashboard/reports             我的报告
/dashboard/tracking            关注追踪

/admin                         医生/运营后台
/admin/reports                 待审核报告列表
/admin/reports/[id]            审核单份报告
/admin/cases                   服务案例管理

/subscribe                     订阅购买页
```

### 病种Hub设计

```
用户从抖音点击「肺癌EGFR免费试验」广告
                ↓
落地页：/d/fei-ai-egfr/trials?utm_source=douyin&utm_campaign=egfr_trial
                ↓
页面自动聚焦：肺癌EGFR突变 · 临床试验Tab
用户无需再选病种
                ↓
底部固定：「加企微顾问，核实您是否符合入组条件」
企微链接带参数：?customer_channel=web_feiai_egfr_douyin
                ↓
企微自动打标签：病种:肺癌EGFR · 来源:抖音
AI首轮不重复问病种，直接问关键信息
```

### 病种词典（不硬编码）

```typescript
// lib/diseases/catalog.ts → 初期文件，后期迁移到数据库

interface Disease {
  slug: string           // URL标识
  name: string           // 展示名称
  shortName: string      // 简称（用于标签）
  aliases: string[]      // 别名（用于搜索匹配）
  genes?: string[]       // 相关基因
  relatedDrugs?: string[] // 相关药物
  searchKeywords: string[] // 搜索同义词
  parentSlug?: string    // 父级病种
}

// 示例数据
export const DISEASES: Disease[] = [
  {
    slug: 'fei-ai-egfr',
    name: '非小细胞肺癌（EGFR突变）',
    shortName: '肺癌EGFR',
    aliases: ['肺癌', 'NSCLC', 'EGFR突变', '非小细胞肺癌'],
    genes: ['EGFR'],
    searchKeywords: ['肺癌', 'EGFR', '奥希替尼', '厄洛替尼', 'NSCLC'],
  },
  {
    slug: 'fei-ai-alk',
    name: '非小细胞肺癌（ALK突变）',
    shortName: '肺癌ALK',
    aliases: ['肺癌', 'NSCLC', 'ALK突变'],
    genes: ['ALK'],
    searchKeywords: ['肺癌', 'ALK', '克唑替尼', '阿来替尼'],
  },
  {
    slug: 'ru-xian-ai-her2',
    name: '乳腺癌（HER2阳性）',
    shortName: '乳腺癌HER2',
    aliases: ['乳腺癌', 'HER2阳性', 'HER2+'],
    genes: ['HER2'],
    searchKeywords: ['乳腺癌', 'HER2', '曲妥珠单抗', 'T-DM1'],
  },
  {
    slug: 'sma',
    name: '脊髓性肌萎缩（SMA）',
    shortName: 'SMA',
    aliases: ['脊髓性肌萎缩', 'SMA', '运动神经元病'],
    searchKeywords: ['SMA', '诺西那生', '利司扑兰', '基因治疗'],
  },
  // ... 更多病种
]
```

### 全站病种Context

```typescript
// app/d/[slug]/layout.tsx
// 读取slug → 注入DiseaseProvider → 所有子页面共享

export default async function DiseaseLayout({
  children,
  params
}: {
  children: React.ReactNode
  params: { slug: string }
}) {
  const disease = getDiseaseBySlug(params.slug)
  if (!disease) notFound()

  return (
    <DiseaseProvider disease={disease}>
      <DiseaseNav disease={disease} />  {/* 病种导航Tab */}
      {children}
      <WechatFloat disease={disease} />  {/* 企微按钮带病种参数 */}
    </DiseaseProvider>
  )
}
```

---

## 四、数据模型（完整版）

```prisma
// ── 病种词典 ──
model Disease {
  slug          String   @id
  name          String
  shortName     String
  aliases       String[]
  genes         String[]
  searchKeywords String[]
  parentSlug    String?
  isActive      Boolean  @default(true)
  reports       Report[]
  trackings     Tracking[]
}

// ── 临床试验 ──
model ClinicalTrial {
  id            String   @id
  source        String   // "clinicaltrials"|"chictr"|"cde"
  nctId         String?  @unique
  title         String
  titleCn       String?
  disease       String[]
  diseaseSlug   String[] // 关联Disease.slug
  phase         String?
  status        String   // "recruiting"|"completed"|"suspended"
  isFree        Boolean  @default(true)
  locations     Json     // [{hospital, city, province}]
  eligibility   Json     // {minAge, maxAge, criteria[]}
  contactInfo   Json?
  startDate     DateTime?
  syncedAt      DateTime
  updatedAt     DateTime @updatedAt
  statusHistory TrialStatusHistory[]
}

model TrialStatusHistory {
  id        String        @id @default(cuid())
  trialId   String
  trial     ClinicalTrial @relation(fields: [trialId], references: [id])
  oldStatus String
  newStatus String
  changedAt DateTime      @default(now())
}

model RawTrialData {
  id        String   @id @default(cuid())
  source    String
  rawJson   Json
  processed Boolean  @default(false)
  fetchedAt DateTime @default(now())
}

// ── 慈善赠药 ──
model CharityProgram {
  id          String   @id @default(cuid())
  drugName    String
  company     String
  indication  String[]
  diseaseSlug String[]
  criteria    String
  benefit     String
  applyUrl    String?
  deadline    DateTime?
  isActive    Boolean  @default(true)
  updatedAt   DateTime @updatedAt
}

// ── 博鳌目录 ──
model BoaoDrug {
  id          String   @id @default(cuid())
  name        String
  nameCn      String?
  company     String
  indication  String[]
  diseaseSlug String[]
  approvedBy  String[]
  isAvailable Boolean  @default(true)
  updatedAt   DateTime @updatedAt
}

// ── 用户体系 ──
model User {
  id              String   @id @default(cuid())
  phone           String?  @unique
  wechatOpenId    String?  @unique
  wxWorkUserId    String?  @unique  // 企业微信external_userid
  // 归因：首次进入时的渠道参数
  utmSource       String?  // xiaohongshu|douyin|kuaishou|bilibili|seo
  utmCampaign     String?
  utmContent      String?
  firstDiseaseSlug String? // 首次选择的病种
  wxChannel       String?  // 企业微信带参渠道
  createdAt       DateTime @default(now())
  subscription    Subscription?
  reports         Report[]
  trackings       Tracking[]
  orders          Order[]
  serviceCases    ServiceCase[]
  affiliateClicks AffiliateClick[]
}

// ── 订单（所有付费行为的统一记录）──
model Order {
  id              String   @id @default(cuid())
  userId          String
  user            User     @relation(fields: [userId], references: [id])
  type            String   // "subscription"|"service_trial"|"service_boao"|"service_hkmo"|"service_charity"
  amount          Int      // 分为单位
  status          String   // "pending"|"paid"|"refunded"|"failed"
  wxpayPrepayId   String?
  wxpayTradeNo    String?
  paidAt          DateTime?
  createdAt       DateTime @default(now())
  subscription    Subscription?
  serviceCase     ServiceCase?
}

// ── 订阅（仅订阅类服务）──
model Subscription {
  id          String   @id @default(cuid())
  userId      String   @unique
  user        User     @relation(fields: [userId], references: [id])
  orderId     String   @unique
  order       Order    @relation(fields: [orderId], references: [id])
  tier        String   // "basic"|"disease"|"waiting"|"enterprise"
  diseases    String[]
  drugs       String[] // 等待期追踪的具体药物
  expiresAt   DateTime
  createdAt   DateTime @default(now())
}

// ── 服务案例（一次性服务的履约过程）──
// 和Subscription完全分开，履约逻辑不同
model ServiceCase {
  id            String   @id @default(cuid())
  userId        String
  user          User     @relation(fields: [userId], references: [id])
  orderId       String   @unique
  order         Order    @relation(fields: [orderId], references: [id])
  type          String   // "trial"|"boao"|"hkmo"|"charity"
  diseaseSlug   String
  reportId      String?  // 关联的AI报告
  status        String   // "created"|"in_progress"|"completed"|"failed"
  notes         String?  // 服务备注
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}

// ── AI报告（含医生审核流）──
model Report {
  id              String   @id @default(cuid())
  userId          String?
  user            User?    @relation(fields: [userId], references: [id])
  sessionId       String   // 未登录用户临时ID
  diseaseSlug     String?
  disease         Disease? @relation(fields: [diseaseSlug], references: [slug])
  // 可检索摘要（明文）
  diseaseSummary  String?
  stageSummary    String?
  // 敏感病情详情（加密）
  conditionEnc    Bytes?
  // AI分析结果
  aiResult        Json?
  matches         Json?
  jobId           String?
  // 医生审核流
  status          String   @default("pending")
  // pending_ai → pending_review → approved → rejected → sent
  reviewerId      String?  // 审核医生的User.id
  reviewedAt      DateTime?
  doctorNotes     String?  // 医生修改AI结论的备注
  finalResult     Json?    // 医生确认/修改后的最终结果
  sentToUserAt    DateTime?
  createdAt       DateTime @default(now())
}

// ── 政策追踪 ──
model Tracking {
  id          String   @id @default(cuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  diseaseSlug String?
  disease     Disease? @relation(fields: [diseaseSlug], references: [slug])
  type        String   // "drug"|"disease"|"trial"
  keyword     String
  createdAt   DateTime @default(now())
}

// ── 佣金追踪（京东/阿里健康导流）──
model AffiliateClick {
  id        String   @id @default(cuid())
  userId    String?
  user      User?    @relation(fields: [userId], references: [id])
  reportId  String?
  drugName  String
  platform  String   // "jd"|"ali_health"|"other"
  trackUrl  String   // 带追踪参数的跳转链接
  clickedAt DateTime @default(now())
  // 佣金到账后回填
  commission Int?    // 分为单位
  settledAt  DateTime?
}

// ── 同步日志 ──
model SyncLog {
  id          String   @id @default(cuid())
  source      String
  status      String   // "success"|"failed"|"partial"
  newCount    Int      @default(0)
  updateCount Int      @default(0)
  errorMsg    String?
  duration    Int?
  syncedAt    DateTime @default(now())
}
```

---

## 五、P0商业闭环（最小可用版本）

### 重排后的P0优先级

```
原错误P0：先堆全站API和数据库
正确P0：先跑通商业闭环
```

**P0必须完成的6件事：**

```
① 病种词典 + /d/[slug] Hub
  有了这个，所有流量都有精准落地页
  抖音投放可以直接落到病种页，不用用户再选

② 首页病种选择 → 进Hub → 企微导流
  企微链接带病种和渠道参数
  企微侧自动打标签，AI首轮不重复问病种

③ 企微收消息/图片 → AI预分析 → 创建Report
  Report初始状态：pending_review

④ Admin后台（哪怕极简）
  /admin/reports 列表
  医生打开Report，看AI结论，修改，审核通过
  触发：推送给用户 + 附上付费链接

⑤ 微信支付单次服务费
  用户付799/2999/1499/399 → 创建Order + ServiceCase
  企微推送「已收到您的委托，开始协助」

⑥ 报告内推荐
  四大通道申请入口
  国内可购药物 → 生成带追踪的京东/阿里链接
  记录AffiliateClick
```

**P0不做的事（移到P1）：**
```
· 临床试验实时数据库同步（先用静态数据演示）
· 订阅系统
· 政策追踪推送
· 用户中心完整功能
· 全站搜索优化
```

---

## 六、前端架构

### HTML迁移（最先做）

```
medaccess-global.html（1300+行）
        ↓ 拆分为
app/(marketing)/page.tsx           首页（病种选择）
app/d/[slug]/layout.tsx            病种Hub壳
app/d/[slug]/page.tsx              病种概览
app/d/[slug]/trials/page.tsx       试验列表
app/d/[slug]/charity/page.tsx      慈善赠药
app/d/[slug]/drugs/page.tsx        药物/通道
app/d/[slug]/report/page.tsx       AI入口
app/admin/reports/page.tsx         审核后台

components/
├── disease/
│   ├── DiseaseSelector.tsx        首页病种选择组件
│   ├── DiseaseNav.tsx             Hub内导航Tab
│   └── DiseaseProvider.tsx        全站病种Context
├── trials/TrialCard.tsx
├── wechat/
│   ├── WechatFloat.tsx            悬浮按钮（带病种参数）
│   └── WechatBanner.tsx           内嵌引导条
├── report/ReportCard.tsx
└── ui/                            基础组件
```

### 社媒归因追踪

```typescript
// lib/attribution.ts
// 所有落地页统一处理utm参数

export function captureAttribution(searchParams: URLSearchParams) {
  const attrs = {
    utmSource:   searchParams.get('utm_source'),    // xiaohongshu|douyin
    utmCampaign: searchParams.get('utm_campaign'),
    utmContent:  searchParams.get('utm_content'),
    wxChannel:   searchParams.get('customer_channel'),
  }
  
  // 存入Cookie（30天）供后续页面读取
  // 用户注册时写入User表
  return attrs
}

// 企微链接生成（带病种和渠道参数）
export function buildWechatLink(diseaseSlug: string, source: string) {
  const channel = `web_${diseaseSlug}_${source}`
  return `https://work.weixin.qq.com/kfid/xxx?customer_channel=${channel}`
}
```

---

## 七、医生审核模块

### Report状态流转

```
用户提交病情
     ↓
pending_ai（AI处理中）
     ↓
pending_review（等待医生审核）
     ↓
医生打开Admin后台
     ↓
approved（直接通过）或 修改后approved
     ↓
sent（已推送给用户）
     ↓
（可选）rejected（病情不适合，给出建议）
```

### Admin后台（极简P0版）

```
/admin/reports
  · 待审核列表（按时间排序）
  · 每条显示：病种、提交时间、AI置信度
  · 点击进入详情

/admin/reports/[id]
  · 左侧：用户原始病情输入（解密显示）
  · 中间：AI生成的匹配报告
  · 右侧：医生操作区
    - 修改AI结论（富文本）
    - 添加医生备注
    - 选择推荐通道
    - [审核通过] → 自动推送用户 + 生成付费链接
    - [驳回] → 填写驳回原因，推送用户其他建议
```

```typescript
// Report审核通过后自动执行
async function approveReport(reportId: string, reviewerId: string, finalResult: any) {
  await prisma.report.update({
    where: { id: reportId },
    data: {
      status: 'approved',
      reviewerId,
      reviewedAt: new Date(),
      finalResult,
    }
  })
  
  // 入队：推送企微消息 + 生成付费链接
  await inngest.send({
    name: 'report/approved',
    data: { reportId }
  })
}
```

---

## 八、后端API（薄层）

```typescript
// Vercel API Routes只做转发，不跑重活

// 检索：带病种上下文
// GET /api/search?q=...&disease=fei-ai-egfr&type=trial
// 后端用diseaseSlug展开为disease[]匹配 + 全文检索 + 基因/药物别名

// 临床试验：默认带病种过滤
// GET /api/trials?disease=fei-ai-egfr&status=recruiting

// AI分析：异步，立即返回jobId
// POST /api/ai/analyze → { jobId, reportId }

// 企微Webhook：立即返回200，入队处理
// POST /api/webhook/wechat → 200

// 支付：创建Order + 预支付
// POST /api/subscribe → { prepayId, orderId }

// 佣金链接生成
// GET /api/affiliate/link?drug=xxx&platform=jd&reportId=xxx
// 返回带追踪参数的跳转链接，记录AffiliateClick
```

---

## 九、企业微信集成（异步模式）

### ⚠️ 必须异步，不能同步调AI

```typescript
// app/api/webhook/wechat/route.ts
export async function POST(req: Request) {
  const body = await req.json()
  
  // 验证企业微信签名
  if (!verifyWechatSignature(req, body)) {
    return new Response('', { status: 403 })
  }
  
  // 立即入队，不等结果
  await inngest.send({
    name: 'wechat/message.received',
    data: {
      userId: body.FromUserName,
      msgType: body.MsgType,
      content: body.Content,
      mediaId: body.MediaId,
    }
  })
  
  // 5秒内返回200，企业微信不超时
  return new Response('', { status: 200 })
}
```

### 自动标签系统

```
用户通过 /d/fei-ai-egfr 页面加企微
企微链接：?customer_channel=web_feiai_egfr_douyin
                ↓
企微后台自动打标签：
  · 病种:肺癌EGFR
  · 来源:抖音
  · 状态:新用户
                ↓
AI首轮消息：
  「您好，看到您是通过肺癌EGFR相关内容找到我们的。
   请问患者目前是什么分期？有没有做过基因检测？」
（已知病种，不重复问）
```

---

## 十、搜索方案

### 分阶段实施

**P0阶段（快速上线）：**
```
pg_trgm扩展 + 关键词映射表
够用，不完美，先跑通
```

**P1阶段（上线后1个月）：**
```
迁移到Meilisearch
Railway一键部署
中文分词正常
毫秒级响应
```

### Meilisearch配置

```javascript
// 索引配置
const trialsIndex = client.index('trials')
await trialsIndex.updateSettings({
  searchableAttributes: ['title', 'titleCn', 'disease', 'conditions'],
  filterableAttributes: ['status', 'phase', 'isFree', 'diseaseSlug', 'province'],
  sortableAttributes: ['updatedAt'],
  synonyms: {
    '肺癌': ['NSCLC', '非小细胞肺癌', '小细胞肺癌'],
    'EGFR': ['表皮生长因子受体'],
    'SMA': ['脊髓性肌萎缩'],
    // ...更多同义词
  }
})
```

---

## 十一、数据同步（Worker负责）

### 架构：Vercel Cron → Queue → Worker

```
Vercel Cron（每日凌晨2点）
        ↓
/api/cron/trigger（只发消息入队）
        ↓
Inngest Queue
        ↓
Railway Worker（无时长限制）
        ↓
并行同步三个数据源：
├── ClinicalTrials.gov API（每日）
├── ChiCTR（每日）
└── CDE公示平台（每日，最不稳定）
        ↓
写入PostgreSQL（幂等）
        ↓
更新Meilisearch索引
        ↓
检查状态变更 → 触发政策追踪通知
        ↓
写入SyncLog
```

---

## 十二、佣金追踪

```typescript
// 报告审核通过后，推荐国内可购药物时生成追踪链接

// GET /api/affiliate/link
export async function GET(req: Request) {
  const { drugName, platform, reportId, userId } = getParams(req)
  
  // 记录点击
  const click = await prisma.affiliateClick.create({
    data: { userId, reportId, drugName, platform,
            trackUrl: buildTrackUrl(drugName, platform) }
  })
  
  // 生成带追踪参数的跳转链接
  const trackUrl = platform === 'jd'
    ? `https://union-click.jd.com/...&ext=${click.id}`
    : `https://www.alihealth.cn/...&trackId=${click.id}`
  
  return Response.redirect(trackUrl)
}

// 佣金到账后（通过联盟平台webhook回填）：
await prisma.affiliateClick.update({
  where: { id: clickId },
  data: { commission, settledAt: new Date() }
})
```

---

## 十三、认证体系

### Supabase Auth（不自建）

```
手机号 + 短信验证码（主要）
微信OAuth（次要，通过公众号）
企业微信身份（通过external_userid关联）

三种身份合并：
用户手机号登录 → 创建User
同一用户企微发消息 → 匹配手机号 → 关联wxWorkUserId
无法自动匹配 → 企微引导用户绑定手机号
```

---

## 十四、限流（Upstash Redis）

```typescript
// Vercel Serverless无内存态，必须用Redis限流
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '1m'),
})

// 限流规则：
// AI分析接口：每IP每分钟10次
// 搜索接口：每IP每分钟60次
// 支付接口：每用户每分钟5次
```

---

## 十五、加密方案

```
可检索字段（明文存储，用于统计）：
  Report.diseaseSummary    病种
  Report.stageSummary      分期

加密字段（AES-256，不可检索）：
  Report.conditionEnc      完整病情描述

密钥：存Vercel环境变量ENCRYPTION_KEY
密钥轮换：新旧密钥同时有效，后台任务逐步重加密
```

---

## 十六、基础设施选型与成本

```
服务          选型              月成本估算
─────────────────────────────────────────────────
前端+API      Vercel Pro        20美元
数据库        Supabase Pro      25美元
搜索          Meilisearch       Railway 5-10美元
异步队列      Inngest           免费额度够P0
Worker        Railway           5-15美元
缓存限流      Upstash Redis     0-5美元
短信          阿里云SMS         按量，约0.04元/条
────────────────────────────────────────────────
合计                            约55-75美元/月
                                约400-550元/月
```

---

## 十七、开发时间表

### Phase 0：第1周（基础设施 + HTML迁移）
```
□ medaccess-global.html迁移到Next.js组件
□ 病种词典catalog.ts建立（10个初始病种）
□ /d/[slug] Hub路由和Layout
□ Supabase创建，Prisma Schema migrate
□ Supabase Auth手机号登录
□ Vercel部署，域名绑定
□ 社媒归因utm参数捕获
```

### Phase 1：第2-3周（商业闭环）
```
□ 企业微信Webhook（异步模式）
□ AI病情分析Job（Inngest Worker）
□ Report创建和状态管理
□ Admin后台（极简审核页面）
□ 微信支付 → Order + ServiceCase
□ 报告内京东/阿里跳转链接（AffiliateClick追踪）
□ 企微推送报告和付费链接
```

### Phase 2：第4-5周（数据接入）
```
□ ClinicalTrials.gov API接入
□ 临床试验同步Worker（Railway）
□ Meilisearch部署和索引
□ /d/[slug]/trials 展示真实数据
□ 慈善赠药数据库（人工整理50+项目）
```

### Phase 3：第6-8周（完整产品）
```
□ 订阅系统（三个层级）
□ 政策追踪推送
□ 博鳌目录同步
□ 病种专题页SEO（肺癌、乳腺癌、SMA）
□ 用户中心
□ 社媒归因统计报表
```

---

## 十八、上线前检查清单

```
合规：
□ 所有页面有免责声明
□ AI输出标注"仅供参考，请遵医嘱"
□ 医生审核通过才推送给用户
□ 不在页面直接展示药品价格或购买链接

技术：
□ 企业微信Webhook 5秒内返回200
□ 支付回调微信签名验证通过
□ 数据同步任务正常运行
□ 限流配置生效
□ 加密字段正确加密

体验：
□ 移动端适配测试通过
□ 核心页面加载 < 2秒
□ 病种Hub各Tab正常切换
□ 企微引导链接带正确参数
```
