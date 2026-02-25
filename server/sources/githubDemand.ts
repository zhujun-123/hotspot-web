import type { NewsItem } from "@shared/types"

export default defineSource(async () => {
  // GitHub Issues - 热门开源项目的 feature requests
  const repos = [
    "vercel/next.js",
    "facebook/react",
    "microsoft/vscode",
    "nodejs/node",
    "vitejs/vite",
  ]

  const allIssues: NewsItem[] = []

  for (const repo of repos) {
    try {
      // 获取最热门的open issues(按reactions排序)
      const url = `https://api.github.com/repos/${repo}/issues?state=open&sort=reactions&direction=desc&per_page=3`
      const data: any = await myFetch(url, {
        headers: {
          "Accept": "application/vnd.github.v3+json",
          "User-Agent": "Mozilla/5.0 (compatible; NewsNow-Bot/1.0)",
        },
      })

      if (Array.isArray(data)) {
        data.forEach((issue: any) => {
          // 过滤PR,只要issues
          if (issue.pull_request) return

          // 过滤低互动的issue
          const totalReactions = issue.reactions["+1"] || 0
          if (totalReactions < 5) return

          allIssues.push({
            id: `github-${issue.id}`,
            title: `[${repo.split("/")[1]}] ${issue.title}`,
            url: issue.html_url,
            extra: {
              info: `👍 ${issue.reactions["+1"]} · 💬 ${issue.comments}`,
            },
          })
        })
      }
    } catch (err) {
      console.error(`Failed to fetch ${repo}:`, err)
    }
  }

  return allIssues.slice(0, 20)
})
