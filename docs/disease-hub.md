# 病种 Hub 页面结构与字段清单

> 产品原则：无论从哪来，先在网站浏览对应病种的公开资料；信任与强需求建立后，再通过企微上传资料、审核出方案。

---

## 一、路由结构

```
/                           首页：选病种 + 流程说明
/d/[slug]                   病种 Hub 概览
/d/[slug]/trials            临床试验列表（browse）
/d/[slug]/charity           慈善赠药列表（browse）
/d/[slug]/channels          四大通道（browse）
/d/[slug]/plan-request      引导上传资料（browse → 深服务入口）
/plan/[id]                  审核通过后的专属方案（verified）
```

SEO 落地页直接使用 `/d/fei-ai-egfr` 等路径，无需经过首页。

---

## 二、浏览模式 vs 方案模式

| 能力 | browse | verified |
|------|--------|----------|
| 公开试验列表 | ✅ | ✅ |
| 公开慈善/通道信息 | ✅ | ✅ |
| 通用企微咨询 | ✅ | ✅ |
| 「您适合…」类个性化表述 | ❌ | ✅ |
| 匹配度 / 可行性评分 | ❌ | ✅ |
| 具体购药/通道推荐 | ❌ | ✅ |
| 付费服务入口 | 可选 | ✅ |

代码入口：`lib/access/modes.ts` → `canShow()` / `getAccessRules()`

---

## 三、病种字段（Disease）

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | string | 内部 ID |
| `slug` | string | URL 标识，如 `fei-ai-egfr` |
| `name` | string | 完整名称 |
| `shortName` | string | 短名，用于 Hero |
| `parentId` | string | 大类 ID |
| `parentName` | string | 大类名称 |
| `aliases` | string[] | 同义词 |
| `searchKeywords` | string[] | 检索扩展词 |
| `seoTitle` | string | 页面 title |
| `seoDescription` | string | meta description |
| `heroTagline` | string | Hub 副标题 |

数据源：`lib/diseases/catalog.ts`

---

## 四、Report 字段（方案模式，后续接 Prisma）

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | string | 报告 ID |
| `status` | enum | uploaded → ai_extracted → pending_review → reviewed → sent |
| `navigationDiseaseSlug` | string | 审核后用于网站 Context |
| `conditionSummary` | string | 病情导航摘要 |
| `documentedDiagnosis` | string | 资料中的诊断表述（引用，非平台下结论） |
| `confidence` | high/medium/low | 资料完整度 |
| `channels` | json | 建议了解的方向 |
| `disclaimer` | string | 免责声明 |
| `reviewedAt` | datetime | 审核时间 |
| `sentToUserAt` | datetime | 发送用户时间 |

---

## 五、Hub 页面模块清单

### 所有 `/d/[slug]/*` 页面共有

- [x] SiteNav（含当前病种 + 切换入口）
- [x] Disclaimer
- [x] BrowseModeBar（browse 模式提示 + CTA）
- [x] HubTabs（概览 / 试验 / 慈善 / 通道）

### 概览页 `/d/[slug]`

- [x] Hero（病种标题）
- [x] 统计卡片（试验数 / 慈善数 / 通道数）
- [x] 各模块预览

### 试验 / 慈善 / 通道子页

- [x] 按 `diseaseSlug` 过滤的公开列表
- [ ] 分页（接 API 后）
- [ ] 筛选（分期、地区、免费）

### plan-request

- [x] 上传资料流程说明
- [x] 企微 CTA（带 `disease` 参数）

### plan/[id]（verified）

- [x] 病情摘要 + 通道建议（mock）
- [ ] 接 Report 表 + 权限校验

---

## 六、企微链接参数规范

```
https://work.weixin.qq.com/contact?from=web&disease={slug}&report={id}
```

| 参数 | 说明 |
|------|------|
| `from` | 来源：web / seo / douyin 等 |
| `disease` | 当前病种 slug |
| `report` | 可选，方案页 ID |

---

## 七、下一步（P0 后续）

1. 将 mock 数据替换为 `/api/trials` 等 API
2. 添加 Prisma `Disease` / `Report` / `ClinicalTrial` 模型
3. 企微 webhook 收资料 → 写 Report → Admin 审核
4. 审核通过后生成 `/plan/[id]` 链接推送用户
