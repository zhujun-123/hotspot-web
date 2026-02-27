import type { NewsItem } from "#/types"

// YouTube 热门视频
// 使用 RSSHub 获取YouTube趋势

export default defineSource(async () => {
  // 使用 RSSHub 的 YouTube trending
  const rssUrl = "https://rsshub.app/youtube/trending"

  try {
    const response = await $fetch(rssUrl, {
      parseResponse: txt => txt,
    })

    const items = parseRSS(response)

    return items.slice(0, 20).map((item): NewsItem => ({
      id: item.guid || item.link,
      title: item.title,
      url: item.link,
      pubDate: item.pubDate ? new Date(item.pubDate) : new Date(),
      extra: {
        icon: "i-simple-icons-youtube",
      },
    }))
  } catch (error) {
    console.error("YouTube trending fetch error:", error)
    return []
  }
})

function parseRSS(xml: string) {
  const items: any[] = []
  const itemRegex = /<item>([\s\S]*?)<\/item>/g
  let match = itemRegex.exec(xml)

  while (match !== null) {
    const itemXml = match[1]
    const title = extractTag(itemXml, "title")
    const link = extractTag(itemXml, "link")
    const guid = extractTag(itemXml, "guid")
    const pubDate = extractTag(itemXml, "pubDate")

    if (title && link) {
      items.push({ title, link, guid, pubDate })
    }

    match = itemRegex.exec(xml)
  }

  return items
}

function extractTag(xml: string, tag: string): string {
  const regex = new RegExp(`<${tag}>(.*?)<\/${tag}>`, "s")
  const match = xml.match(regex)
  return match ? match[1].trim().replace(/<!\[CDATA\[(.*?)\]\]>/g, "$1") : ""
}
