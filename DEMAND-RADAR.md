# 📡 需求雷达 (Demand Radar)

多源需求信号聚合与分析系统,帮助发现真实市场需求。

## 🎯 数据源

### 已集成

| 数据源 | 更新频率 | 信号类型 | 权重 |
|--------|---------|---------|------|
| **Reddit 社区** | 10分钟 | 求助/痛点/讨论 | ⭐⭐⭐⭐⭐ |
| **GitHub Issues** | 30分钟 | Feature Requests | ⭐⭐⭐⭐ |
| **Hacker News Ask** | 10分钟 | 开发者问答 | ⭐⭐⭐⭐ |
| **Product Hunt** | 1小时 | 新品/替代品 | ⭐⭐⭐ |

### 待集成(需API密钥)

- **G2 / Trustpilot** - 竞品差评分析
- **App Store Reviews** - 移动应用反馈
- **Stack Overflow** - 技术问题趋势
- **Google Trends** - 搜索趋势预警

## 🚀 快速开始

### 1. 安装依赖
```bash
cd hotspot-web
pnpm install
```

### 2. 启动开发服务器
```bash
pnpm dev
```

### 3. 访问需求雷达
浏览器打开: `http://localhost:3000`

在导航栏找到 **"需求雷达"** 标签,即可看到聚合的需求信号。

## 📊 数据结构

每个需求信号包含:
```json
{
  "id": "string - 唯一标识",
  "title": "string - 标题",
  "url": "string - 原始链接",
  "score": "number - 需求强度评分(0-1000)",
  "engagement": {
    "upvotes": "number - 点赞数",
    "comments": "number - 评论数"
  },
  "keywords": ["string - 提取的关键词"],
  "source": "string - 来源(reddit/github/hn等)"
}
```

## 🧠 评分模型

### Reddit
```text
score = upvotes×1 + comments×3 + keywordBonus(20) + highEngagement(50)
```

### GitHub Issues
```text
score = reactions×5 + comments×2 + labelBonus(10)
```

### Hacker News
```text
score = points×3 + comments×5 + askHNBonus(30)
```

## 🔍 关键词检测

系统自动检测以下需求信号:

**求助型**
- "looking for", "need", "how to", "best way"

**痛点型**
- "struggle", "frustrated", "pain point", "hate"

**功能请求**
- "wish", "feature request", "missing", "would be great"

**替代品**
- "alternative to", "better than", "replace"

**预算信号** (高价值!)
- "willing to pay", "budget", "paid solution"

## 🛠️ 配置

### 添加新数据源

1. 在 `server/sources/` 创建新文件:
```typescript
// server/sources/your-source.ts
import type { NewsItem } from "@shared/types"

export default defineSource(async () => {
  const news: NewsItem[] = []
  
  // 抓取逻辑
  const data = await myFetch("https://api.example.com/...")
  
  // 处理数据
  data.items.forEach(item => {
    news.push({
      id: item.id,
      title: item.title,
      url: item.url,
      extra: {
        score: calculateScore(item),
        info: `💬 ${item.comments}`
      }
    })
  })
  
  return news.sort((a, b) => b.extra.score - a.extra.score)
})
```

2. 在 `shared/sources.json` 添加配置:
```json
{
  "your-source": {
    "name": "Your Source",
    "column": "demand",
    "home": "https://example.com",
    "color": "blue",
    "interval": 600000,
    "title": "描述",
    "desc": "详细说明"
  }
}
```

### 调整更新频率

编辑 `shared/sources.json` 中的 `interval` 字段(单位:毫秒)

```json
{
  "reddit-signals": {
    "interval": 600000  // 10分钟 = 600000ms
  }
}
```

## 📈 使用场景

### 1. 发现创业机会
- 筛选 **高分需求**(score > 500)
- 查看 **重复出现的问题**
- 关注 **带预算的抱怨**

### 2. 产品功能规划
- GitHub Issues 看竞品缺失功能
- Reddit 看用户真实痛点
- Product Hunt 看替代品趋势

### 3. 内容创作灵感
- HN Ask 的高赞问题
- Reddit 的热议话题
- Stack Overflow 的高频问题

## 🔥 高级功能

### 去重与聚合
系统自动:
- 合并相似标题的需求
- 聚合相同关键词的信号
- 识别重复讨论的问题

### 趋势分析
- 本周 vs 上周热度变化
- 关键词上升/下降趋势
- 新兴需求预警

### 导出报告
```bash
npx tsx tools/demand-analyzer.ts > report.json
```

## 🤝 贡献

欢迎添加新数据源或改进评分算法!

1. Fork 本仓库
2. 创建新分支: `git checkout -b feature/new-source`
3. 提交PR

## 📝 注意事项

### API限流
- Reddit: 60请求/分钟(无token)
- GitHub: 60请求/小时(无token),5000/小时(有token)
- Product Hunt: 需要申请API访问

### 数据隐私
- 只抓取公开数据
- 不存储用户个人信息
- 遵守各平台ToS

### 性能优化
- 使用缓存减少API调用
- 调整 `interval` 避免被ban
- 考虑使用代理池(高频场景)

## 📚 参考资料

- [Reddit API文档](https://www.reddit.com/dev/api/)
- [GitHub REST API](https://docs.github.com/en/rest)
- [Hacker News API](https://github.com/HackerNews/API)
- [Product Hunt API](https://api.producthunt.com/v2/docs)

---

**需要帮助?** 提Issue或联系维护者
