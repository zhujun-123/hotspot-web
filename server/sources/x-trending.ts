import type { NewsItem } from "#/types"

// X (Twitter) 热门趋势
// 使用 RSSHub 或其他公开API获取Twitter趋势

export default defineSource(async () => {
  // 方案1: 使用 RSSHub
  const rssUrl = "https://rsshub.app/twitter/trends"

  try {
    const response = await $fetch(rssUrl, {
      parseResponse: txt => txt,
    })

    // 解析RSS
    const items = parseRSS(response)

    return items.map((item): NewsItem => ({
      id: item.guid || item.link,
      title: item.title,
      url: item.link,
      pubDate: item.pubDate ? new Date(item.pubDate) : new Date(),
      extra: {
        icon: "i-simple-icons-x",
      },
    }))
  } catch (error) {
    console.error("X trending fetch error:", error)
    return []
  }
})

// 简单的RSS解析函数
function parseRSS(xml: string) {
  const items: any[] = []

  // 提取所有 <item> 标签
  const itemRegex = /<item>([\s\S]*?)<\/item>/g
  let match = itemRegex.exec(xml)

  while (match !== null) {
    const itemXml = match[1]

    // 提取标题、链接、日期等
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
