import type { NewsItem } from "@shared/types"

export default defineSource(async () => {
  const apiUrl = "https://after-summary-peace-route.trycloudflare.com/api/weibo"

  try {
    const response = await fetch(apiUrl)
    const data = await response.json()

    if (!data.success || !data.data) {
      throw new Error("Failed to fetch data from RSSHub API")
    }

    const hotNews: NewsItem[] = data.data.map((item: any) => ({
      id: item.title,
      title: item.title,
      url: item.url,
      mobileUrl: item.url,
    }))

    return hotNews
  } catch (error) {
    console.error("Error fetching weibo hotlist:", error)
    return []
  }
})
