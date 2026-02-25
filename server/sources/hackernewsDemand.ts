import type { NewsItem } from "@shared/types"

export default defineSource(async () => {
  // Hacker News API - 开发者真实痛点和需求
  // 使用官方 Firebase API
  const baseURL = "https://hacker-news.firebaseio.com/v0"

  try {
    // 获取 Ask HN 的最新问题 ID
    const askStories: any = await myFetch(`${baseURL}/askstories.json`)
    const topStories = askStories.slice(0, 50) // 取前50个

    const news: NewsItem[] = []

    // 需求关键词（技术栈、工具、解决方案）
    const demandKeywords = [
      "looking for",
      "need",
      "recommend",
      "alternative",
      "help",
      "how to",
      "best",
      "tool",
      "library",
      "framework",
    ]

    for (const storyId of topStories) {
      try {
        const story: any = await myFetch(`${baseURL}/item/${storyId}.json`)

        if (!story || !story.title) continue

        const title = story.title.replace(/^Ask HN:\s*/i, "")

        // 过滤：只保留包含需求关键词的问题
        const hasKeyword = demandKeywords.some(kw =>
          title.toLowerCase().includes(kw),
        )

        if (hasKeyword) {
          news.push({
            id: `hn-${storyId}`,
            title,
            url: `https://news.ycombinator.com/item?id=${storyId}`,
            extra: {
              info: `${story.score || 0} points · ${story.descendants || 0} 评论`,
            },
          })
        }

        // 限制结果数量，避免过多请求
        if (news.length >= 20) break
      } catch {
        // 单个请求失败不影响其他
        continue
      }
    }

    // 按分数排序
    return news.sort((a, b) => {
      const infoA = typeof a.extra?.info === "string" ? a.extra.info : "0"
      const infoB = typeof b.extra?.info === "string" ? b.extra.info : "0"
      const scoreA = Number.parseInt(infoA.split(" ")[0] || "0")
      const scoreB = Number.parseInt(infoB.split(" ")[0] || "0")
      return scoreB - scoreA
    })
  } catch (err) {
    console.error("Failed to fetch HN Ask:", err)
    return []
  }
})
