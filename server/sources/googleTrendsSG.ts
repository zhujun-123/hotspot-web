import type { NewsItem } from "#/types"

// Google Trends 新加坡实时热搜
// 使用 Google Trends 的 RSS feed（如果可用）或 widgets API
export default defineSource(async () => {
  try {
    // 方案1: 尝试使用 widgets API (需要先获取token)
    // 这是 Google Trends 的非官方API端点
    const url = "https://trends.google.com/trends/api/realtimetrends?hl=en&tz=-480&geo=SG&category=all&fi=0&fs=0&ri=10&rs=10&sort=0"

    const response = await $fetch(url, {
      parseResponse: txt => txt,
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    })

    // Google Trends API 返回的数据前面有 ")]}'" 需要去掉
    const jsonStr = response.replace(/^\)\]\}'\n/, "")
    const data = JSON.parse(jsonStr)

    const items: NewsItem[] = []

    // 解析实时趋势数据
    if (data.storySummaries) {
      data.storySummaries.forEach((summary: any, index: number) => {
        const story = summary.trendingStories?.[0]
        if (!story) return

        const title = story.entityNames?.[0] || story.title || "未知话题"
        const articleUrl = story.articles?.[0]?.url
        const url = articleUrl || `https://trends.google.com/trends/explore?geo=SG&q=${encodeURIComponent(title)}`

        // 获取流量信息
        const traffic = story.articles?.[0]?.snippet || ""
        const formattedTraffic = summary.formattedTraffic || ""

        items.push({
          id: `google-trends-sg-${index}`,
          title,
          url,
          extra: {
            info: formattedTraffic ? `🔥 ${formattedTraffic}` : (traffic || ""),
            icon: "i-simple-icons-google",
          },
        })
      })
    }

    return items.slice(0, 20)
  } catch (error) {
    console.error("Google Trends SG fetch error:", error)
    // 返回空数组而不是报错
    return []
  }
})
