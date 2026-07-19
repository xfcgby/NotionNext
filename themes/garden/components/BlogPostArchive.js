import { useEffect, useRef, useState, useMemo } from 'react'
import SmartLink from '@/components/SmartLink'

/**
 * 博客归档列表 - 视网膜级超清鲜活藤蔓版
 * @param posts 所有文章
 * @param archiveTitle 归档年份标题
 */
const BlogPostArchive = ({ posts = [], archiveTitle }) => {
  // 1. 智能提取所有文章中的【最大年份】
  const displayYear = useMemo(() => {
    if (archiveTitle) return archiveTitle
    if (!posts || posts.length === 0) return new Date().getFullYear()
    
    const years = posts
      .map(post => post.date?.start_date ? new Date(post.date.start_date).getFullYear() : null)
      .filter(Boolean)
    
    return years.length > 0 ? Math.max(...years) : new Date().getFullYear()
  }, [posts, archiveTitle])

  if (!posts || posts.length === 0) {
    return <></>
  }

  const containerRef = useRef(null)
  const canvasRef = useRef(null)
  const [hoveredIndex, setHoveredIndex] = useState(null)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  // 2. 藤蔓物理动画渲染核心
  useEffect(() => {
    if (!isClient) return

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    let animationFrameId
    let frameCount = 0
    let growthProgress = 0 

    const leafStates = posts.map((_, i) => ({
      currentScale: 0, 
      angleOffset: Math.random() * Math.PI * 2,
      side: i % 2 === 0 ? 1 : -1, 
      wiggle: 0,
      wiggleSpeed: 0
    }))

    const resizeAndRender = () => {
      const container = containerRef.current
      if (!container) return

      const rect = container.getBoundingClientRect()
      const cssWidth = 64
      const cssHeight = rect.height

      // --- 【高清修复核心】根据屏幕像素比缩放 Canvas 内部画布分辨率 ---
      const dpr = window.devicePixelRatio || 1
      canvas.width = cssWidth * dpr
      canvas.height = cssHeight * dpr
      
      // 用 CSS 控制它在页面上的实际视觉大小
      canvas.style.width = `${cssWidth}px`
      canvas.style.height = `${cssHeight}px`

      // 将绘图上下文放大对应的倍数，后续所有的绘制代码就不用手动乘以 dpr 了
      ctx.scale(dpr, dpr)

      // 所有的计算坐标依然基于 CSS 实际尺寸
      const liElements = container.querySelectorAll('[data-post-item]')
      const leafPositions = Array.from(liElements).map((li) => {
        const liRect = li.getBoundingClientRect()
        return liRect.top - rect.top + liRect.height / 2
      })

      const drawLoop = () => {
        ctx.clearRect(0, 0, cssWidth, cssHeight)
        frameCount++

        if (growthProgress < 1) {
          growthProgress += 0.015 
        }

        const activeHeight = cssHeight * growthProgress
        const vineStartX = 30 

        // --- 绘制主藤蔓 ---
        ctx.beginPath()
        ctx.strokeStyle = '#059669' 
        ctx.lineWidth = 3
        ctx.lineCap = 'round'
        ctx.lineJoin = 'round'

        let prevX = vineStartX
        let prevY = 0
        ctx.moveTo(prevX, prevY)

        for (let y = 1; y <= activeHeight; y += 4) {
          const dx = Math.sin(y * 0.015 + frameCount * 0.005) * 4 + Math.cos(y * 0.04) * 2
          const currentX = vineStartX + dx
          ctx.lineTo(currentX, y)
          prevX = currentX
          prevY = y
        }
        ctx.stroke()

        // 辅助亮色副梗
        ctx.beginPath()
        ctx.strokeStyle = '#34d399' 
        ctx.lineWidth = 1.2
        ctx.moveTo(vineStartX, 0)
        for (let y = 1; y <= activeHeight; y += 4) {
          const dx = Math.sin(y * 0.015 + frameCount * 0.005) * 4 + Math.cos(y * 0.04) * 2
          ctx.lineTo(vineStartX + dx + 1, y)
        }
        ctx.stroke()

        // --- 绘制每个节点的叶子 ---
        leafPositions.forEach((targetY, index) => {
          if (targetY > activeHeight) return

          const state = leafStates[index]
          const isHovered = hoveredIndex === index

          const targetScale = isHovered ? 1.6 : 1.0
          state.currentScale += (targetScale - state.currentScale) * 0.15

          if (isHovered && state.wiggleSpeed === 0) {
            state.wiggleSpeed = 0.5
          }
          if (state.wiggleSpeed > 0) {
            state.wiggle = Math.sin(frameCount * 0.5) * state.wiggleSpeed
            state.wiggleSpeed *= 0.92 
            if (state.wiggleSpeed < 0.01) state.wiggleSpeed = 0
          } else {
            state.wiggle = 0
          }

          const windSway = Math.sin(frameCount * 0.02 + state.angleOffset) * 0.12
          const vineX = vineStartX + Math.sin(targetY * 0.015 + frameCount * 0.005) * 4 + Math.cos(targetY * 0.04) * 2
          const baseAngle = state.side === 1 ? -Math.PI / 4 : (Math.PI * 5) / 4
          const finalAngle = baseAngle + windSway + state.wiggle

          drawLeaf(ctx, vineX, targetY, finalAngle, state.currentScale, state.side)
        })

        animationFrameId = requestAnimationFrame(drawLoop)
      }

      drawLoop()
    }

    // 绘制高明度鲜活叶片
    const drawLeaf = (ctx, x, y, angle, scale, side) => {
      ctx.save()
      ctx.translate(x, y)
      ctx.rotate(angle)
      ctx.scale(scale, scale)

      const leafLength = 16
      const leafWidth = 9.5

      // 1. 小叶柄
      ctx.beginPath()
      ctx.strokeStyle = '#059669'
      ctx.lineWidth = 1.5
      ctx.moveTo(0, 0)
      ctx.quadraticCurveTo(side * 2, -2, side * 4, -4)
      ctx.stroke()

      ctx.translate(side * 4, -4)

      // 2. 叶片填充渐变
      const gradient = ctx.createLinearGradient(0, 0, 0, leafLength)
      gradient.addColorStop(0, '#a7f3d0') 
      gradient.addColorStop(1, '#34d399') 

      ctx.beginPath()
      ctx.fillStyle = gradient
      ctx.moveTo(0, 0)
      ctx.bezierCurveTo(leafWidth, -leafLength / 3, leafWidth, (leafLength * 2) / 3, 0, leafLength)
      ctx.bezierCurveTo(-leafWidth, (leafLength * 2) / 3, -leafWidth, -leafLength / 3, 0, 0)
      ctx.fill()

      // 3. 轮廓线
      ctx.strokeStyle = '#065f46'
      ctx.lineWidth = 1.2
      ctx.stroke()

      // 4. 叶片主脉络
      ctx.beginPath()
      ctx.moveTo(0, 2)
      ctx.lineTo(0, leafLength * 0.8)
      ctx.strokeStyle = '#047857'
      ctx.lineWidth = 1
      ctx.stroke()

      ctx.restore()
    }

    const resizeObserver = new ResizeObserver(() => {
      resizeAndRender()
    })

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current)
    }

    resizeAndRender()

    return () => {
      cancelAnimationFrame(animationFrameId)
      resizeObserver.disconnect()
    }
  }, [posts, hoveredIndex, isClient])

  return (
    <div className='my-12 relative select-none' ref={containerRef}>
      {/* 标题区域 */}
      <div
        className='pt-4 pb-6 text-2xl font-bold text-emerald-600 dark:text-emerald-400 flex flex-col gap-1 font-serif'
        id={displayYear}
      >
        <div className='flex items-center gap-3'>
          <span className='text-3xl filter drop-shadow-sm animate-bounce' style={{ animationDuration: '3s' }}>🌿</span>
          <span>{displayYear} 年的耕耘成果</span>
        </div>
        <p className='text-xs font-normal text-stone-400 dark:text-stone-500 font-sans pl-11 tracking-wide'>
          🍃 在时光的沃土中，这些思绪已悄然抽枝散叶...
        </p>
      </div>

      {/* 归档列表区 */}
      <div className='relative flex min-h-[100px]'>
        {isClient ? (
          <canvas
            ref={canvasRef}
            className='absolute left-0 top-0 pointer-events-none z-10'
          />
        ) : (
          <div className='absolute left-[30px] top-0 bottom-0 w-[2px] bg-emerald-200 dark:bg-emerald-900/40' />
        )}

        {/* 列表内容 */}
        <ul className='w-full pl-14 space-y-5 m-0 p-0 list-none'>
          {posts?.map((post, index) => {
            return (
              <li
                key={post.id}
                data-post-item
                className='group relative list-none m-0 p-0'
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div
                  id={post?.publishDay}
                  className='flex flex-col md:flex-row md:items-center gap-2 md:gap-5 p-3 rounded-2xl border border-transparent hover:border-emerald-200/50 hover:bg-emerald-50/40 dark:hover:bg-emerald-950/20 transition-all duration-300 ease-out transform group-hover:translate-x-1.5'
                >
                  <span className='text-xs font-mono tracking-wider text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-1 rounded-full w-max border border-emerald-100 dark:border-emerald-900/30'>
                    {post.date?.start_date}
                  </span>

                  <SmartLink
                    href={post?.href}
                    passHref
                    className='text-sm md:text-base text-stone-700 dark:text-stone-300 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-200 font-medium overflow-x-hidden cursor-pointer'
                  >
                    <span className='relative inline-block pb-0.5'>
                      {post.title}
                      <span className='absolute bottom-0 left-0 w-0 h-[2px] bg-gradient-to-r from-emerald-400 to-teal-400 group-hover:w-full transition-all duration-300 ease-out' />
                    </span>
                  </SmartLink>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}

export default BlogPostArchive
