import type { NewsItem } from "@shared/types"

/**
 * Reddit 需求信号 - 抓取高质量求助和讨论
 * 聚焦: r/SaaS, r/Entrepreneur, r/startups, r/webdev 等
 */
export default defineSource(async () => {
  const subreddits = ["SaaS", "Entrepreneur", "startups", "webdev", "AppIdeas"]
  const news: NewsItem[] = []
  
  for (const sub of subreddits) {
    try {
      const data: any = await myFetch(
        `https://www.reddit.com/r/${sub}/hot.json?limit=25`,
        {
          headers: {
            "User-Agent": "Mozilla/5.0 (compatible; DemandRadar/1.0)"
          }
        }
      )
      
      if (!data?.data?.children) continue
      
      data.data.children.forEach((post: any) => {
        const p = post.data
        // 过滤: 求助/问题/需求相关帖子
        const keywords = /\b(?:help|looking for|need|alternative|replace|struggle|frustrated|pain point|wish|feature request)\b/i
        const isSignal = keywords.test(p.title) || keywords.test(p.selftext || "")
        
        if (!isSignal || p.score < 5) return // 过滤低热度
        
        news.push({
          id: p.id,
          title: `[r/${sub}] ${p.title}`,
          url: `https://reddit.com${p.permalink}`,
          extra: {
            info: `💬 ${p.num_comments} | ⬆️ ${p.score}`,
            icon: "/icons/reddit.svg",
            score: calculateDemandScore({
              upvotes: p.score,
              comments: p.num_comments,
              hasKeywords: isSignal
            })
          }
        })
      })
    } catch (e) {
      console.error(`Reddit r/${sub} fetch failed:`, e)
    }
  }
  
  return news.sort((a, b) => (b.extra?.score || 0) - (a.extra?.score || 0))
})

/**
 * 需求信号强度评分
 */
function calculateDemandScore({ upvotes, comments, hasKeywords }: any) {
  let score = 0
  score += upvotes * 1  // 点赞基础分
  score += comments * 3  // 评论高权重(真实讨论)
  if (hasKeywords) score += 20  // 关键词加成
  if (upvotes > 50) score += 30  // 高赞奖励
  if (comments > 20) score += 40  // 热议奖励
  return Math.min(score, 1000)  // 封顶1000
}
