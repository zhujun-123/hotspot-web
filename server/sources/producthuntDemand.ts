import process from "node:process"

export default defineSource(async () => {
  // Product Hunt - 新产品趋势
  // 需要 API Token
  const apiToken = process.env.PRODUCTHUNT_API_TOKEN

  if (!apiToken) {
    throw new Error("PRODUCTHUNT_API_TOKEN is not set")
  }

  try {
    const query = `
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

    const data: any = await myFetch("https://api.producthunt.com/v2/api/graphql", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
    })

    const posts = data?.data?.posts?.edges || []

    return posts.map((edge: any) => {
      const node = edge.node
      return {
        id: `ph-${node.id}`,
        title: `${node.name} - ${node.tagline}`,
        url: node.url,
        extra: {
          info: `👍 ${node.votesCount} · 💬 ${node.commentsCount}`,
        },
      }
    })
  } catch (err) {
    console.error("Failed to fetch Product Hunt:", err)
    return []
  }
})
