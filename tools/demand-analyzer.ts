/**
 * 需求分析器 - 聚合多源需求信号并打分排序
 * 
 * 使用: npx tsx tools/demand-analyzer.ts
 */

interface DemandSignal {
  source: string
  title: string
  url: string
  score: number
  engagement: {
    upvotes?: number
    comments?: number
    reactions?: number
  }
  keywords: string[]
  timestamp: number
}

class DemandAnalyzer {
  private signals: DemandSignal[] = []
  private dedupeMap = new Map<string, DemandSignal>()

  /**
   * 添加需求信号
   */
  addSignal(signal: DemandSignal) {
    // 去重: 基于标题相似度
    const titleHash = this.fuzzyHash(signal.title)
    
    if (this.dedupeMap.has(titleHash)) {
      const existing = this.dedupeMap.get(titleHash)!
      // 合并分数,保留更高分的
      if (signal.score > existing.score) {
        this.dedupeMap.set(titleHash, signal)
      }
    } else {
      this.dedupeMap.set(titleHash, signal)
    }
  }

  /**
   * 获取Top需求(按分数排序)
   */
  getTopDemands(limit = 20): DemandSignal[] {
    this.signals = Array.from(this.dedupeMap.values())
    return this.signals
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
  }

  /**
   * 关键词聚类分析
   */
  clusterByKeywords(): Record<string, DemandSignal[]> {
    const clusters: Record<string, DemandSignal[]> = {}
    
    this.signals.forEach(signal => {
      signal.keywords.forEach(kw => {
        if (!clusters[kw]) clusters[kw] = []
        clusters[kw].push(signal)
      })
    })
    
    // 按cluster size排序
    return Object.fromEntries(
      Object.entries(clusters)
        .sort(([, a], [, b]) => b.length - a.length)
    )
  }

  /**
   * 趋势分析: 本周 vs 上周
   */
  analyzeTrends(windowDays = 7): {
    rising: string[]
    declining: string[]
  } {
    const now = Date.now()
    const weekAgo = now - windowDays * 86400000
    
    const recent = this.signals.filter(s => s.timestamp > weekAgo)
    const keywords = recent.flatMap(s => s.keywords)
    
    // 简化版: 返回高频关键词
    const freq = new Map<string, number>()
    keywords.forEach(kw => {
      freq.set(kw, (freq.get(kw) || 0) + 1)
    })
    
    const sorted = Array.from(freq.entries())
      .sort(([, a], [, b]) => b - a)
    
    return {
      rising: sorted.slice(0, 10).map(([kw]) => kw),
      declining: [] // TODO: 需要历史数据对比
    }
  }

  /**
   * 模糊哈希(用于去重)
   */
  private fuzzyHash(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, "")
      .split(/\s+/)
      .sort()
      .slice(0, 5)  // 取前5个词作为指纹
      .join("-")
  }

  /**
   * 导出JSON报告
   */
  exportReport() {
    const top = this.getTopDemands(30)
    const clusters = this.clusterByKeywords()
    const trends = this.analyzeTrends()
    
    return {
      generatedAt: new Date().toISOString(),
      summary: {
        totalSignals: this.signals.length,
        uniqueSignals: this.dedupeMap.size,
        topKeywords: Object.keys(clusters).slice(0, 20)
      },
      topDemands: top,
      clusters: Object.fromEntries(
        Object.entries(clusters).slice(0, 10)
      ),
      trends
    }
  }
}

/**
 * 打分模型配置
 */
export const scoringWeights = {
  reddit: {
    upvote: 1,
    comment: 3,
    keywordBonus: 20,
    highEngagement: 50  // upvotes>50 或 comments>20
  },
  github: {
    reaction: 5,
    comment: 2,
    labelBonus: 10  // "feature request" 标签
  },
  hackernews: {
    point: 3,
    comment: 5,
    askHNBonus: 30
  }
}

/**
 * 需求关键词词典
 */
export const demandKeywords = [
  // 求助信号
  "help", "looking for", "need", "how to", "best way",
  // 痛点信号
  "struggle", "frustrated", "pain point", "annoying", "hate",
  // 功能请求
  "wish", "would be great", "feature request", "missing",
  // 替代品信号
  "alternative to", "better than", "replace", "instead of",
  // 预算信号
  "willing to pay", "budget", "paid solution", "premium"
]

/**
 * 示例: 运行分析器
 */
async function main() {
  const _analyzer = new DemandAnalyzer()
  
  // TODO: 从API拉取数据
  console.log("🔍 需求分析器已就绪")
  console.log("📊 配置的数据源: Reddit, GitHub Issues, HN Ask, Product Hunt")
  console.log("\n运行 `pnpm dev` 后访问 /demand 查看需求雷达\n")
}

if (require.main === module) {
  main()
}

export default DemandAnalyzer
