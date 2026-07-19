import { useEffect, useRef, useState } from 'react'
import SmartLink from '@/components/SmartLink'

/**
 * 博客归档列表 - 动态手绘藤蔓数字花园版
 * @param posts 所有文章
 * @param archiveTitle 归档年份标题
 */
const BlogPostArchive = ({ posts = [], archiveTitle }) => {
  // 1. 安全提取年份（彻底修复年份显示为空的 bug）
  const displayYear =
    archiveTitle ||
    (posts && posts[0]?.date?.start_date
      ? new Date(posts[0].date.start_date).getFullYear()
      : '') ||
    new Date().getFullYear()

  if (!posts || posts.length === 0) {
    return <></>
  }

  const containerRef = useRef(null)
  const canvasRef = useRef(null)
  const [hoveredIndex, setHoveredIndex] = useState(null)
  const [isClient, setIsClient] = useState(false)

  // 确保在客户端才激活 Canvas
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
    let growthProgress = 0 // 生长动画进度：0 到 1

    // 记录叶片的动态数据
    const leafStates = posts.map((_, i) => ({
      currentScale: 0, // 初始为0，等待生长经过时破芽
      angleOffset: Math.random() * Math.PI * 2,
      side: i % 2 === 0 ? 1 : -1, // 左右交错长出
      wiggle: 0,
      wiggleSpeed: 0
    }))

    const resizeAndRender = () => {
      const container = containerRef.current
      if (!container) return

      const rect = container.getBoundingClientRect()
      // Canvas 高度与容器精确等高，宽度固定为 64px 腾出空间给藤蔓生长
      canvas.width = 64
      canvas.height = rect.height

      // 获取每一篇文章对应的元素中心高度
      const liElements = container.querySelectorAll('[data-post-item]')
      const leafPositions = Array.from(liElements).map((li) => {
        const liRect = li.getBoundingClientRect()
        return liRect.top - rect.top + liRect.height / 2
      })

      const drawLoop = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        frameCount++

        // 缓慢生长的动画曲线
        if (growthProgress < 1) {
          growthProgress += 0.015 // 大约1-2秒内舒展完毕
        }

        const activeHeight = canvas.height * growthProgress
        const vineStartX = 30 // 藤蔓居中基准线

        // --- 绘制主藤蔓 ---
        ctx.beginPath()
        ctx.strokeStyle = '#3d5a45' // 经典手绘墨绿梗色
        ctx.lineWidth = 2.5
        ctx.lineCap = 'round'
        ctx.lineJoin = 'round'

        // 采用贝塞尔/正弦曲线让藤蔓产生像 image_a26b65 一样弯曲缠绕的“野生感”
        let prevX = vineStartX
        let prevY = 0
        ctx.moveTo(prevX, prevY)

        for (let y = 1; y <= activeHeight; y += 4) {
          // 两个不同频段的正弦波叠加，产生完全随机自然扭曲的藤蔓效果
          const dx = Math.sin(y * 0.015 + frameCount * 0.005) * 4 + Math.cos(y * 0.04) * 2
          const currentX = vineStartX + dx
          ctx.lineTo(currentX, y)
          prevX = currentX
          prevY = y
        }
        ctx.stroke()

        // 绘制辅助重叠细梗，打造手绘叠线素描质感
        ctx.beginPath()
        ctx.strokeStyle = 'rgba(74, 117, 89, 0.4)'
        ctx.lineWidth = 1
        ctx.moveTo(vineStartX, 0)
        for (let y = 1; y <= activeHeight; y += 4) {
          const dx = Math.sin(y * 0.015 + frameCount * 0.005) * 4 + Math.cos(y * 0.04) * 2
          ctx.lineTo(vineStartX + dx + 0.8, y)
        }
        ctx.stroke()

        // --- 绘制每个节点的叶子 ---
        leafPositions.forEach((targetY, index) => {
          // 只有当藤蔓生长到对应高度时，叶子才开始萌发
          if (targetY > activeHeight) return

          const state = leafStates[index]
          const isHovered = hoveredIndex === index

          // 物理弹性动画：计算叶片的缩放
          const targetScale = isHovered ? 1.6 : 1.0
          state.currentScale += (targetScale - state.currentScale) * 0.15

          // 悬停时触发微颤抖物理模拟
          if (isHovered && state.wiggleSpeed === 0) {
            state.wiggleSpeed = 0.5
          }
          if (state.wiggleSpeed > 0) {
            state.wiggle = Math.sin(frameCount * 0.5) * state.wiggleSpeed
            state.wiggleSpeed *= 0.92 // 逐渐衰减
            if (state.wiggleSpeed < 0.01) state.wiggleSpeed = 0
          } else {
            state.wiggle = 0
          }

          // 柔和微风吹拂效果：让不活跃的叶片也极其缓慢地呼吸摆动
          const windSway = Math.sin(frameCount * 0.02 + state.angleOffset) * 0.12

          // 获取当前高度对应的藤蔓精确 X 坐标
          const vineX = vineStartX + Math.sin(targetY * 0.015 + frameCount * 0.005) * 4 + Math.cos(targetY * 0.04) * 2

          // 叶子偏转角度：左侧叶子指向左上，右侧叶子指向右上
          const baseAngle = state.side === 1 ? -Math.PI / 4 : (Math.PI * 5) / 4
          const finalAngle = baseAngle + windSway + state.wiggle

          drawLeaf(ctx, vineX, targetY, finalAngle, state.currentScale, state.side)
        })

        animationFrameId = requestAnimationFrame(drawLoop)
      }

      drawLoop()
    }

    // 手绘叶子渲染（完美还原自 image_a26b65.png 的饱满水滴叶片风格）
    const drawLeaf = (ctx, x, y, angle, scale, side) => {
      ctx.save()
      ctx.translate(x, y)
      ctx.rotate(angle)
      ctx.scale(scale, scale)

      const leafLength = 16
      const leafWidth = 9

      // 1. 绘制小叶柄
      ctx.beginPath()
      ctx.strokeStyle = '#3d5a45'
      ctx.lineWidth = 1.5
      ctx.moveTo(0, 0)
      ctx.quadraticCurveTo(side * 2, -2, side * 4, -4)
      ctx.stroke()

      ctx.translate(side * 4, -4)

      // 2. 绘制叶片填充（柔和的治愈系莫兰迪森绿）
      ctx.beginPath()
      ctx.fillStyle = '#8fa89b' // 白天模式优雅灰绿
      ctx.moveTo(0, 0)
      // 饱满贝塞尔曲线：勾勒出饱满、微尖的手绘叶片
      ctx.bezierCurveTo(leafWidth, -leafLength / 3, leafWidth, (leafLength * 2) / 3, 0, leafLength)
      ctx.bezierCurveTo(-leafWidth, (leafLength * 2) / 3, -leafWidth, -leafLength / 3, 0, 0)
      ctx.fill()

      // 3. 绘制手绘风深色轮廓边缘
      ctx.strokeStyle = '#2d3e33'
      ctx.lineWidth = 1.2
      ctx.stroke()

      // 4. 绘制叶片主脉络
      ctx.beginPath()
      ctx.moveTo(0, 2)
      ctx.lineTo(0, leafLength * 0.8)
      ctx.strokeStyle = '#516f5c'
      ctx.lineWidth = 1
      ctx.stroke()

      ctx.restore()
    }

    // 引入监听器防止在伸缩浏览器或容器大小变化时 Canvas 拉伸变形
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
      {/* 3. 焕然一新的手绘风标题区域 */}
      <div
        className='pt-4 pb-6 text-2xl font-bold text-emerald-800 dark:text-emerald-400 flex flex-col gap-1 font-serif'
        id={displayYear}
      >
        <div className='flex items-center gap-3'>
          <span className='text-3xl filter drop-shadow-sm'>🌿</span>
          <span>{displayYear} 年的耕耘成果</span>
        </div>
        <p className='text-xs font-normal text-stone-400 dark:text-stone-500 font-sans pl-11 tracking-wide'>
          🍃 在时光的沃土中，这些思绪已悄然抽枝散叶...
        </p>
      </div>

      {/* 4. 归档列表区 */}
      <div className='relative flex min-h-[100px]'>
        {/* 动态藤蔓 Canvas (只在客户端渲染，完美实现渐进增强) */}
        {isClient ? (
          <canvas
            ref={canvasRef}
            className='absolute left-0 top-0 pointer-events-none z-10'
            style={{ width: '64px' }}
          />
        ) : (
          // 纯静态 CSS 备用轴线：防止 JS 未加载时排版崩溃（SEO 极其友好）
          <div className='absolute left-[30px] top-0 bottom-0 w-[2px] bg-emerald-100 dark:bg-emerald-950/40' />
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
                {/* 手绘治愈卡片边框：鼠标悬停时会有极轻微的背景扩散和淡淡的生机绿意 */}
                <div
                  id={post?.publishDay}
                  className='flex flex-col md:flex-row md:items-center gap-2 md:gap-5 p-3 rounded-2xl border border-transparent hover:border-emerald-100/50 hover:bg-emerald-50/20 dark:hover:bg-emerald-950/10 transition-all duration-300 ease-out transform group-hover:translate-x-1.5'
                >
                  {/* 年轮痕迹般的日期标签 */}
                  <span className='text-xs font-mono tracking-wider text-stone-400 dark:text-stone-500 bg-stone-100/50 dark:bg-zinc-800/40 px-2.5 py-1 rounded-full w-max'>
                    {post.date?.start_date}
                  </span>

                  {/* 文章标题 */}
                  <SmartLink
                    href={post?.href}
                    passHref
                    className='text-sm md:text-base text-stone-700 dark:text-stone-300 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors duration-200 font-medium overflow-x-hidden cursor-pointer'
                  >
                    <span className='relative inline-block pb-0.5'>
                      {post.title}
                      {/* 仿植物生长的横向延伸划线 */}
                      <span className='absolute bottom-0 left-0 w-0 h-[1.5px] bg-gradient-to-r from-emerald-400 to-teal-400 group-hover:w-full transition-all duration-300 ease-out' />
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
