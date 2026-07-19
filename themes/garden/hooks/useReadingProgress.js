import { useState, useEffect } from 'react'

/**
 * 📊 阅读进度追踪 Hook
 * 监听文章滚动，返回 0-100 的阅读进度百分比
 */
export function useReadingProgress(isClient) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (!isClient) return
    const handleScroll = () => {
      const article = document.getElementById('article-wrapper')
      if (!article) return
      const rect = article.getBoundingClientRect()
      const windowHeight = window.innerHeight
      const articleHeight = article.scrollHeight
      const scrolled = Math.max(0, -rect.top)
      const progress = Math.min(100, Math.max(0, (scrolled / (articleHeight - windowHeight)) * 100))
      setProgress(progress)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isClient])

  return progress
}