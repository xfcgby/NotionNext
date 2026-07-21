// layouts/LayoutBase.js
import React, { useState, useEffect, useMemo } from 'react'
import { siteConfig } from '@/lib/config'
import CONFIG from '../config'
import * as StyleModule from '../style'
import Header from '../components/Header'
import RightFloatArea from '../components/RightFloatArea'
import ButtonJumpToComment from '../components/ButtonJumpToComment'
import ButtonJumpToTop from '../components/ButtonJumpToTop'
import ButtonRandomPost from '../components/ButtonRandomPost'
import { useSpringBackground } from '../hooks/useSpringBackground'

/**
 * ==========================================================================
 * 【全局核心母版骨架】LayoutBase
 * ==========================================================================
 */
const LayoutBase = props => {
  const [isClient, setIsClient] = useState(false)
  
  // 💡 持有全局天气状态
  const [weatherInfo, setWeatherInfo] = useState({ text: '晴', alert: '' })

  const { children, post } = props
  const DynamicStyleGarden = useMemo(() => {
    if (!StyleModule) return null
    return StyleModule.StyleGarden || StyleModule.default || null
  }, [])

  useEffect(() => {
    setIsClient(true)
  }, [])

  useSpringBackground(isClient)

  useEffect(() => {
    if (!isClient) return
    const enable = siteConfig('ANALYTICS_BUSUANZI_ENABLE', false, CONFIG)
    if (!enable) return
    if (window.__busuanzi_loaded) return
    window.__busuanzi_loaded = true
    const script = document.createElement('script')
    script.src = '//busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js'
    script.async = true
    script.defer = true
    document.body.appendChild(script)
  }, [isClient])

  const floatSlot = (
    <>
      {post && <ButtonJumpToComment />}
      <ButtonJumpToTop />
      <ButtonRandomPost {...props} />
    </>
  )

  return (
    <div id="theme-garden" className="min-h-screen flex flex-col antialiased transition-colors duration-500 relative">
      {isClient ? (
        <canvas
          id="spring-bg-canvas"
          className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none"
          style={{ background: 'radial-gradient(circle at 10% 20%, #F0F9F0, #FFFDF5)' }}
        />
      ) : (
        <div
          className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none"
          style={{ background: 'radial-gradient(circle at 10% 20%, #F0F9F0, #FFFDF5)' }}
        />
      )}
      {DynamicStyleGarden && <DynamicStyleGarden />}
      
      {/* 💡 绑定 Weather 回调 */}
      <Header {...props} onWeatherChange={setWeatherInfo} />

      <div className="flex-grow w-full pt-16">
        {/* 💡 将 weatherInfo 透传给子页面 */}
        {React.isValidElement(children)
          ? React.cloneElement(children, { weatherInfo })
          : children}
      </div>

      <RightFloatArea floatSlot={floatSlot} />
      <footer className="w-full text-center py-10 text-[10px] text-slate-400 dark:text-zinc-600 tracking-widest font-mono border-t border-slate-100/40 dark:border-zinc-900/30 bg-white/30 dark:bg-zinc-950/20">
        🌱 DIGITAL LIFE GARDEN · POWERED BY NOTIONNEXT
      </footer>
    </div>
  )
}

export default LayoutBase