import { useState, useEffect } from 'react'
import { uuidToId } from 'notion-utils'

/**
 * 📑 目录高亮与显隐控制 Hook
 * 追踪当前阅读位置高亮对应目录项，并控制目录在文章视口外时隐藏
 */
export function useTocTracker(isClient, post) {
  const [activeTocId, setActiveTocId] = useState('')
  const [tocVisible, setTocVisible] = useState(true)

  useEffect(() => {
    if (!isClient || !post?.toc || post.toc.length === 0) return

    const handleScroll = () => {
      // 目录高亮
      const headings = document.querySelectorAll('#article-wrapper h1, #article-wrapper h2, #article-wrapper h3, #article-wrapper .notion-h')
      let current = ''
      headings.forEach(heading => {
        const rect = heading.getBoundingClientRect()
        if (rect.top <= 150) {
          const dataId = heading.getAttribute('data-id') || ''
          current = dataId.length === 32 ? dataId : uuidToId(dataId)
        }
      })
      setActiveTocId(current)

      // 目录跟随文章滚动显隐
      const articleWrapper = document.getElementById('article-wrapper')
      if (!articleWrapper) return
      const articleRect = articleWrapper.getBoundingClientRect()
      const articleTop = articleRect.top
      const articleBottom = articleRect.bottom
      const windowHeight = window.innerHeight

      if (articleBottom < 100 || articleTop > windowHeight - 100) {
        setTocVisible(false)
      } else {
        setTocVisible(true)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // 初始化
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isClient, post])

  return { activeTocId, tocVisible }
}