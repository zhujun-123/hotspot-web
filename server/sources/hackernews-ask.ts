import type { NewsItem } from "@shared/types"

/**
 * Hacker News Ask HN - 开发者真实需求
 * 聚焦: "Ask HN" 类型帖子
 */
export default defineSource(async () => {
  const news: NewsItem[] = []
  
  try {
    // HN官方API - Ask stories
    const askStories: any = await myFetch(
      "https://hacker-news.firebaseio.com/v0/askstories.json?print=pretty"
    )
    
    if (!Array.isArray(askStories)) return []
    
    // 获取前20条详情
    const topStories = askStories.slice(0, 20)
    
    for (const id of topStories) {
      try {
        const story: any = await myFetch(
          `https://hacker-news.firebaseio.com/v0/item/${id}.json`
        )
        
        if (!story || story.dead || story.deleted) continue
        
        // 需求关键词过滤
        const hasNeedSignal = /\b(?:looking for|need|alternative|recommend|best tool|suggestions?|what do you use)\b/i
          .test(story.title + (story.text || ""))
        
        const score = story.score || 0
        const descendants = story.descendants || 0  // 评论数
        
        if (score < 10 && !hasNeedSignal) continue  // 过滤低热度
        
        news.push({
          id: `hn-${id}`,
          title: story.title,
          url: `https://news.ycombinator.com/item?id=${id}`,
          extra: {
            info: `⬆️ ${score} | 💬 ${descendants}`,
            icon: "/icons/hackernews.svg",
            score: score * 3 + descendants * 5 + (hasNeedSignal ? 50 : 0),
            isNeed: hasNeedSignal
          }
        })
      } catch {
        continue
      }
    }
  } catch (e) {
    console.error("HN Ask fetch failed:", e)
  }
  
  return news.sort((a, b) => (b.extra?.score || 0) - (a.extra?.score || 0))
})
