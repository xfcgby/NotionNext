import { useCallback, useEffect, useState } from 'react'
import ButtonDarkModeFloat from './ButtonFloatDarkMode'
import ButtonJumpToTop from './ButtonJumpToTop'

/**
 * 悬浮在右下角的按钮，当页面向下滚动100px时会出现
 */
export default function RightFloatArea({ floatSlot }) {
  const [showFloatButton, switchShow] = useState(false)
  
  // 🌙 夜间模式状态（内部管理）
  const [isDark, setIsDark] = useState(false)

  // 🌙 初始化：读取本地存储或系统偏好
  useEffect(() => {
    const stored = localStorage.getItem('theme-garden-dark-mode')
    if (stored !== null) {
      setIsDark(stored === 'true')
    } else {
      setIsDark(window.matchMedia('(prefers-color-scheme: dark)').matches)
    }
  }, [])

  // 🌙 切换时同步到 html 标签和 localStorage
  useEffect(() => {
    const root = document.documentElement
    if (isDark) {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    localStorage.setItem('theme-garden-dark-mode', isDark.toString())
  }, [isDark])

  const toggleDark = () => setIsDark(prev => !prev)

  const scrollListener = useCallback(() => {
    const targetRef =
      document.getElementById('wrapper') || document.documentElement
    const clientHeight = targetRef?.clientHeight || 0
    const scrollY =
      window.pageYOffset || document.documentElement.scrollTop || 0
    const viewportHeight =
      window.innerHeight || document.documentElement.clientHeight || 0

    const fullHeight = Math.max(1, clientHeight - viewportHeight)
    let per = parseFloat(((scrollY / fullHeight) * 100).toFixed(0))

    if (isNaN(per) || per < 0) per = 0
    if (per > 100) per = 100

    const shouldShow = scrollY > 100 && per > 0

    if (shouldShow !== showFloatButton) {
      switchShow(shouldShow)
    }
  }, [showFloatButton])

  useEffect(() => {
    const throttledScroll = () => {
      window.requestAnimationFrame(() => {
        scrollListener()
      })
    }

    window.addEventListener('scroll', throttledScroll, { passive: true })
    scrollListener()

    return () => window.removeEventListener('scroll', throttledScroll)
  }, [scrollListener])

  return (
    <div
      className={
        (showFloatButton ? 'opacity-100 ' : 'invisible opacity-0') +
        ' duration-300 transition-all bottom-12 right-1 fixed justify-end z-20 text-white bg-indigo-500 dark:bg-hexo-black-gray rounded-sm'
      }>
      <div className={'justify-center flex flex-col items-center cursor-pointer'}>
        {/* 🌙 传入状态和控制函数 */}
        <ButtonDarkModeFloat isDark={isDark} onToggle={toggleDark} />
        {floatSlot}
        <ButtonJumpToTop />
      </div>
    </div>
  )
}