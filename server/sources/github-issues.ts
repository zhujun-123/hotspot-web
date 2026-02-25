import type { NewsItem } from "@shared/types"

/**
 * GitHub Issues 需求信号 - 热门开源项目的功能请求
 * 聚焦: feature request, enhancement 标签
 */
export default defineSource(async () => {
  // 高星项目列表(可配置)
  const repos = [
    "vercel/next.js",
    "facebook/react",
    "vuejs/core",
    "microsoft/vscode",
    "supabase/supabase",
    "openai/openai-python"
  ]
  
  const news: NewsItem[] = []
  
  for (const repo of repos) {
    try {
      // 搜索 feature request + enhancement issues
      const query = `repo:${repo}+label:"feature request",enhancement+is:issue+is:open+sort:reactions-+1-desc`
      const data: any = await myFetch(
        `https://api.github.com/search/issues?q=${encodeURIComponent(query)}&per_page=10`,
        {
          headers: {
            "Accept": "application/vnd.github.v3+json",
            "User-Agent": "DemandRadar"
          }
        }
      )
      
      if (!data?.items) continue
      
      data.items.forEach((issue: any) => {
        const reactions = issue.reactions["+1"] || 0
        const comments = issue.comments || 0
        
        // 过滤低互动issues
        if (reactions < 5 && comments < 3) return
        
        news.push({
          id: `gh-${issue.id}`,
          title: `[${repo.split("/")[1]}] ${issue.title}`,
          url: issue.html_url,
          extra: {
            info: `👍 ${reactions} | 💬 ${comments}`,
            icon: "/icons/github.svg",
            score: reactions * 5 + comments * 2,
            tags: issue.labels.map((l: any) => l.name).slice(0, 3)
          }
        })
      })
    } catch (e) {
      console.error(`GitHub ${repo} fetch failed:`, e)
    }
  }
  
  return news.sort((a, b) => (b.extra?.score || 0) - (a.extra?.score || 0))
})
