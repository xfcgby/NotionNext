import { siteConfig } from '@/lib/config'
import { useEffect } from 'react'

/**
 * 禁止用户拷贝文章及保存图片的插件
 */
export default function DisableCopy() {
  useEffect(() => {
    if (JSON.parse(siteConfig('CAN_COPY'))) {
      return
    }

    const html = document.getElementsByTagName('html')[0]

    // 1. 阻止文字复制
    const handleCopy = (event) => {
      event.preventDefault()
      alert('抱歉，本网页内容不可复制！')
    }

    // 2. 阻止右键保存图片
    const handleContextMenu = (event) => {
      if (event.target.tagName === 'IMG' || event.target.closest('img')) {
        event.preventDefault()
        alert('抱歉，图片不可保存！')
      }
    }

    // 3. 阻止拖拽图片
    const handleDragStart = (event) => {
      if (event.target.tagName === 'IMG') {
        event.preventDefault()
      }
    }

    // 4. 给单张图片加防护属性
    const protectImage = (img) => {
      img.setAttribute('draggable', 'false')
      img.style.userSelect = 'none'
      img.style.webkitUserSelect = 'none'
      img.style.webkitUserDrag = 'none'
    }

    // 5. 批量处理页面上已有图片
    const protectAllImages = () => {
      document.querySelectorAll('img').forEach(protectImage)
    }

    // 6. 监听 Notion 异步渲染的动态图片
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.tagName === 'IMG') {
            protectImage(node)
          }
          if (node.querySelectorAll) {
            node.querySelectorAll('img').forEach(protectImage)
          }
        })
      })
    })

    // 初始化挂载
    html.classList.add('forbid-copy')
    document.addEventListener('copy', handleCopy)
    document.addEventListener('contextmenu', handleContextMenu)
    document.addEventListener('dragstart', handleDragStart)
    protectAllImages()
    observer.observe(document.body, { childList: true, subtree: true })

    // 组件卸载时清理
    return () => {
      html.classList.remove('forbid-copy')
      document.removeEventListener('copy', handleCopy)
      document.removeEventListener('contextmenu', handleContextMenu)
      document.removeEventListener('dragstart', handleDragStart)
      observer.disconnect()
    }
  }, [])

  return null
}
