import type { SourceID, SourceResponse } from "@shared/types"
import { getCacheTable } from "#/database/cache"
import { getters } from "#/getters"

export default defineEventHandler(async (event) => {
  try {
    const { sources: _ }: { sources: SourceID[] } = await readBody(event)
    const ids = _?.filter(k => sources[k])

    if (!ids?.length) {
      return []
    }

    // 尝试从缓存获取
    const cacheTable = await getCacheTable()
    if (cacheTable) {
      const caches = await cacheTable.getEntire(ids)
      const now = Date.now()
      return caches.map(cache => ({
        status: "cache",
        id: cache.id,
        items: cache.items,
        updatedTime: now - cache.updated < sources[cache.id].interval ? now : cache.updated,
      })) as SourceResponse[]
    }

    // 没有缓存时，直接获取数据（无缓存模式）
    const now = Date.now()
    const results: SourceResponse[] = []

    for (const id of ids) {
      try {
        if (getters[id]) {
          const items = (await getters[id]()).slice(0, 30)
          results.push({
            status: "success",
            id,
            items,
            updatedTime: now,
          })
          logger.success(`fetch ${id} (no cache)`)
        }
      } catch (e) {
        logger.error(`failed to fetch ${id}:`, e)
        // 跳过失败的源
      }
    }

    return results
  } catch (e) {
    logger.error("entire API error:", e)
    return []
  }
})
