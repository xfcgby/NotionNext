import React, { useEffect, useState } from 'react'
import { siteConfig } from '@/lib/config'

/**
 * 🏡 数字花园专属 · 手绘空气感头像横幅组件
 */
export default function Hero(props) {
  const [typed, changeType] = useState(null)
  
  // 从配置中动态读取站点的标语和配置
  const greetings = siteConfig('GARDEN_HOME_BANNER_GREETINGS', ['欢迎来到我的数字生命花园 🌿'], props)
  const siteIcon = siteConfig('AVATAR', '/avatar.png', props)
  const siteTitle = siteConfig('TITLE', '林深见鹿', props)
  const siteDescription = siteConfig('DESCRIPTION', '一个正在自然生长的数字生态空间', props)

  useEffect(() => {
    // 🛡️ 增加节点存在性检查，防止 Next.js 客户端初始化打字机时发生 null 崩溃
    if (typeof window !== 'undefined' && window.Typed && document.getElementById('typed')) {
      if (typed) {
        typed.destroy() // 销毁老实例，防止热重载时打字机叠加重影
      }
      changeType(
        new window.Typed('#typed', {
          strings: greetings,
          typeSpeed: 100,
          backSpeed: 50,
          backDelay: 2000,
          loop: true,
          showCursor: true
        })
      )
    }
    return () => {
      if (typed) typed.destroy()
    }
  }, [])

  return (
    <div className="w-full flex flex-col items-center text-center font-sans select-none py-4">
      
      {/* 🌸 带有微风悬浮动画的生态头像容器 */}
      <div className="relative group mb-6 animate-float">
        {/* 头像背后的生态荧光光晕 */}
        <div className="absolute inset-0 bg-lime-400/20 dark:bg-lime-500/10 rounded-full blur-xl group-hover:scale-110 transition-transform duration-500" />
        
        {/* 头像本体，带有手绘感柔和边框 */}
        <img
          src={siteIcon}
          alt={siteTitle}
          className="w-28 h-28 rounded-full object-cover border-4 border-white dark:border-zinc-800 shadow-[0_8px_24px_rgba(132,204,22,0.12)] relative z-10 transition-transform duration-500 group-hover:rotate-6"
        />
        
        {/* 右下角萌萌的小嫩芽徽章 */}
        <span className="absolute bottom-1 right-1 bg-lime-500 text-white text-xs w-6 h-6 flex items-center justify-center rounded-full border-2 border-white dark:border-zinc-800 z-20 shadow-md">
          🌱
        </span>
      </div>

      {/* 站长昵称与站点介绍 */}
      <h2 className="text-2xl font-black text-slate-800 dark:text-zinc-100 tracking-wide mb-2">
        {siteTitle}
      </h2>
      
      <p className="text-xs text-slate-400 dark:text-zinc-500 font-mono mb-4">
        {siteDescription}
      </p>

      {/* 🧵 拟物横贯线 */}
      <div className="w-16 h-[2px] bg-dashed bg-lime-200 dark:bg-zinc-700 mb-5" />

      {/* ✍️ 完美契合手绘字体的打字特效区域 */}
      <div className="min-h-[24px] flex items-center justify-center">
        <span 
          id="typed" 
          className="text-sm font-medium text-lime-600 dark:text-lime-400 font-mono bg-lime-50/60 dark:bg-lime-950/20 px-3 py-1 rounded-xl border border-dashed border-lime-200/60 dark:border-lime-800/30"
        />
      </div>

    </div>
  )
}