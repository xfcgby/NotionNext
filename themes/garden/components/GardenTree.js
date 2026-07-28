// components/GardenTree.js
import React, { useEffect, useRef, memo } from 'react'

/**
 * 🌳 自然生长生命树 · 全环境自适应与 Perlin 动态自然风完美版
 * ✨ 特效：雷雨闪电、流动迷雾、全天气覆盖粒子系统（雨/雪/云/冰雹/雨夹雪）
 * ⚡ 优化：零 GC 开销复用 Vector、完备的雷电残影清理与极端性能防护
 */
const GardenTree = memo(({ posts = [], currentYear = 2026, weatherText = '晴', month = 7, onCategoryFilter }) => {
  const containerRef = useRef(null)
  const p5InstanceRef = useRef(null)
  const dataRef = useRef({ posts, currentYear, weatherText, month })
  const filterRef = useRef(onCategoryFilter)

  const gardenColors = ['#f9a8d4', '#93c5fd', '#86efac', '#fcd34d', '#c084fc', '#67e8f9', '#fb923c', '#fb923c']

  const hashCode = (str) => {
    let hash = 5381
    for (let i = 0; i < str.length; i++) hash = (hash * 33) ^ str.charCodeAt(i)
    return Math.abs(hash)
  }

  const getCategoryColor = (category, currentMonth) => {
    const hex = gardenColors[hashCode(String(category)) % gardenColors.length]
    let r = parseInt(hex.slice(1, 3), 16)
    let g = parseInt(hex.slice(3, 5), 16)
    let b = parseInt(hex.slice(5, 7), 16)

    if (currentMonth >= 3 && currentMonth <= 5) {
      r = Math.min(255, r + 40); g = Math.max(0, g - 20); b = Math.min(255, b + 20)
    } else if (currentMonth >= 9 && currentMonth <= 11) {
      r = Math.min(255, r + 50); g = Math.min(255, g + 10); b = Math.max(0, b - 40)
    } else if (currentMonth === 12 || currentMonth <= 2) {
      const gray = (r + g + b) / 3
      r = Math.min(255, p5InstanceRef.current?.lerp(r, gray, 0.5) || r)
      g = Math.min(255, p5InstanceRef.current?.lerp(g, gray, 0.5) || g)
      b = Math.min(255, b + 40)
    }

    const blend = 0.3
    r = Math.min(255, Math.round(r + (255 - r) * blend))
    g = Math.min(255, Math.round(g + (255 - g) * blend))
    b = Math.min(255, Math.round(b + (255 - b) * blend))

    return { base: [r, g, b], edge: [Math.min(255, r + 50), Math.min(255, g + 50), Math.min(255, b + 50)] }
  }

  const getPostDate = (post) => {
    const raw = post?.publishDate || post?.date || post?.date?.start_date
    if (!raw) return null
    let dateObj = null
    if (typeof raw === 'string') {
      const trimmed = raw.split('T')[0]?.trim()
      if (trimmed) {
        const parts = trimmed.split('-')
        if (parts.length === 3) dateObj = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]))
        else dateObj = new Date(raw)
      }
    } else if (typeof raw === 'number') dateObj = new Date(raw)
    else dateObj = new Date(raw)
    if (dateObj && !isNaN(dateObj.getTime())) return dateObj
    return null
  }

  const getCumulativeData = (year, allPosts, currentMonth) => {
    const cumulative = allPosts.filter(p => {
      const d = getPostDate(p)
      return d && d.getFullYear() <= year
    })
    const stats = {}
    cumulative.forEach(p => {
      const cat = p.category || '未分类'
      stats[cat] = (stats[cat] || 0) + 1
    })
    const categories = Object.keys(stats).map(name => ({ name, count: stats[name], palette: getCategoryColor(name, currentMonth) }))
    return { posts: cumulative, totalCount: cumulative.length, categories }
  }

  useEffect(() => {
    dataRef.current = { posts, currentYear, weatherText, month }
    filterRef.current = onCategoryFilter
  })

  useEffect(() => {
    if (!containerRef.current || typeof window === 'undefined') return
    let isMounted = true

    if (p5InstanceRef.current) {
      try { p5InstanceRef.current.remove() } catch (e) { /* ignore */ }
      p5InstanceRef.current = null
    }
    const existingCanvas = containerRef.current.querySelector('canvas')
    if (existingCanvas) existingCanvas.remove()

    import('p5').then((p5Module) => {
      if (!isMounted) return
      const p5 = p5Module.default

      const sketch = (p) => {
        let growProgress = 0
        let hoveredCategory = null
        let timeScale = 0
        let categoryPlacements = []
        let groundPlants = []
        let lastDataSignature = ''
        let particles = []
        let clouds = [] // ☁️ 云朵粒子数组

        // ⚡ 雷电控制变量
        let lightningAlpha = 0
        let lightningPath = []

        // 🚀 性能优化：在顶层复用 Vector 向量与 Matrix 对象，避免 60fps 频发 GC
        let reusableVec = null
        let reusableDomPoint = null

        const flowerColors = [
          [255, 182, 193], [255, 218, 185], [253, 253, 150], [179, 219, 255], [214, 194, 255]
        ]

        // ============================
        // 🌧️ 全天气粒子配置解析器
        // ============================
        const getWeatherParticleConfig = (wText) => {
          const cfg = { 
            count: 0, speedMin: 0, speedMax: 0, sizeMin: 0, sizeMax: 0, 
            type: 'none', windEffect: 0.3, hasLightning: false 
          }
          if (!wText) return cfg

          // 1. 🧊 冰雹效果
          if (wText.includes('冰雹') || wText.includes('霰')) {
            cfg.type = 'hail'
            cfg.count = 80
            cfg.speedMin = 14
            cfg.speedMax = 22
            cfg.sizeMin = 3
            cfg.sizeMax = 6
            cfg.windEffect = 0.5
            return cfg
          }

          // 2. 🌧️❄️ 雨夹雪/冻雨
          if (wText.includes('雨夹雪') || wText.includes('冻雨')) {
            cfg.type = 'sleet'
            cfg.count = 120
            cfg.speedMin = 6
            cfg.speedMax = 14
            cfg.sizeMin = 2
            cfg.sizeMax = 5
            cfg.windEffect = 0.9
            return cfg
          }

          // 3. 🌫️ 雾/霾/沙尘/浮尘
          if (wText.includes('雾') || wText.includes('霾') || wText.includes('沙') || wText.includes('尘')) {
            cfg.type = 'fog'
            return cfg
          }

          // 4. ❄️ 纯雪系
          if (wText.includes('雪')) {
            cfg.type = 'snow'
            cfg.windEffect = 0.6
            if (wText.includes('暴雪') || wText.includes('大暴雪')) {
              cfg.count = 250; cfg.speedMin = 1; cfg.speedMax = 3; cfg.sizeMin = 4; cfg.sizeMax = 8
            } else if (wText.includes('大雪')) {
              cfg.count = 150; cfg.speedMin = 1.5; cfg.speedMax = 3; cfg.sizeMin = 3; cfg.sizeMax = 6
            } else if (wText.includes('中雪')) {
              cfg.count = 80; cfg.speedMin = 2; cfg.speedMax = 4; cfg.sizeMin = 2; cfg.sizeMax = 4
            } else {
              cfg.count = 40; cfg.speedMin = 1; cfg.speedMax = 2; cfg.sizeMin = 2; cfg.sizeMax = 3
            }
            return cfg
          }

          // 5. 🌧️ 纯雨/雷阵雨系
          if (wText.includes('雨') || wText.includes('雷') || wText.includes('阵雨')) {
            cfg.type = 'rain'
            cfg.windEffect = 1.2
            if (wText.includes('雷')) cfg.hasLightning = true

            if (wText.includes('暴雨') || wText.includes('特大暴雨')) {
              cfg.count = 350; cfg.speedMin = 14; cfg.speedMax = 24; cfg.sizeMin = 3; cfg.sizeMax = 6
            } else if (wText.includes('大雨')) {
              cfg.count = 200; cfg.speedMin = 11; cfg.speedMax = 16; cfg.sizeMin = 2.5; cfg.sizeMax = 5
            } else if (wText.includes('中雨')) {
              cfg.count = 120; cfg.speedMin = 8; cfg.speedMax = 12; cfg.sizeMin = 2; cfg.sizeMax = 4
            } else {
              cfg.count = 60; cfg.speedMin = 5; cfg.speedMax = 9; cfg.sizeMin = 2; cfg.sizeMax = 3
            }
            return cfg
          }

          // 6. ☁️ 阴天/多云/少云
          if (wText.includes('阴') || wText.includes('云')) {
            cfg.type = 'cloudy'
            return cfg
          }

          return cfg
        }

        p.setup = () => {
          const container = containerRef.current
          if (!container) return
          p.pixelDensity(window.devicePixelRatio || 1)
          const canvas = p.createCanvas(Math.max(container.getBoundingClientRect().width, 200), 480)
          canvas.parent(container)
          p.angleMode(p.DEGREES)
          p.textFont('PingFang SC', 11)
          p.textAlign(p.CENTER, p.CENTER)

          reusableVec = p.createVector(0, 0)
          if (typeof DOMPoint !== 'undefined') {
            reusableDomPoint = new DOMPoint(0, 0)
          }
        }

        p.resetGrowth = () => {
          growProgress = 0
          lastDataSignature = ''
          p.loop()
        }

        const safeMap = (value, start1, stop1, start2, stop2, withinBounds) => {
          if (start1 === stop1) return start2
          return p.map(value, start1, stop1, start2, stop2, withinBounds)
        }

        // ⚡ 生成闪电链路径
        const generateLightning = () => {
          lightningPath = []
          let curX = p.random(p.width * 0.2, p.width * 0.8)
          let curY = 0
          lightningPath.push({ x: curX, y: curY })

          while (curY < p.height * 0.75) {
            curX += p.random(-25, 25)
            curY += p.random(15, 35)
            lightningPath.push({ x: curX, y: curY })
          }
        }

        const drawThickBranch = (len, startW, endW) => {
          p.beginShape()
          for (let t = 0; t <= 20; t++) {
            let r = t / 20
            let x = r * len
            let y = p.bezierPoint(0, -4, -6, -3, r)
            let currentW = p.lerp(startW, endW, r)
            p.vertex(x, y - currentW / 2)
          }
          for (let t = 20; t >= 0; t--) {
            let r = t / 20
            let x = r * len
            let y = p.bezierPoint(0, -4, -6, -3, r)
            let currentW = p.lerp(startW, endW, r)
            p.vertex(x, y + currentW / 2)
          }
          p.endShape(p.CLOSE)
        }

        const drawLeaves = (leafCount, sizeScale, cat, curMonth, leafVisibility) => {
          if (leafVisibility <= 0 || leafCount <= 0) return
          for (let n = 0; n < leafCount; n++) {
            p.push()
            const angleLeaf = n * (360 / leafCount)
            const radius = safeMap(leafCount, 1, 5, 6, 12, false) * sizeScale
            p.translate(p.cos(angleLeaf) * radius, p.sin(angleLeaf) * radius * 0.75)
            p.rotate(angleLeaf + 15)
            p.noStroke()
            if (curMonth >= 3 && curMonth <= 5) {
              p.fill(255, 192, 203, 220 * leafVisibility)
              p.ellipse(0, 0, 9 * sizeScale, 9 * sizeScale)
              p.fill(255, 255, 255, 180 * leafVisibility)
              p.ellipse(-1.5, -1.5, 3.5, 3.5)
            } else if (curMonth === 12 || curMonth <= 2) {
              p.fill(160, 200, 230, 180 * leafVisibility)
              p.rect(-4, -4, 8 * sizeScale, 8 * sizeScale, 3)
              p.fill(210, 235, 255, 220 * leafVisibility)
              p.rect(-3, -3, 6 * sizeScale, 6 * sizeScale, 2)
              p.fill(240, 248, 255, 255 * leafVisibility)
              p.ellipse(0, 0, 4.5 * sizeScale, 4.5 * sizeScale)
            } else {
              p.fill(cat.palette.edge[0], cat.palette.edge[1], cat.palette.edge[2], 120 * leafVisibility)
              p.ellipse(0, 0, 11 * sizeScale, 6.5 * sizeScale)
              p.fill(cat.palette.base[0], cat.palette.base[1], cat.palette.base[2], 200 * leafVisibility)
              p.ellipse(0, 0, 8.5 * sizeScale, 4.5 * sizeScale)
            }
            p.pop()
          }
        }

        p.draw = () => {
          const { posts: allPosts, currentYear: year, weatherText: weather, month: curMonth } = dataRef.current

          let finalWeather = weather
          if (typeof window !== 'undefined' && window.__weatherInfo && window.__weatherInfo.text) {
            const globalText = window.__weatherInfo.text
            if (globalText && (globalText.includes('雨') || globalText.includes('雷') || globalText.includes('雪') || globalText.includes('雾') || globalText.includes('云'))) {
              if (weather === '晴' || weather === 'undefined' || !weather || weather === '加载中') {
                finalWeather = globalText
              }
            }
          }

          const weatherConfig = getWeatherParticleConfig(finalWeather)
          const isWindy = finalWeather.includes('风') || finalWeather.includes('吹')

          const baseWindSpeed = isWindy ? 1.2 : 0.4
          const noiseWind = (p.noise(timeScale * baseWindSpeed) - 0.45) * 2
          const windIntensity = isWindy ? 6.0 : (weatherConfig.type === 'rain' ? 1.5 : 1.2)
          const wind = noiseWind * windIntensity

          if (!allPosts || allPosts.length === 0) {
            p.clear(); p.push(); p.translate(p.width / 2, p.height / 2); p.fill(180, 180, 180, 120); p.textSize(14); p.text('🌱 等待种子萌芽…', 0, 0); p.pop(); return
          }

          if (growProgress < 1) {
            growProgress += (1 - growProgress) * 0.045 + 0.003
            if (growProgress > 0.999) growProgress = 1
          }
          const branchProgress = Math.max(0, Math.min(1, (growProgress - 0.2) / 0.6))
          const leafVisibility = Math.max(0, Math.min(1, (growProgress - 0.35) / 0.3))
          timeScale = p.millis() * 0.001

          p.clear()

          // ============================
          // 1. ⚡ 雷电背景高亮闪烁
          // ============================
          if (weatherConfig.hasLightning) {
            if (p.random(1) < 0.015 && lightningAlpha <= 0) {
              lightningAlpha = 220
              generateLightning()
            }
            if (lightningAlpha > 0) {
              p.push()
              p.noStroke()
              p.fill(220, 235, 255, lightningAlpha * 0.25)
              p.rect(0, 0, p.width, p.height)
              p.pop()
              lightningAlpha -= p.random(12, 25)

              if (lightningAlpha <= 0) {
                lightningAlpha = 0
                lightningPath = []
              }
            }
          }

          // ============================
          // 2. 绘制树体 (底层)
          // ============================
          const cumulative = getCumulativeData(year, allPosts, curMonth)
          const cats = cumulative.categories
          const totalArticles = cumulative.totalCount

          // 地面花草
          groundPlants.forEach(plant => {
            if (plant.scale < 1) plant.scale += (1 - plant.scale) * 0.08 + 0.01
            p.push()
            p.translate(plant.x, plant.y); p.scale(plant.scale); p.rotate(p.sin(timeScale * 25 + plant.x * 0.1) * 1.5)
            if (plant.type === 'grass') {
              p.noFill(); p.stroke(120, 180, 135, 220); p.strokeWeight(1.8)
              p.bezier(0, 0, -4, -10, -8, -18, -12, -22); p.bezier(0, 0, 2, -8, 6, -14, 10, -18)
            } else {
              p.noFill(); p.stroke(130, 175, 140); p.strokeWeight(1.5); p.line(0, 0, 0, -18); p.noStroke(); p.fill(130, 175, 140, 180); p.ellipse(-3, -8, 6, 3); p.translate(0, -18)
              p.fill(plant.color[0], plant.color[1], plant.color[2], 230)
              for (let j = 0; j < (plant.petals || 6); j++) { p.push(); p.rotate(j * (360 / (plant.petals || 6))); p.ellipse(0, -4, 5, 8); p.pop() }
              p.fill(250, 210, 100); p.ellipse(0, 0, 4, 4)
            }
            p.pop()
          })

          // 树干
          p.push()
          p.translate(p.width / 2, p.height - 25)
          p.stroke(215, 225, 215); p.strokeWeight(1.5); p.line(-200, 0, 200, 0)
          const baseWeight = safeMap(Math.min(totalArticles, 24), 2, 24, 6, 13, true)
          const targetTrunkLen = safeMap(Math.min(totalArticles, 24), 2, 24, 80, 135, true) * growProgress
          p.noFill(); p.stroke(70, 85, 75)

          if (!reusableVec) reusableVec = p.createVector(0, 0)
          else reusableVec.set(0, 0)

          let trunkHeading = -90
          if (weatherConfig.type === 'rain') trunkHeading += p.sin(timeScale * 10) * 0.5

          for (let s = 0; s < 15; s++) {
            const ratio = s / 15
            p.strokeWeight(p.lerp(baseWeight, baseWeight * 0.55, ratio))
            const segWind = wind * 0.04 * ratio
            trunkHeading += p.sin(ratio * 180) * 1.5 + segWind
            const segLen = targetTrunkLen / 15

            const nextX = reusableVec.x + p.cos(trunkHeading) * segLen
            const nextY = reusableVec.y + p.sin(trunkHeading) * segLen

            p.line(reusableVec.x, reusableVec.y, nextX, nextY)
            reusableVec.set(nextX, nextY)
          }
          p.translate(reusableVec.x, reusableVec.y)
          categoryPlacements = []; hoveredCategory = null

          // 分支与叶子
          if (branchProgress > 0.01 && cats.length) {
            const maxCatCount = Math.max(...cats.map(c => c.count), 1)
            for (let i = 0; i < cats.length; i++) {
              const cat = cats[i]
              p.push()
              p.translate(0, safeMap(i, 0, cats.length, -22, 12, false))
              const isLeft = i % 2 === 0
              const weatherDroop = (weatherConfig.type !== 'none') ? (isLeft ? 8 : -8) : 0
              const targetAngle = isLeft ? safeMap(i, 0, cats.length, -145, -95, false) : safeMap(i, 0, cats.length, -85, -35, false)
              p.rotate(targetAngle + wind * 0.65 + weatherDroop)

              const mainLen = safeMap(cat.count, 1, maxCatCount, 40, 75, true) * (isLeft ? 1.05 : 0.92) * branchProgress
              p.noStroke(); p.fill(75, 90, 80)
              drawThickBranch(mainLen, baseWeight * 0.38, baseWeight * 0.22)
              p.translate(mainLen, -4)

              const totalLeaves = Math.min(cat.count, 24)
              const sizeScale = 0.5 + 0.5 * leafVisibility
              const LEAVES_PER_FORK = 4
              if (totalLeaves <= LEAVES_PER_FORK) {
                drawLeaves(totalLeaves, sizeScale, cat, curMonth, leafVisibility)
              } else {
                let remainingLeaves = totalLeaves
                const leavesForA = Math.min(LEAVES_PER_FORK, remainingLeaves)
                remainingLeaves -= leavesForA
                p.push()
                p.rotate(isLeft ? -24 + wind * 0.4 : 24 + wind * 0.4)
                const subLenA = mainLen * 0.55
                p.fill(80, 95, 85); drawThickBranch(subLenA, baseWeight * 0.22, baseWeight * 0.1)
                p.translate(subLenA, -2)
                drawLeaves(leavesForA, sizeScale, cat, curMonth, leafVisibility)
                p.pop()

                if (remainingLeaves > 0) {
                  const leavesForB = Math.min(LEAVES_PER_FORK, remainingLeaves)
                  remainingLeaves -= leavesForB
                  p.push()
                  p.rotate(isLeft ? 22 - wind * 0.3 : -22 - wind * 0.3)
                  const subLenB = mainLen * 0.45
                  p.fill(80, 95, 85); drawThickBranch(subLenB, baseWeight * 0.20, baseWeight * 0.08)
                  p.translate(subLenB, -2)
                  drawLeaves(leavesForB, sizeScale, cat, curMonth, leafVisibility)
                  p.pop()
                }
                if (remainingLeaves > 0) drawLeaves(remainingLeaves, sizeScale * 0.9, cat, curMonth, leafVisibility)
              }

              // 标签
              p.push(); p.translate(-10, 26); p.rectMode(p.CENTER); p.noStroke()
              const labelAlpha = Math.min(1, branchProgress * 1.5)
              p.fill(255, 255, 255, 220 * labelAlpha)
              const txt = `${cat.name} (${cat.count})`, tw = p.textWidth(txt) + 14
              p.rect(0, 0, tw, 19, 6)
              p.fill(hoveredCategory === cat ? 40 : 100, 255 * labelAlpha); p.text(txt, 0, -1)
              p.pop()

              const transform = p.drawingContext.getTransform()
              let px = 0, py = 0
              if (reusableDomPoint) {
                reusableDomPoint.x = 0; reusableDomPoint.y = 0
                const pt = transform.transformPoint(reusableDomPoint)
                px = pt.x; py = pt.y
              } else {
                px = transform.e; py = transform.f
              }

              categoryPlacements.push({ name: cat.name, x: px, y: py })
              if (p.dist(p.mouseX, p.mouseY, px, py) < 42) hoveredCategory = cat

              p.pop()
            }
          }
          p.pop()

          // ============================
          // 3. 🌫️ 绘制雾天效果 (Fog Effect)
          // ============================
          if (weatherConfig.type === 'fog') {
            p.push()
            p.noStroke()
            for (let f = 0; f < 3; f++) {
              const fogY = p.height * (0.2 + f * 0.25)
              const fogAlpha = 60 + f * 20
              p.fill(235, 242, 245, fogAlpha)

              p.beginShape()
              p.vertex(0, p.height)
              for (let x = 0; x <= p.width; x += 30) {
                const n = p.noise(x * 0.005, timeScale * 0.15 + f * 10)
                const y = fogY + (n - 0.5) * 80
                p.vertex(x, y)
              }
              p.vertex(p.width, p.height)
              p.endShape(p.CLOSE)
            }
            p.pop()
          }

          // ============================
          // 4. ⚡ 绘制闪电链 (Lightning Bolt)
          // ============================
          if (lightningAlpha > 30 && lightningPath.length > 1) {
            p.push()
            p.noFill()
            p.stroke(200, 230, 255, lightningAlpha)
            p.strokeWeight(4)
            p.beginShape()
            for (let pt of lightningPath) p.vertex(pt.x, pt.y)
            p.endShape()

            p.stroke(255, 255, 255, lightningAlpha)
            p.strokeWeight(2)
            p.beginShape()
            for (let pt of lightningPath) p.vertex(pt.x, pt.y)
            p.endShape()
            p.pop()
          }

          // ============================
          // 5. ☁️ 绘制多云/少云/阴天云朵 (Clouds Effect)
          // ============================
          if (weatherConfig.type === 'cloudy') {
            const targetCloudCount = finalWeather.includes('少云') ? 2 : 4

            while (clouds.length < targetCloudCount) {
              clouds.push({
                x: p.random(-100, p.width),
                y: p.random(20, 100),
                scale: p.random(0.7, 1.2),
                speed: p.random(0.15, 0.4)
              })
            }

            p.push()
            p.noStroke()
            for (let i = 0; i < clouds.length; i++) {
              const c = clouds[i]
              c.x += c.speed + wind * 0.08

              if (c.x > p.width + 120) {
                c.x = -120
                c.y = p.random(20, 100)
              }

              p.push()
              p.translate(c.x, c.y)
              p.scale(c.scale)

              // 云朵阴影（在纯白背景下形成立体感与可见度）
              p.fill(210, 225, 240, 110)
              p.ellipse(0, 6, 70, 32)
              p.ellipse(-20, 9, 45, 28)
              p.ellipse(20, 9, 45, 28)

              // 云朵主体
              p.fill(245, 250, 255, 220)
              p.ellipse(0, 0, 65, 30)
              p.ellipse(-20, 3, 40, 24)
              p.ellipse(20, 3, 40, 24)
              p.ellipse(-10, -8, 32, 26)
              p.ellipse(10, -6, 28, 22)

              p.pop()
            }
            p.pop()
          }

          // ============================
          // 6. 🌧️/❄️/🧊 绘制天气降水粒子 (Rain / Snow / Hail / Sleet)
          // ============================
          if (weatherConfig.count > 0) {
            while (particles.length < weatherConfig.count) {
              particles.push({
                x: p.random(p.width),
                y: p.random(p.height),
                speed: p.random(weatherConfig.speedMin, weatherConfig.speedMax),
                size: p.random(weatherConfig.sizeMin, weatherConfig.sizeMax),
                isSnowPart: p.random(1) > 0.5 // 专门供雨夹雪使用的随机类型标记
              })
            }

            p.push()
            p.noStroke()
            for (let i = 0; i < weatherConfig.count; i++) {
              const pt = particles[i]
              pt.y += pt.speed
              pt.x += wind * weatherConfig.windEffect

              if (pt.y > p.height) {
                pt.y = -10
                pt.x = p.random(p.width)
                pt.speed = p.random(weatherConfig.speedMin, weatherConfig.speedMax)
                pt.size = p.random(weatherConfig.sizeMin, weatherConfig.sizeMax)
                pt.isSnowPart = p.random(1) > 0.5
              }
              if (pt.x > p.width) pt.x = 0
              if (pt.x < 0) pt.x = p.width

              if (weatherConfig.type === 'rain') {
                const alpha = p.map(pt.speed, 5, 24, 220, 255)
                const dropWidth = pt.size * 0.6
                const dropLen = pt.speed * 2
                p.fill(160, 210, 255, alpha)
                p.rect(pt.x, pt.y, dropWidth, dropLen, 3)
                p.fill(210, 230, 255, alpha * 0.8)
                p.ellipse(pt.x + dropWidth / 2, pt.y, dropWidth * 1.4, dropWidth * 1.4)
              } else if (weatherConfig.type === 'snow') {
                const glowSize = pt.size * 1.6
                p.fill(220, 235, 255, 120)
                p.ellipse(pt.x, pt.y, glowSize, glowSize)
                p.fill(255, 255, 255, 240)
                p.ellipse(pt.x, pt.y, pt.size, pt.size)
              } else if (weatherConfig.type === 'hail') {
                // 🧊 冰雹：硬质有反光的正方形/圆形冰晶
                p.fill(180, 220, 255, 200)
                p.rect(pt.x, pt.y, pt.size, pt.size, 1)
                p.fill(255, 255, 255, 240)
                p.rect(pt.x + 1, pt.y + 1, pt.size * 0.5, pt.size * 0.5, 1)
              } else if (weatherConfig.type === 'sleet') {
                // 🌧️❄️ 雨夹雪：交替渲染雨丝和小雪花
                if (pt.isSnowPart) {
                  p.fill(255, 255, 255, 220)
                  p.ellipse(pt.x, pt.y, pt.size, pt.size)
                } else {
                  p.fill(170, 215, 255, 200)
                  p.rect(pt.x, pt.y, 2, pt.speed * 1.2, 1)
                }
              }
            }
            p.pop()

            if (particles.length > weatherConfig.count + 50) {
              particles.splice(weatherConfig.count, particles.length - weatherConfig.count)
            }
          }

          // 鼠标交互手型
          p.cursor(categoryPlacements.some(plc => p.dist(p.mouseX, p.mouseY, plc.x, plc.y) < 42) || (p.mouseY > p.height - 45 && p.mouseY < p.height - 5 && Math.abs(p.mouseX - p.width / 2) < 200) ? p.HAND : p.ARROW)
        }

        p.mousePressed = () => {
          const { posts: allPosts } = dataRef.current
          if (!allPosts || allPosts.length === 0) return
          let clickedCategory = false
          for (const plc of categoryPlacements) {
            if (p.dist(p.mouseX, p.mouseY, plc.x, plc.y) < 42) {
              if (filterRef.current) filterRef.current(plc.name); clickedCategory = true; break
            }
          }
          if (!clickedCategory && p.mouseY > p.height - 45 && p.mouseY < p.height - 5 && Math.abs(p.mouseX - p.width / 2) < 200) {
            p.loop()
            groundPlants.push({ x: p.mouseX, y: p.height - 25, type: p.random(['flower', 'grass']), scale: 0, color: p.random(flowerColors), petals: p.floor(p.random(5, 8)) })
          }
        }

        p.windowResized = () => {
          const container = containerRef.current
          if (container) p.resizeCanvas(Math.max(container.getBoundingClientRect().width, 200), 480)
        }
      }

      const gardenP5Instance = new p5(sketch)
      p5InstanceRef.current = gardenP5Instance
    })

    return () => {
      isMounted = false
      if (p5InstanceRef.current) {
        try { p5InstanceRef.current.remove() } catch (e) { /* ignore */ }
        p5InstanceRef.current = null
      }
      const canvas = containerRef.current?.querySelector('canvas')
      if (canvas) canvas.remove()
    }
  }, [])

  useEffect(() => {
    if (p5InstanceRef.current && p5InstanceRef.current.resetGrowth) {
      const { posts: allPosts, currentYear: year } = dataRef.current
      if (!allPosts || allPosts.length === 0) return
      const currentSig = `${year}-${allPosts.length}-${allPosts.map(p => p.id || '').join(',')}`
      if (window.__lastTreeSignature !== currentSig) {
        window.__lastTreeSignature = currentSig
        p5InstanceRef.current.resetGrowth()
      }
    }
  }, [posts, currentYear])

  return (
    <div className="w-full relative">
      <div ref={containerRef} className="w-full h-[480px] flex items-center justify-center" style={{ minHeight: '480px' }} />
    </div>
  )
})

GardenTree.displayName = 'GardenTree'
export default GardenTree