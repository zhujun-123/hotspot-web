# ✅ 需求雷达集成完成

## 📦 已添加的文件

### 数据源 (server/sources/)
1. **reddit-signals.ts** - Reddit社区需求抓取
2. **github-issues.ts** - GitHub功能请求
3. **hackernews-ask.ts** - HN开发者问答
4. **producthunt-trends.ts** - Product Hunt新品趋势

### 配置更新
- **shared/sources.json** - 添加4个新数据源配置
- **shared/metadata.ts** - 新增"需求雷达"栏目

### 工具和文档
- **tools/demand-analyzer.ts** - 需求分析引擎
- **DEMAND-RADAR.md** - 完整使用文档
- **test-demand-sources.sh** - 数据源测试脚本

## 🚀 立即使用

### 1. 启动项目
```bash
cd hotspot-web
pnpm install  # 如果还没安装依赖
pnpm dev
```

### 2. 访问需求雷达
打开浏览器: `http://localhost:3000`

在页面顶部导航栏,你会看到新增的 **"需求雷达"** 标签,点击即可查看聚合的需求信号。

### 3. 测试数据源
```bash
bash test-demand-sources.sh
```

## 📊 当前配置

| 数据源 | 更新间隔 | 状态 |
|--------|---------|------|
| Reddit Signals | 10分钟 | ✅ 已配置 |
| GitHub Issues | 30分钟 | ✅ 已配置 |
| HN Ask | 10分钟 | ✅ 已配置 |
| Product Hunt | 1小时 | ⚠️ 需配置API |

## 🔧 下一步优化

### 立即可做
1. **调整Reddit子版块**
   编辑 `server/sources/reddit-signals.ts` 第8行,修改:
   ```typescript
   const subreddits = ["SaaS", "Entrepreneur", "startups", "webdev", "AppIdeas"]
   ```
   添加你关心的subreddit

2. **调整GitHub仓库**
   编辑 `server/sources/github-issues.ts` 第9-16行:
   ```typescript
   const repos = [
     "vercel/next.js",
     "facebook/react",
     // 添加你想关注的仓库
   ]
   ```

3. **修改评分权重**
   编辑 `tools/demand-analyzer.ts` 第109-129行,调整评分逻辑

### 需要API密钥
- **GitHub Token** - 提升API限额(60/h → 5000/h)
  - 在 `.env.server` 添加: `GITHUB_TOKEN=your_token`
  - 在sources中使用: `headers: { Authorization: Bearer ${process.env.GITHUB_TOKEN} }`

- **Product Hunt API** - 获取完整数据
  - 申请: https://api.producthunt.com/v2/oauth/applications
  - 参考 `producthunt-trends.ts` 的GraphQL查询

## 📈 部署到Vercel

### 环境变量(可选)
```env
# .env.server
GITHUB_TOKEN=ghp_xxx...  # 提升GitHub API限额
PH_API_TOKEN=xxx...       # Product Hunt API
```

### 部署步骤
1. 提交代码:
   ```bash
   git add .
   git commit -m "feat: 添加需求雷达功能"
   git push
   ```

2. Vercel自动部署(如果已连接)
   或手动: `vercel --prod`

## 🎯 使用场景示例

### 发现创业机会
1. 打开"需求雷达"
2. 筛选 **score > 500** 的高分需求
3. 查看 **重复出现** 的问题(说明需求强烈)
4. 关注包含 **"willing to pay"** 的讨论

### 产品功能规划
1. 查看 **GitHub Issues** 源
2. 看竞品的高赞feature requests
3. 找到自己产品可以差异化的点

### 内容创作
1. 查看 **HN Ask** 的高赞问题
2. 写文章/做视频解答
3. 在原帖分享,获取流量

## 🐛 常见问题

### Q: 数据不更新?
A: 检查 `interval` 设置,首次启动需要等待一个周期。强制刷新可以清除浏览器缓存。

### Q: GitHub API 429错误?
A: 超出限额(60/h),添加 `GITHUB_TOKEN` 环境变量即可提升到5000/h。

### Q: Reddit数据为空?
A: Reddit可能限流,检查 `User-Agent` 设置,或降低请求频率。

### Q: 想添加更多数据源?
A: 参考 `DEMAND-RADAR.md` 的"添加新数据源"章节,或提Issue。

## 📚 相关文档

- [DEMAND-RADAR.md](./DEMAND-RADAR.md) - 完整使用指南
- [CONTRIBUTING.md](./CONTRIBUTING.md) - 贡献指南
- [README.md](./README.md) - 项目主文档

## 🤝 反馈与贡献

发现问题或有改进建议?
- 提Issue: https://github.com/your-repo/issues
- 提PR: Fork → 修改 → Pull Request

---

**集成完成!** 🎉 现在你有了一个实时的需求雷达系统。

祝发现好需求,做出好产品! 💪
