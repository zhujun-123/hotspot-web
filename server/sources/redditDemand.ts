import type { NewsItem } from "@shared/types"

export default defineSource(async () => {
  // Reddit Data API - 抓取高质量需求信号
  // 重点社区：r/SaaS, r/Entrepreneur, r/startups
  // 使用 /hot 端点代替 search(更稳定)
  const subreddits = ["SaaS", "Entrepreneur", "startups"]

  const allPosts: NewsItem[] = []

  for (const sub of subreddits) {
    try {
      // 使用 Reddit JSON API - /hot 端点
      const url = `https://www.reddit.com/r/${sub}/hot.json?limit=15`

      const data: any = await myFetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; NewsNow-Bot/1.0)",
        },
        timeout: 15000,
      })

      const posts = data?.data?.children || []

      posts.forEach((post: any) => {
        const { id, title, score, num_comments, permalink, selftext } = post.data

        // 需求关键词过滤
        const demandKeywords = ["need", "looking for", "recommend", "alternative", "help", "how to", "best tool"]
        const text = (`${title} ${selftext || ""}`).toLowerCase()
        const hasDemand = demandKeywords.some(kw => text.includes(kw))

        if (!hasDemand) return // 跳过非需求帖子

        // 计算需求信号强度
        const signalKeywords = ["pay", "budget", "willing to", "desperately", "urgent", "frustrated"]
        const hasStrongSignal = signalKeywords.some(kw => text.includes(kw))

        allPosts.push({
          id: `reddit-${id}`,
          title: `[r/${sub}] ${title}`,
          url: `https://reddit.com${permalink}`,
          extra: {
            info: `${score} ↑ · ${num_comments} 评论${hasStrongSignal ? " · 🔥" : ""}`,
          },
        })
      })
    } catch (err) {
      console.error(`Failed to fetch r/${sub}:`, err)
    }
  }

  // 按分数排序，优先显示高分帖子
  return allPosts.sort((a, b) => {
    const infoA = typeof a.extra?.info === "string" ? a.extra.info : "0"
    const infoB = typeof b.extra?.info === "string" ? b.extra.info : "0"
    const scoreA = Number.parseInt(infoA.split(" ")[0] || "0")
    const scoreB = Number.parseInt(infoB.split(" ")[0] || "0")
    return scoreB - scoreA
  }).slice(0, 20)
})
