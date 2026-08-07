import { useEffect } from 'react'
import { siteConfig } from '@/lib/config'

/**
 * 禁止用户拷贝文章及保存图片的插件
 * 
 * 防护能力：
 * - 阻止文字复制（Ctrl+C / 右键复制）
 * - 阻止右键/长按保存图片（桌面端 + iOS + 安卓）
 * - 阻止拖拽图片到新标签页/桌面保存
 * 
 * 保留的交互：
 * - 鼠标 hover 效果
 * - 点击图片（Lightbox、链接跳转等）
 * - 触摸滑动、点击（移动端正常浏览）
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

    // 2. 阻止右键保存图片（桌面端 + 安卓部分浏览器）
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

    // 4. 阻止图片被选中（安卓 Firefox 等浏览器）
    const handleSelectStart = (event) => {
      if (event.target.tagName === 'IMG' || event.target.closest('img')) {
        event.preventDefault()
      }
    }

    // 5. 给图片加防护属性
    const protectImage = (img) => {
      img.setAttribute('draggable', 'false')
      img.setAttribute('oncontextmenu', 'return false')  // 属性级拦截，安卓兼容更好
      img.style.userSelect = 'none'
      img.style.webkitUserSelect = 'none'
      img.style.mozUserSelect = 'none'                   // Firefox
      img.style.msUserSelect = 'none'                    // 旧版 Edge
      img.style.webkitUserDrag = 'none'
      img.style.webkitTouchCallout = 'none'              // iOS + 安卓 WebKit 浏览器
    }

    // 6. 批量处理页面上已有图片
    const protectAllImages = () => {
      document.querySelectorAll('img').forEach(protectImage)
    }

    // 7. 监听动态渲染的图片（如 Notion 异步加载）
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

    // 8. 注入全局样式（覆盖 iOS + 安卓）
    const protectStyle = document.createElement('style')
    protectStyle.textContent = `
      .forbid-copy img,
      .forbid-copy * img {
        -webkit-touch-callout: none !important;
        -webkit-user-select: none !important;
        -moz-user-select: none !important;
        -ms-user-select: none !important;
        user-select: none !important;
        -webkit-user-drag: none !important;
      }
    `
    document.head.appendChild(protectStyle)

    // 初始化挂载
    html.classList.add('forbid-copy')
    document.addEventListener('copy', handleCopy)
    document.addEventListener('contextmenu', handleContextMenu)
    document.addEventListener('dragstart', handleDragStart)
    document.addEventListener('selectstart', handleSelectStart)
    protectAllImages()
    observer.observe(document.body, { childList: true, subtree: true })

    // 组件卸载时清理
    return () => {
      html.classList.remove('forbid-copy')
      document.removeEventListener('copy', handleCopy)
      document.removeEventListener('contextmenu', handleContextMenu)
      document.removeEventListener('dragstart', handleDragStart)
      document.removeEventListener('selectstart', handleSelectStart)
      observer.disconnect()
      if (protectStyle.parentNode) protectStyle.parentNode.removeChild(protectStyle)
    }
  }, [])

  return null
}
