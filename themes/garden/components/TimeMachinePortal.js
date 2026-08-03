import React, { useState, useRef, useEffect, useCallback } from 'react'
import { siteConfig } from '@/lib/config'

/**
 * 🚀 花园同色系手绘火箭 (坐标与角度已调整：朝向时间轴右侧行进)
 */
const GardenRocketIcon = ({ className = '', size = 34 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    {/* 尾部手绘火焰 (向左下方/正左喷射) */}
    <path 
      d="M 28 60 L 15 60 L 20 56 L 12 52 L 19 49 L 11 45 L 19 42 L 15 38 L 28 38 Z" 
      className="fill-amber-400 stroke-amber-500/80" 
      strokeWidth="2"
    />

    {/* 下(左)侧尾翼 (Lime 绿) */}
    <path 
      d="M 50 64 C 45 70 38 75 32 75 C 32 68 33 64 34 62 Z" 
      className="fill-lime-400 dark:fill-lime-500 stroke-slate-700 dark:stroke-slate-200" 
    />
    
    {/* 上(右)侧尾翼 (Lime 绿) */}
    <path 
      d="M 50 36 C 45 30 38 25 32 25 C 32 32 33 36 34 38 Z" 
      className="fill-lime-400 dark:fill-lime-500 stroke-slate-700 dark:stroke-slate-200" 
    />

    {/* 火箭主体 (柔和奶白/夜间暗绿) */}
    <path 
      d="M 88 50 C 70 32 40 32 34 38 L 34 62 C 40 68 70 68 88 50 Z" 
      className="fill-emerald-50/90 dark:fill-slate-800 stroke-slate-700 dark:stroke-slate-200" 
    />

    {/* 火箭顶端帽 (Emerald 绿 - 朝右) */}
    <path 
      d="M 88 50 C 80 43 72 38 68 36 C 65 43 65 57 68 64 C 72 62 80 57 88 50 Z" 
      className="fill-emerald-400 dark:fill-emerald-500 stroke-slate-700 dark:stroke-slate-200" 
    />

    {/* 舷窗框与镜面 (Sky 蓝) */}
    <circle 
      cx="55" 
      cy="50" 
      r="10" 
      className="fill-sky-200 dark:fill-sky-900 stroke-slate-700 dark:stroke-slate-200" 
      strokeWidth="2.5" 
    />
    {/* 舷窗反光 */}
    <path d="M 53 46 Q 50 50 52 52" strokeWidth="2" className="stroke-white/80" />

    {/* 尾部喷口连接环 (Amber 褐木色) */}
    <rect 
      x="28" 
      y="37" 
      width="6" 
      height="26" 
      rx="2" 
      className="fill-amber-200 dark:fill-amber-800 stroke-slate-700 dark:stroke-slate-200" 
      strokeWidth="2" 
    />
  </svg>
)

/**
 * 🌳 核心算法：根据年份与文章数量，动态计算生长阶段
 */
const getMilestonesFromPosts = (posts = [], startYear, currentYear) => {
  const milestones = {}
  let accumulatedCount = 0
  for (let year = startYear; year <= currentYear; year++) {
    const yearPosts = posts.filter(post => {
      const dateStr = post?.publishDate || post?.date?.start_date || post?.createdTime
      if (!dateStr) return false
      return new Date(dateStr).getFullYear() === year
    })
    const yearPostCount = yearPosts.length
    accumulatedCount += yearPostCount

    let growthStage = { icon: '🌰', statusText: '埋于土壤' }
    if (accumulatedCount === 0) { growthStage = { icon: '🌰', statusText: '埋于土壤' } }
    else if (accumulatedCount <= 3) { growthStage = { icon: '🌱', statusText: '嫩芽破土' } }
    else if (accumulatedCount <= 8) { growthStage = { icon: '🌿', statusText: '枝叶渐茂' } }
    else if (accumulatedCount <= 15) { growthStage = { icon: '🌳', statusText: '参天大树' } }
    else { growthStage = { icon: '👕', statusText: '晾衣丰收' } }

    const latestPost = yearPosts[0]
    const representativeTitle = latestPost?.title || `${year} 年轮篇章`
    milestones[year] = {
      icon: latestPost?.pageIcon || growthStage.icon,
      title: representativeTitle,
      count: yearPostCount,
      accumulated: accumulatedCount,
      statusText: growthStage.statusText
    }
  }
  return milestones
}

export default function TimeMachinePortal({ children, posts = [], ...props }) {
  const startYear = parseInt(siteConfig('SINCE', 2025, props)) || 2025
  const [sliderPos, setSliderPos] = useState(8)
  const [isDragging, setIsDragging] = useState(false)
  const [isUnlocked, setIsUnlocked] = useState(true)
  const [isCollapsing, setIsCollapsing] = useState(false)
  const [burstParticles, setBurstParticles] = useState([])
  const [nodes, setNodes] = useState([])
  const [currentYear, setCurrentYear] = useState(startYear)
  const [milestones, setMilestones] = useState({})
  const [triggeredNodes, setTriggeredNodes] = useState(new Set())
  const [longPressProgress, setLongPressProgress] = useState(0)
  const longPressTimerRef = useRef(null)
  const [foldExpanded, setFoldExpanded] = useState(false)
  const [foldHovered, setFoldHovered] = useState(false)
  const trackRef = useRef(null)
  const canvasRef = useRef(null)
  const particlesRef = useRef([])

  useEffect(() => {
    const localYear = new Date().getFullYear()
    setCurrentYear(localYear)
    const diff = localYear - startYear
    let generatedNodes = []
    if (diff <= 4) {
      for (let y = startYear; y <= localYear; y++) {
        generatedNodes.push({ type: 'year', year: y, label: `${y}${y === localYear ? ' 今日' : ''}` })
      }
    } else {
      generatedNodes = [
        { type: 'year', year: startYear, label: `${startYear}` },
        { type: 'year', year: startYear + 1, label: `${startYear + 1}` },
        { type: 'fold', start: startYear + 2, end: localYear - 2, label: `~ 耕耘 ${diff - 2} 载 ~` },
        { type: 'year', year: localYear - 1, label: `${localYear - 1}` },
        { type: 'year', year: localYear, label: `${localYear} 今日` }
      ]
    }
    setNodes(generatedNodes)
    setMilestones(getMilestonesFromPosts(posts, startYear, localYear))
    if (!sessionStorage.getItem('GARDEN_TIME_TRAVELLED')) {
      setIsUnlocked(false)
    }
  }, [posts, startYear])

  const triggerNodeCelebration = useCallback((year, milestone, nodeEl) => {
    if (!canvasRef.current || !nodeEl) return
    const canvas = canvasRef.current
    const nodeRect = nodeEl.getBoundingClientRect()
    const canvasRect = canvas.getBoundingClientRect()
    const cx = nodeRect.left + nodeRect.width / 2 - canvasRect.left
    const cy = nodeRect.top + nodeRect.height / 2 - canvasRect.top
    const colorMap = {
      '🌰': ['#8B4513', '#a3e635', '#4ade80'], '🌱': ['#84cc16', '#4ade80', '#bef264'],
      '🌿': ['#228B22', '#4ade80', '#facc15'], '🌳': ['#228B22', '#4ade80', '#facc15'],
      '👕': ['#60a5fa', '#f472b6', '#facc15'], '🌸': ['#f472b6', '#facc15', '#fb7185'],
      '☀️': ['#facc15', '#fb923c', '#f87171']
    }
    const colors = colorMap[milestone?.icon] || ['#84cc16', '#4ade80', '#a3e635']
    for (let i = 0; i < 18; i++) {
      const angle = (Math.PI * 2 * i) / 18 + (Math.random() - 0.5) * 0.5
      const speed = Math.random() * 3 + 1.5
      particlesRef.current.push({
        x: cx, y: cy, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed - 1,
        size: Math.random() * 5 + 2, color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 1, rotation: Math.random() * Math.PI * 2, rotSpeed: (Math.random() - 0.5) * 0.2,
        type: Math.random() > 0.5 ? 'leaf' : 'circle', gravity: 0.05, decay: 0.015
      })
    }
  }, [])

  const expandFold = useCallback(() => { setFoldExpanded(true) }, [])
  const collapseFold = useCallback(() => {
    const foldIndex = nodes.findIndex(n => n.type === 'fold')
    if (foldIndex === -1) { setFoldExpanded(false); return }
    const foldThreshold = (foldIndex / (nodes.length - 1)) * 100 - 12
    const isNearFold = sliderPos >= foldThreshold && sliderPos <= foldThreshold + 30
    if (!isNearFold) { setFoldExpanded(false) }
  }, [nodes, sliderPos])

  useEffect(() => {
    if (isUnlocked || isCollapsing) return
    const todayThreshold = 92
    const isAtEnd = sliderPos >= todayThreshold && isDragging
    if (isAtEnd) {
      if (!longPressTimerRef.current) {
        let progress = 0
        longPressTimerRef.current = setInterval(() => {
          progress += 10; setLongPressProgress(progress)
          if (progress >= 100) {
            clearInterval(longPressTimerRef.current); longPressTimerRef.current = null; triggerCollapse()
          }
        }, 100)
      }
    } else {
      if (longPressTimerRef.current) { clearInterval(longPressTimerRef.current); longPressTimerRef.current = null }
      setLongPressProgress(0)
    }
    return () => { if (longPressTimerRef.current) { clearInterval(longPressTimerRef.current); longPressTimerRef.current = null } }
  }, [sliderPos, isDragging, isUnlocked, isCollapsing])

  useEffect(() => {
    if (isUnlocked) return
    const canvas = canvasRef.current; if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animationFrameId
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      if (isDragging && trackRef.current) {
        const rect = trackRef.current.getBoundingClientRect()
        const pinX = (sliderPos / 100) * rect.width; const pinY = rect.height / 2
        for (let i = 0; i < 3; i++) {
          particlesRef.current.push({
            x: pinX + (Math.random() - 0.5) * 12, y: pinY + (Math.random() - 0.5) * 12,
            vx: -Math.random() * 2 - 1, vy: (Math.random() - 0.5) * 2,
            size: Math.random() * 5 + 2, color: ['#84cc16', '#4ade80', '#a3e635', '#bef264', '#facc15'][Math.floor(Math.random() * 5)],
            rotation: Math.random() * Math.PI * 2, alpha: 1, type: 'trail', gravity: 0, decay: 0.02
          })
        }
      }
      particlesRef.current.forEach((p, index) => {
        p.x += p.vx; p.y += p.vy; p.alpha -= p.decay || 0.02; p.size *= 0.96
        if (p.gravity) p.vy += p.gravity; if (p.rotSpeed) p.rotation += p.rotSpeed
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rotation || 0)
        ctx.fillStyle = p.color; ctx.globalAlpha = Math.max(p.alpha, 0)
        if (p.type === 'leaf' || p.type === 'trail') {
          ctx.beginPath(); ctx.ellipse(0, 0, p.size, p.size / 2, 0, 0, Math.PI * 2); ctx.fill()
        } else { ctx.beginPath(); ctx.arc(0, 0, p.size, 0, Math.PI * 2); ctx.fill() }
        ctx.restore()
        if (p.alpha <= 0) particlesRef.current.splice(index, 1)
      })
      animationFrameId = requestAnimationFrame(render)
    }
    render()
    return () => cancelAnimationFrame(animationFrameId)
  }, [isDragging, sliderPos, isUnlocked])

  useEffect(() => {
    if (isUnlocked) return
    nodes.forEach((node, index) => {
      if (node.type !== 'year') return
      const threshold = (index / (nodes.length - 1)) * 100 - 8
      const isReached = sliderPos >= threshold
      if (isReached && !triggeredNodes.has(node.year) && milestones[node.year]) {
        setTriggeredNodes(prev => { const next = new Set(prev); next.add(node.year); return next })
        setTimeout(() => {
          const el = document.querySelector(`[data-year-node="${node.year}"]`)
          if (el) triggerNodeCelebration(node.year, milestones[node.year], el)
        }, 50)
      }
    })
  }, [sliderPos, nodes, milestones, triggeredNodes, isUnlocked, triggerNodeCelebration])

  useEffect(() => {
    const foldIndex = nodes.findIndex(n => n.type === 'fold')
    if (foldIndex === -1) return
    const foldThreshold = (foldIndex / (nodes.length - 1)) * 100 - 12
    const isNearFold = sliderPos >= foldThreshold && sliderPos <= foldThreshold + 30
    if (isNearFold && !foldExpanded) {
      setFoldExpanded(true)
      const canvas = canvasRef.current
      if (canvas) {
        const foldEl = document.querySelector('[data-fold-node="true"]')
        if (foldEl) {
          const rect = foldEl.getBoundingClientRect(); const cRect = canvas.getBoundingClientRect()
          const cx = rect.left + rect.width / 2 - cRect.left; const cy = rect.top - cRect.top
          for (let i = 0; i < 15; i++) {
            const angle = (Math.PI * 2 * i) / 15 + (Math.random() - 0.5) * 0.5; const speed = Math.random() * 2 + 1
            particlesRef.current.push({
              x: cx, y: cy, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed - 1,
              size: Math.random() * 4 + 2, color: ['#84cc16', '#facc15'][Math.floor(Math.random() * 2)],
              alpha: 0.8, rotation: Math.random() * Math.PI * 2, type: 'leaf', gravity: 0.03, decay: 0.01
            })
          }
        }
      }
    } else if (!isNearFold && foldExpanded && !foldHovered) { setFoldExpanded(false) }
  }, [sliderPos, nodes, foldExpanded, foldHovered])

  const handleMove = (clientX) => {
    if (!trackRef.current || isCollapsing || isUnlocked) return
    const rect = trackRef.current.getBoundingClientRect()
    const offsetX = clientX - rect.left
    let percent = (offsetX / rect.width) * 100
    if (percent < 6) percent = 6; if (percent > 94) percent = 94
    setSliderPos(percent)
  }

  const triggerCollapse = () => {
    setIsCollapsing(true)
    sessionStorage.getItem && sessionStorage.setItem('GARDEN_TIME_TRAVELLED', 'true')
    const icons = ['🍃', '🌿', '☁️', '🌸', '🌱', '🚀', '✨', '⭐']
    const newParticles = []
    for (let i = 0; i < 20; i++) {
      const angle = (i / 20) * Math.PI * 2; const dist = Math.random() * 300 + 200
      newParticles.push({ id: i, icon: icons[i % icons.length], x: Math.cos(angle) * dist, y: Math.sin(angle) * dist, rotate: Math.random() * 360, scale: Math.random() * 1.5 + 0.8 })
    }
    setBurstParticles(newParticles)
    setTimeout(() => { setIsUnlocked(true) }, 800)
  }

  const handleMouseDown = () => setIsDragging(true)
  const handleMouseMove = (e) => isDragging && handleMove(e.clientX)
  const handleTouchMove = (e) => { if (e.touches && e.touches[0]) handleMove(e.touches[0].clientX) }

  useEffect(() => {
    const onUp = () => {
      setIsDragging(false)
      if (longPressTimerRef.current) { clearInterval(longPressTimerRef.current); longPressTimerRef.current = null }
      setLongPressProgress(0)
    }
    window.addEventListener('mouseup', onUp); window.addEventListener('touchend', onUp)
    return () => { window.removeEventListener('mouseup', onUp); window.removeEventListener('touchend', onUp) }
  }, [])

  if (isUnlocked) return <>{children}</>

  return (
    <div className="relative w-full min-h-screen overflow-hidden bg-[#FAFDF6] dark:bg-[#0d1f12] text-slate-800 dark:text-slate-100">
      {/* 🍃 散开粒子 */}
      {isCollapsing && (
        <div className="fixed inset-0 z-[1000] pointer-events-none flex items-center justify-center overflow-hidden">
          {burstParticles.map(p => (
            <span key={p.id} className="absolute text-3xl md:text-5xl transition-all duration-1000 ease-out filter drop-shadow-md opacity-0"
              style={{ transform: isCollapsing ? `translate(${p.x}px, ${p.y}px) rotate(${p.rotate}deg) scale(${p.scale})` : 'translate(0px, 0px) scale(0.5)', opacity: isCollapsing ? 0 : 1 }}
            >{p.icon}</span>
          ))}
        </div>
      )}

      {/* 🚀 时空传送门主遮罩 */}
      <div className={`fixed inset-0 z-[999] flex flex-col items-center justify-center transition-all duration-800 ease-in-out select-none ${isCollapsing ? 'opacity-0 scale-110 pointer-events-none' : 'opacity-100 scale-100'}`}
        style={{ background: 'inherit', backgroundImage: 'radial-gradient(rgba(132, 204, 22, 0.15) 1.2px, transparent 1.2px)', backgroundSize: '24px 24px', clipPath: isCollapsing ? 'circle(0% at 50% 50%)' : 'circle(150% at 50% 50%)', transition: 'clip-path 800ms cubic-bezier(0.4, 0, 0.2, 1), opacity 800ms ease' }}
      >
        {/* 跳过按钮 */}
        <button onClick={triggerCollapse} className="absolute top-8 right-8 text-xs font-mono px-4 py-2 rounded-full bg-white/70 dark:bg-black/40 backdrop-blur-md text-lime-700 dark:text-lime-300 border border-lime-500/20 shadow-sm hover:scale-105 hover:bg-lime-500/10 transition-all cursor-pointer">
          直接穿梭 ➔
        </button>

        {/* 标题区域 */}
        <div className="text-center mb-12 z-10 px-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 text-xs font-mono bg-lime-500/10 dark:bg-lime-400/10 text-lime-700 dark:text-lime-300 rounded-full mb-4 border border-lime-500/20 backdrop-blur-md shadow-inner">
            <span className="w-2 h-2 rounded-full bg-lime-500 animate-ping" /> 🚀 时空航线 ({startYear} - {currentYear})
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-wider font-mono text-slate-800 dark:text-slate-100 drop-shadow-sm">
            时空传送门
          </h1>
         <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-3 font-mono">
           滑动火箭解锁花园 ☀️
          </p>
        </div>

        {/* ⏳ 交互主卡片 */}
        <div ref={trackRef} onMouseMove={handleMouseMove} onTouchMove={handleTouchMove}
          className="garden-card relative w-11/12 max-w-2xl h-60 flex items-center justify-between px-10 z-10 border border-lime-500/20"
        >
          <canvas ref={canvasRef} width={600} height={240} className="absolute inset-0 pointer-events-none z-20 w-full h-full" />
          <div className="absolute left-10 right-10 h-1 bg-lime-900/10 dark:bg-lime-100/10 border-b-2 border-dashed border-lime-600/40 dark:border-lime-400/40" />
          <div className="absolute left-10 h-1.5 bg-gradient-to-r from-lime-500 via-emerald-400 to-lime-300 rounded-full transition-all duration-75 shadow-[0_0_12px_rgba(132,204,22,0.5)]" style={{ width: `calc(${sliderPos}% - 20px)` }} />

          {/* 节点渲染 */}
          {nodes.map((node, index) => {
            if (node.type === 'fold') {
              const hiddenYears = []; for (let y = node.start; y <= node.end; y++) { hiddenYears.push(y) }
              return (
                <div key={index} data-fold-node="true" className="relative z-10 flex flex-col items-center cursor-pointer"
                  onMouseEnter={() => { setFoldHovered(true); expandFold() }}
                  onMouseLeave={() => { setFoldHovered(false); collapseFold() }}
                >
                  {/* 折叠卡片堆 */}
                  <div className="absolute transition-all duration-500" style={{ bottom: 60, opacity: foldExpanded ? 0 : 1, transform: foldExpanded ? 'translateY(-10px) scale(0.8)' : 'translateY(0) scale(1)' }}>
                    <div className="relative w-8 h-10">
                      {hiddenYears.slice(0, 5).map((y, i) => (
                        <div key={y} className="absolute inset-0 bg-white/80 dark:bg-slate-800/80 rounded border border-lime-500/30 shadow-sm" style={{ transform: `rotate(${-8 + i * 6}deg) translateY(${i * 2}px)`, zIndex: i }} />
                      ))}
                      <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-lime-600">+{hiddenYears.length}</span>
                    </div>
                    <div className="w-[2px] h-3 bg-amber-700/60 mx-auto opacity-60" />
                  </div>

                  {/* 展开扇形 (魔术纸牌效果) */}
                  <div className="absolute transition-all duration-500 flex justify-center"
                    style={{ bottom: 60, opacity: foldExpanded ? 1 : 0, pointerEvents: foldExpanded ? 'auto' : 'none', transform: foldExpanded ? 'translateY(0) scale(1)' : 'translateY(10px) scale(0.9)' }}
                  >
                    <div className="relative" style={{ width: `${hiddenYears.length > 6 ? 320 : hiddenYears.length * 56}px`, height: '140px' }}>
                      {hiddenYears.map((y, i) => {
                        const ms = milestones[y] || { icon: '📄', count: 0 }
                        const total = hiddenYears.length
                        const isCrowded = total > 6
                        const offsetX = isCrowded ? (i - total / 2) * 18 : (i - (total - 1) / 2) * 56
                        const rotate = isCrowded ? (i - total / 2) * 1.5 : (i - (total - 1) / 2) * 6
                        return (
                          <div key={y} className="absolute left-1/2 top-0 w-12 h-16 bg-white/95 dark:bg-slate-800/95 rounded-lg border border-lime-500/30 shadow-md flex flex-col items-center justify-center p-1 hover:scale-125 hover:z-50 hover:shadow-xl hover:bg-white hover:dark:bg-slate-700 transition-all duration-200 cursor-pointer"
                            style={{ transform: `translateX(calc(-50% + ${offsetX}px)) rotate(${rotate}deg)`, opacity: 1, zIndex: i < total / 2 ? i : total - i, transitionDelay: `${i * 30}ms` }}
                          >
                            <span className="text-[8px] text-slate-400 dark:text-slate-500">{y}</span>
                            <span className="text-base my-0.5">{ms.icon}</span>
                            <span className="text-[7px] text-lime-600 font-bold">{ms.count}篇</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  <div className={`border-2 border-white dark:border-slate-900 shadow-md transition-all duration-300 ${foldExpanded ? 'w-6 h-6 bg-[#84cc16] ring-4 ring-lime-400/30 animate-pulse rounded-full' : 'w-4 h-4 bg-slate-300 dark:bg-slate-700 rounded-full'}`} />
                  <span className="font-mono text-xs mt-2.5 text-slate-400 dark:text-slate-500"> 〰️〰️ </span>
                </div>
              )
            }

            // 普通年份节点
            const isToday = node.year === currentYear
            const milestone = milestones[node.year] || { icon: '🌰', title: `${node.year} 篇章`, count: 0, statusText: '蓄力中' }
            const nodePercent = (index / (nodes.length - 1)) * 100
            const isReached = sliderPos >= nodePercent - 8
            const wasTriggered = triggeredNodes.has(node.year)

            return (
              <div key={node.year} data-year-node={node.year} className="relative z-10 flex flex-col items-center">
                {/* 📌 悬挂卡片气泡 —— 带摆动动画 */}
                <div className="absolute flex flex-col items-center transition-all duration-500 ease-out"
                  style={{ bottom: 60, opacity: isReached ? 1 : 0.35, transform: isReached ? 'translateY(0) scale(1)' : 'translateY(8px) scale(0.9)', pointerEvents: 'none' }}
                >
                  <div className="flex items-center gap-2.5 w-44 px-3 py-2 rounded-xl bg-white/90 dark:bg-slate-800/90 border border-lime-500/20 shadow-sm backdrop-blur-md"
                    style={{
                      boxShadow: wasTriggered ? '0 0 0 2px rgba(132,204,22,0.3)' : '0 4px 12px rgba(0,0,0,0.05)',
                      animation: isReached ? 'swing 3s ease-in-out infinite' : 'none',
                      transformOrigin: 'top center'
                    }}
                  >
                    <span className="text-2xl flex-shrink-0">{milestone.icon}</span>
                    <div className="flex flex-col overflow-hidden text-left">
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">{milestone.title}</span>
                      <span className="text-[10px] font-mono flex items-center gap-1">
                        <span className="text-lime-600 dark:text-lime-400 font-bold">{milestone.statusText}</span>
                        <span className="text-slate-400 dark:text-slate-500">({milestone.count}篇)</span>
                      </span>
                    </div>
                  </div>
                  <div className="w-[2px] h-4 bg-amber-700/60 dark:bg-amber-600/60" />
                </div>

                <div className={`border-2 border-white dark:border-slate-900 shadow-md transition-all duration-300 ${isToday ? 'w-6 h-6 bg-[#4ade80] ring-4 ring-lime-400/30 animate-pulse rounded-full' : isReached ? 'w-5 h-5 bg-[#84cc16] rounded-full scale-110 shadow-[0_0_8px_rgba(132,204,22,0.6)]' : 'w-4 h-4 bg-slate-300 dark:bg-slate-700 rounded-full'}`} />
                <span className={`font-mono text-xs mt-2.5 transition-all ${isToday ? 'font-black text-lime-600 dark:text-lime-400 scale-110' : isReached ? 'text-slate-800 dark:text-slate-200 font-bold' : 'text-slate-400 dark:text-slate-500'}`}>
                  {node.label}
                </span>
              </div>
            )
          })}

          {/* 🚀 可拖动的花园同色系火箭（向右飞行） */}
          <div onMouseDown={handleMouseDown} onTouchStart={() => setIsDragging(true)} style={{ left: `calc(${sliderPos}% - 26px)` }}
            className={`absolute z-30 cursor-grab active:cursor-grabbing top-1/2 -translate-y-1/2 flex flex-col items-center transition-transform duration-75 ${isDragging ? 'scale-125 -rotate-6' : 'hover:scale-110'}`}
          >
            <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border-2 border-lime-500 shadow-lg rounded-2xl p-1.5 flex items-center justify-center ring-4 ring-lime-400/20">
              <GardenRocketIcon size={34} className="animate-hand-sketch filter drop-shadow-sm" />
            </div>
            <span className="text-[10px] mt-2 whitespace-nowrap bg-lime-500 text-white dark:text-slate-900 font-bold px-2.5 py-0.5 rounded-full font-mono shadow-md animate-pulse">
              {sliderPos >= 92 ? '按住解锁!' : '拖动火箭 ➔'}
            </span>
          </div>
        </div>

        {/* 长按进度条 */}
        <div className="mt-8 w-32 h-1 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden transition-opacity duration-300" style={{ opacity: sliderPos >= 92 && isDragging && !isCollapsing ? 1 : 0 }}>
          <div className="h-full bg-gradient-to-r from-lime-500 to-emerald-400 rounded-full transition-all duration-100" style={{ width: `${longPressProgress}%` }} />
        </div>
        <div className="mt-2 text-xs font-mono text-lime-600 dark:text-lime-400 font-bold transition-opacity duration-300" style={{ opacity: sliderPos >= 92 && isDragging && !isCollapsing ? 1 : 0 }}>
          按住火箭解锁时光...
        </div>
      </div>

      {/* 👇 摆动与手绘帧抖动动画定义 */}
      <style>{`
        @keyframes swing { 
          0% { transform: rotate(-3deg); } 
          50% { transform: rotate(3deg); } 
          100% { transform: rotate(-3deg); } 
        }
        @keyframes hand-sketch {
          0%, 100% { transform: rotate(0deg) scale(1); }
          20% { transform: rotate(-2deg) translate(-0.5px, 0.5px) scale(0.98); }
          40% { transform: rotate(2deg) translate(0.5px, -0.5px) scale(1.02); }
          60% { transform: rotate(-1deg) translate(-0.5px, -0.5px) scale(0.99); }
          80% { transform: rotate(1deg) translate(0.5px, 0.5px) scale(1.01); }
        }
        .animate-hand-sketch {
          animation: hand-sketch 0.8s steps(1) infinite;
        }
      `}</style>
      
      <div className={!isUnlocked && !isCollapsing ? 'opacity-0' : 'opacity-100 transition-opacity duration-1000'}>
        {children}
      </div>
    </div>
  )
}