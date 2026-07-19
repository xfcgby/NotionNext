import { useEffect, useRef } from 'react'

/**
 * 🌸 数字花园春季粒子背景动画 Hook
 * 支持夜间模式自动切换配色
 */
export function useSpringBackground(isClient) {
  const isDarkRef = useRef(false)

  useEffect(() => {
    if (!isClient) return

    const canvas = document.getElementById('spring-bg-canvas')
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let w = (canvas.width = window.innerWidth)
    let h = (canvas.height = window.innerHeight)

    const checkDarkMode = () => {
      isDarkRef.current = document.documentElement.classList.contains('dark') || 
                         document.body.classList.contains('dark')
    }
    checkDarkMode()

    const observer = new MutationObserver(checkDarkMode)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] })

    const resize = () => {
      w = canvas.width = window.innerWidth
      h = canvas.height = window.innerHeight
    }
    window.addEventListener('resize', resize)

    // 🌙 颜色配置：采用富有治愈感的林间低饱和荧光色
    const getParticleColors = () => {
      if (isDarkRef.current) {
        return [
          'rgba(147, 251, 111, 0.75)',   // 柔青绿
          'rgba(253, 240, 138, 0.70)',   // 月光黄
          'rgba(190, 242, 100, 0.75)',   // 嫩芽绿
          'rgba(254, 204, 27, 0.65)',    // 琥珀金
        ]
      }
      return [
        'rgba(251, 207, 232, 0.65)',
        'rgba(255, 255, 255, 0.75)',
        'rgba(190, 242, 100, 0.65)'
      ]
    }

    const particles = []
    const initParticles = () => {
      const colors = getParticleColors()
      const count = isDarkRef.current ? 45 : 35 // 适当调低数量，避免画面过于凌乱
      particles.length = 0
      for (let i = 0; i < count; i++) {
        // 夜间萤火虫体积适当增大，但核心变小，主打外围晕染
        const baseSize = isDarkRef.current ? 2.5 + Math.random() * 2.5 : 3 + Math.random() * 4
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: baseSize,
          baseR: baseSize,
          vx: isDarkRef.current ? (Math.random() - 0.5) * 0.25 : 0.2 + Math.random() * 0.3,
          vy: isDarkRef.current ? -(0.1 + Math.random() * 0.2) : 0.4 + Math.random() * 0.5,
          angle: Math.random() * Math.PI * 2,
          spin: (Math.random() - 0.5) * 0.01,
          phase: Math.random() * Math.PI * 2,
          breatheSpeed: 0.01 + Math.random() * 0.015,
          driftAmp: 30 + Math.random() * 40,
          driftFreq: 0.0006 + Math.random() * 0.0012,
          driftPhase: Math.random() * Math.PI * 2,
          color: colors[Math.floor(Math.random() * colors.length)]
        })
      }
    }
    initParticles()

    let animationId
    let frameCount = 0
    let lastDarkState = isDarkRef.current

    const animate = () => {
      frameCount++
      const time = Date.now()

      if (frameCount % 15 === 0) {
        const currentDark = document.documentElement.classList.contains('dark') || document.body.classList.contains('dark')
        if (currentDark !== lastDarkState) {
          isDarkRef.current = currentDark
          lastDarkState = currentDark
          initParticles()
        }
      }

      ctx.globalCompositeOperation = 'source-over'

      if (isDarkRef.current) {
        // 大面积暗色夜空微弱渐变
        const gradient = ctx.createRadialGradient(
          w * 0.5, h * 0.3, 0,
          w * 0.5, h * 0.5, w * 0.7
        )
        gradient.addColorStop(0, '#06130a')
        gradient.addColorStop(0.6, '#0b1810')
        gradient.addColorStop(1, '#040a06')
        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, w, h)
      } else {
        const gradient = ctx.createRadialGradient(w * 0.1, h * 0.2, 0, w * 0.5, h * 0.5, w)
        gradient.addColorStop(0, '#F0F9F0')
        gradient.addColorStop(1, '#FFFDF5')
        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, w, h)
      }

      particles.forEach(p => {
        p.y += p.vy
        p.x += p.vx
        p.angle += p.spin

        if (isDarkRef.current) {
          const driftX = Math.sin(time * p.driftFreq + p.driftPhase) * p.driftAmp * 0.01
          p.x += driftX

          if (p.y < -20) p.y = h + 20
          if (p.x > w + 20) p.x = -20
          if (p.x < -20) p.x = w + 20

          const breathe = Math.sin(time * p.breatheSpeed + p.phase)
          const alpha = 0.3 + (breathe + 1) * 0.35 // 0.3 ~ 1.0 更加自然的呼吸跨度
          const currentR = p.baseR * (0.8 + (breathe + 1) * 0.15)

          ctx.save()
          ctx.translate(p.x, p.y)

          // ✨ 审美重塑：抛弃多层生硬的描边，改用超大模糊半径的 Canvas 原生 Shadow 晕染
          ctx.shadowColor = p.color
          ctx.shadowBlur = currentR * 4.5  // 让模糊区域扩大，产生朦胧的林间雾气感
          
          // 渲染外围极淡的彩色光圈
          ctx.fillStyle = p.color.replace(/[\d.]+\)$/, `${alpha * 0.8})`)
          ctx.beginPath()
          ctx.arc(0, 0, currentR, 0, Math.PI * 2)
          ctx.fill()

          // 核心微弱亮斑（缩小体积，降低刺眼感）
          ctx.shadowBlur = currentR * 1.5
          ctx.shadowColor = '#ffffff'
          ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.9})`
          ctx.beginPath()
          ctx.arc(0, 0, currentR * 0.35, 0, Math.PI * 2)
          ctx.fill()

          ctx.restore()
        } else {
          if (p.y > h) p.y = -10
          if (p.x > w) p.x = -10

          ctx.save()
          ctx.translate(p.x, p.y)
          ctx.rotate(p.angle)
          ctx.fillStyle = p.color
          ctx.beginPath()
          ctx.ellipse(0, 0, p.r, p.r * 1.6, 0, 0, Math.PI * 2)
          ctx.fill()
          ctx.restore()
        }
      })

      if (!isDarkRef.current) {
        const lineColorFn = (dist) => `rgba(217, 249, 157, ${(1 - dist / 130) * 0.12})`
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x
            const dy = particles[i].y - particles[j].y
            const dist = Math.sqrt(dx * dx + dy * dy)
            if (dist < 130) {
              ctx.strokeStyle = lineColorFn(dist)
              ctx.lineWidth = 0.5
              ctx.beginPath()
              ctx.moveTo(particles[i].x, particles[i].y)
              ctx.lineTo(particles[j].x, particles[j].y)
              ctx.stroke()
            }
          }
        }
      }

      animationId = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      window.removeEventListener('resize', resize)
      observer.disconnect()
      if (animationId) cancelAnimationFrame(animationId)
    }
  }, [isClient])
}