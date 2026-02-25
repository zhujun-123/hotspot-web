import type { NewsItem } from "@shared/types"

/**
 * Product Hunt 新产品趋势
 * 注意: PH官方API需要token,这里用公开页面抓取(备用方案)
 */
export default defineSource(async () => {
  const news: NewsItem[] = []
  
  try {
    // 使用第三方API或爬虫抓取(示例用模拟数据)
    // 实际部署时替换为真实API endpoint
    const data: any = await myFetch(
      "https://www.producthunt.com/frontend/graphql",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "Mozilla/5.0"
        },
        body: JSON.stringify({
          query: `
            query {
              posts(first: 20, order: VOTES) {
                edges {
                  node {
                    id
                    name
                    tagline
                    votesCount
                    commentsCount
                    url
                  }
                }
              }
            }
          `
        })
      }
    ).catch(() => null)
    
    if (!data?.data?.posts?.edges) {
      // Fallback: 解析HTML
      return await scrapePHPage()
    }
    
    data.data.posts.edges.forEach((edge: any) => {
      const p = edge.node
      news.push({
        id: `ph-${p.id}`,
        title: p.name,
        url: p.url || `https://www.producthunt.com/posts/${p.slug}`,
        extra: {
          info: `▲ ${p.votesCount} | 💬 ${p.commentsCount}`,
          icon: "/icons/producthunt.svg",
          score: p.votesCount * 2 + p.commentsCount,
          desc: p.tagline
        }
      })
    })
  } catch (e) {
    console.error("Product Hunt fetch failed:", e)
  }
  
  return news.sort((a, b) => (b.extra?.score || 0) - (a.extra?.score || 0))
})

/**
 * 备用: HTML抓取方案
 */
async function scrapePHPage() {
  const _html: any = await myFetch("https://www.producthunt.com")
  // 需要cheerio解析,这里简化返回空数组
  // 实际可参考hackernews.ts的写法
  return []
}
