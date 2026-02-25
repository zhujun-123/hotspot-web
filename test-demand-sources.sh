#!/bin/bash
# 测试需求雷达数据源

echo "🔍 测试需求雷达数据源..."
echo ""

# 1. Reddit Signals
echo "📱 测试 Reddit..."
curl -s "https://www.reddit.com/r/SaaS/hot.json?limit=5" \
  -H "User-Agent: Mozilla/5.0" | \
  jq -r '.data.children[].data | "✓ [\(.score)⬆️ \(.num_comments)💬] \(.title[0:60])"' | head -3
echo ""

# 2. GitHub Issues  
echo "🐙 测试 GitHub Issues..."
curl -s "https://api.github.com/search/issues?q=repo:vercel/next.js+label:feature+is:open&per_page=3" \
  -H "Accept: application/vnd.github.v3+json" | \
  jq -r '.items[] | "✓ [\(.reactions."+1")👍 \(.comments)💬] \(.title[0:60])"'
echo ""

# 3. Hacker News
echo "🍊 测试 Hacker News..."
curl -s "https://hacker-news.firebaseio.com/v0/askstories.json" | \
  jq -r '.[0:3][]' | while read id; do
    curl -s "https://hacker-news.firebaseio.com/v0/item/$id.json" | \
      jq -r '"✓ [\(.score)⬆️ \(.descendants // 0)💬] \(.title[0:60])"'
  done
echo ""

# 4. Product Hunt (示例)
echo "🚀 Product Hunt (需配置API)..."
echo "  请访问: https://www.producthunt.com/posts"
echo ""

echo "✅ 所有数据源测试完成!"
echo ""
echo "运行 'pnpm dev' 启动项目,然后访问 /demand 查看需求雷达"
