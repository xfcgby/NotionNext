// pages/api/site-stats.js
// 🌱 提供全站统计数据接口

export default async function handler(req, res) {
  try {
    const { fetchGlobalAllData } = await import('@/lib/db/SiteDataApi')
    
    if (!fetchGlobalAllData || typeof fetchGlobalAllData !== 'function') {
      throw new Error('fetchGlobalAllData is not available')
    }
    
    const props = await fetchGlobalAllData({ from: 'api-site-stats' })
    
    // 🌱【严格过滤】只统计已发布的 Post 类型文章（兼容大小写）
    const allPosts = (props.allPages || []).filter(page => {
      const type = String(page?.type || '').toLowerCase()
      const status = String(page?.status || '').toLowerCase()
      return type === 'post' && status === 'published'
    })
    
    // 计算当年文章数
    const currentYear = new Date().getFullYear()
    const currentYearCount = allPosts.filter(post => {
      const rawDate = post?.publishDate || post?.date?.start_date
      let postYear = ''
      if (typeof rawDate === 'string') postYear = rawDate.split('-')[0]?.trim()
      else if (typeof rawDate === 'number') postYear = new Date(rawDate).getFullYear().toString()
      return postYear === currentYear.toString()
    }).length
    
    // 从已发布的 Post 文章中计算标签统计
    const tagMap = {}
    allPosts.forEach(post => {
      const postTags = post?.tags || []
      if (Array.isArray(postTags)) {
        postTags.forEach(tag => {
          const tagName = typeof tag === 'string' ? tag : tag?.name || tag?.tag || ''
          if (tagName) tagMap[tagName] = (tagMap[tagName] || 0) + 1
        })
      }
    })
    const tags = Object.keys(tagMap).map(name => ({ name, count: tagMap[name] }))
    
    res.status(200).json({
      totalPostCount: allPosts.length,
      currentYearCount,
      tags,
      tagOptions: props.tagOptions || [],
      categoryOptions: props.categoryOptions || []
    })
  } catch (error) {
    console.error('[site-stats API] 错误:', error)
    res.status(500).json({ error: '获取全站数据失败: ' + error.message })
  }
}