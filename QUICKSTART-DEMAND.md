# 🚀 需求雷达 - 5分钟快速开始

## Step 1: 启动项目

```bash
cd hotspot-web
pnpm install
pnpm dev
```

## Step 2: 访问需求雷达

浏览器打开: **http://localhost:3000**

在顶部导航栏点击 **"需求雷达"** 标签

## Step 3: 查看需求信号

你会看到来自以下源的聚合需求:

### 🔴 Reddit 社区需求
- r/SaaS, r/Entrepreneur, r/startups 等
- 自动提取包含"need", "looking for", "alternative"等关键词的帖子
- 按热度(upvotes + comments)排序

### 🟠 GitHub Issues
- 热门开源项目的 feature requests
- 高赞+高评论的功能需求
- 实时反映开发者痛点

### 🟡 Hacker News Ask
- "Ask HN"类问题
- 开发者社区的真实疑问
- 技术决策参考

### 🟢 Product Hunt (待配置API)
- 新产品趋势
- 替代品动向
- 市场验证信号

## 💡 快速筛选高价值需求

### 看分数(Score)
- **100+** - 有一定热度
- **300+** - 中等热度,值得关注  
- **500+** - 高热度,强需求信号
- **1000** - 爆款需求!

### 看互动
- **💬 评论数高** - 真实讨论,非灌水
- **⬆️ 点赞数高** - 共鸣强烈

### 看关键词
- **"willing to pay"** - 有预算,转化率高
- **"alternative to XXX"** - 竞品空白机会
- **"frustrated with"** - 痛点强烈

## 🔧 自定义配置

### 修改关注的Reddit社区

编辑 `server/sources/reddit-signals.ts`:

```typescript
const subreddits = [
  "SaaS",           // 保留
  "Entrepreneur",   // 保留
  "startups",       // 保留
  "webdev",         // 保留
  "AppIdeas",       // 保留
  "productivity",   // 添加:生产力工具
  "sideproject",    // 添加:副业项目
  "nocode"          // 添加:无代码工具
]
```

### 修改关注的GitHub仓库

编辑 `server/sources/github-issues.ts`:

```typescript
const repos = [
  "vercel/next.js",          // 保留
  "supabase/supabase",       // 保留
  "your-favorite/repo",      // 添加你关心的
]
```

修改后**重启服务**即可生效。

## 📊 使用示例

### 场景1: 寻找创业点子

1. 打开需求雷达
2. 筛选 **score > 500** 的需求
3. 查看是否有 **重复出现** 的痛点
4. 优先选择包含 **"budget"** / **"paid"** 的需求(有付费意愿)

### 场景2: 产品功能规划

1. 查看 **GitHub Issues** 源
2. 找到竞品的高赞 feature requests
3. 评估是否可以在自己产品中实现
4. 作为差异化卖点

### 场景3: 内容创作

1. 查看 **HN Ask** 的高分问题
2. 写博客/拍视频回答
3. 在原帖分享,获取精准流量

## ⚡ 高级技巧

### 1. 设置自动提醒

编辑 `HEARTBEAT.md`:

```markdown
每天检查需求雷达,如果发现:
- Score > 800 的新需求
- 包含"willing to pay"关键词
- GitHub issues中相关仓库的新高赞请求

立即通知我!
```

### 2. 导出需求报告

```bash
npx tsx tools/demand-analyzer.ts > weekly-demand-report.json
```

生成本周需求总结,包括:
- Top 30 需求
- 关键词聚类
- 趋势分析

### 3. 对接Notion数据库

参考 `skills/notion/SKILL.md`,将高价值需求自动同步到Notion看板。

## 🐛 遇到问题?

### 数据不更新
- 清除浏览器缓存
- 等待一个更新周期(10-30分钟)
- 检查控制台是否有API错误

### GitHub 429错误(超限)
添加环境变量:

```bash
# .env.server
GITHUB_TOKEN=ghp_your_token_here
```

获取token: https://github.com/settings/tokens

### Reddit数据为空
- Reddit可能限流
- 降低请求频率: 修改 `shared/sources.json` 中的 `interval` 为 `1800000`(30分钟)

## 📚 深入学习

- [DEMAND-RADAR.md](./DEMAND-RADAR.md) - 完整文档
- [INTEGRATION-SUMMARY.md](./INTEGRATION-SUMMARY.md) - 集成总结

---

**就这么简单!** 🎉

现在你有了一个实时更新的需求雷达,去发现下一个大机会吧! 🚀
