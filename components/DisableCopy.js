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


    // 2. 阻止右键保存图片（桌面端）
    const handleContextMenu = (event) => {
      const target = event.target
      if (target.tagName === 'IMG' || target.closest('img')) {
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

    // 4. iOS 专用：阻止长按保存图片
    const handleTouchStart = (event) => {
      const target = event.target
      if (target.tagName === 'IMG' || target.closest('img')) {
        event.preventDefault()
      }
    }

    // 5. 给单张图片加防护属性
    const protectImage = (img) => {
      img.setAttribute('draggable', 'false')
      img.style.userSelect = 'none'
      img.style.webkitUserSelect = 'none'
      img.style.webkitUserDrag = 'none'
      img.style.webkitTouchCallout = 'none'  // iOS 禁用长按菜单
      img.style.pointerEvents = 'none'         // 阻止触摸交互
    }

    // 6. 批量处理页面上已有图片
    const protectAllImages = () => {
      document.querySelectorAll('img').forEach(protectImage)
    }

    // 7. 监听 Notion 异步渲染的动态图片
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

    // 8. 注入 iOS 全局样式（作为兜底）
    const iosStyle = document.createElement('style')
    iosStyle.textContent = `
      .forbid-copy img,
      .forbid-copy * img {
        -webkit-touch-callout: none !important;
        -webkit-user-select: none !important;
        pointer-events: none !important;
      }
    `
    document.head.appendChild(iosStyle)

    // 初始化挂载
    html.classList.add('forbid-copy')
    document.addEventListener('copy', handleCopy)
    document.addEventListener('contextmenu', handleContextMenu)
    document.addEventListener('dragstart', handleDragStart)
    document.addEventListener('touchstart', handleTouchStart, { passive: false })
    protectAllImages()
    observer.observe(document.body, { childList: true, subtree: true })

    // 组件卸载时清理
    return () => {
      html.classList.remove('forbid-copy')
      document.removeEventListener('copy', handleCopy)
      document.removeEventListener('contextmenu', handleContextMenu)
      document.removeEventListener('dragstart', handleDragStart)
      document.removeEventListener('touchstart', handleTouchStart)
      observer.disconnect()
      if (iosStyle.parentNode) iosStyle.parentNode.removeChild(iosStyle)

    }
  }, [])

  return null
}
