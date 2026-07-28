// components/Header.js
import { useRouter } from 'next/router'
import { useEffect, useState, useRef } from 'react'
import Logo from './Logo'
import SideBarDrawer from './SideBarDrawer'
import MenuListSide from './MenuListSide'

// ============================
// 🌦️ 天气归一化引擎（兼容 wttr 简体中文 + 英文）
// 将 wttr.in 返回的原始描述 → GardenTree 标准粒子关键词
// ============================

/**
 * 核心归一化函数：只负责生成 GardenTree 粒子系统能识别的标准关键词
 * 注意优先级：雷暴/极端 > 冰雹/霰/混合降水 > 雨雪强度 > 沙尘雾霾 > 云晴
 */
const normalizeWeather = (rawText, weatherCode = '113') => {
  const t = (rawText || '').toLowerCase()

  // === 1. 📢 雷暴类（最高优先级！防止被后续的"雨"或"零星"提前截断）===
  if (t.includes('雷') || t.includes('thunder')) return '雷阵雨'

  // === 2. 冰雹 / 冰粒 / 霰 / 米雪 ===
  if (t.includes('冰粒') || t.includes('冰丸') || t.includes('冰雹') || t.includes('霰') || t.includes('米雪') || t.includes('ice pellet') || t.includes('hail')) return '冰粒'

  // === 3. 混合降水 ===
  if (t.includes('雨夹雪') || t.includes('sleet')) return '雨夹雪'
  if (t.includes('冻雨') || t.includes('冻毛毛雨') || t.includes('freezing rain') || t.includes('freezing drizzle')) return '冻雨'

  // === 4. 雨 —— 暴雨/大雨级别（GardenTree: 200~350 particles）===
  if (t.includes('特大暴雨') || t.includes('暴阵雨') || t.includes('torrential')) return '特大暴雨'
  if (t.includes('大暴雨')) return '大暴雨'
  if (t.includes('暴雨') || t.includes('heavy rain')) return '暴雨'
  if (t.includes('大雨') || t.includes('大阵雨') || t.includes('强阵雨') || t.includes('强毛毛雨')) return '大雨'

  // === 5. 雨 —— 中雨级别（GardenTree: 120 particles）===
  if (t.includes('中雨') || t.includes('中阵雨') || t.includes('moderate rain') || t.includes('moderate shower')) return '中雨'

  // === 6. 雨 —— 小雨级别（GardenTree: 60 particles，精确区分"零星雨"与"零星雪"）===
  if (t.includes('小雨') || t.includes('小阵雨') || t.includes('light rain') || t.includes('light shower')) return '小雨'
  if (t.includes('毛毛雨') || t.includes('drizzle')) return '小雨'
  if (t.includes('阵雨') || t.includes('shower')) return '阵雨'
  if (t.includes('雨') || t.includes('rain')) return '有雨'

  // === 7. 雪 —— 暴雪级别（GardenTree: 250 particles）===
  if (t.includes('暴雪') || t.includes('强高吹雪') || t.includes('blizzard')) return '暴雪'

  // === 8. 雪 —— 大/中/小雪级别 ===
  if (t.includes('大雪') || t.includes('大阵雪') || t.includes('heavy snow') || t.includes('heavy snow shower')) return '大雪'
  if (t.includes('中雪') || t.includes('中阵雪') || t.includes('moderate snow') || t.includes('moderate snow shower')) return '中雪'
  if (t.includes('小雪') || t.includes('小阵雪') || t.includes('低吹雪') || t.includes('吹雪') || t.includes('light snow') || t.includes('light snow shower')) return '小雪'
  if (t.includes('阵雪') || t.includes('snow shower')) return '阵雪'
  if (t.includes('雪') || t.includes('snow')) return '有雪'

  // === 9. 雾/霾/沙尘/极端天气（统一归一化为低能见度粒子视效）===
  if (t.includes('沙') || t.includes('尘') || t.includes('sand') || t.includes('dust') || t.includes('烟') || t.includes('火山灰')) return '大雾'
  if (t.includes('雾') || t.includes('霾') || t.includes('fog') || t.includes('mist') || t.includes('haze')) return '大雾'

  // === 10. 云和阴 —— 必须分开！按精确度递减 ===
  if (t.includes('晴间多云') || t.includes('少云') || t.includes('partly cloudy')) return '晴间多云'
  if (t.includes('多云') || t.includes('cloudy')) return '多云'
  if (t.includes('阴') || t.includes('overcast')) return '阴'

  // === 11. 晴 ===
  if (t.includes('晴') || t.includes('sunny') || t.includes('clear')) return '晴'

  // === 12. 兜底：用 weatherCode ===
  const codeMap = {
    '113': '晴', '116': '晴间多云', '119': '多云', '122': '阴',
    '143': '大雾', '176': '小雨', '179': '小雪', '182': '雨夹雪',
    '185': '冻雨', '200': '雷阵雨', '227': '小雪', '230': '暴雪',
    '248': '大雾', '260': '大雾', '263': '小雨', '266': '小雨',
    '281': '冻雨', '284': '冻雨', '293': '小雨', '296': '小雨',
    '299': '中雨', '302': '中雨', '305': '大雨', '308': '大雨',
    '311': '冻雨', '314': '冻雨', '317': '雨夹雪', '320': '雨夹雪',
    '323': '小雪', '326': '小雪', '329': '中雪', '332': '中雪',
    '335': '大雪', '338': '大雪', '350': '冰粒', '353': '阵雨',
    '356': '大雨', '359': '特大暴雨', '362': '雨夹雪', '365': '雨夹雪',
    '368': '阵雪', '371': '大雪', '374': '冰粒', '377': '冰粒',
    '386': '雷阵雨', '389': '雷阵雨', '392': '雷阵雨', '395': '雷阵雨'
  }
  return codeMap[String(weatherCode)] || '晴'
}

/**
 * 图标映射（基于归一化后的粒子关键词）
 */
const getWeatherIcon = (particleText) => {
  const map = {
    '晴': '☀️', '晴间多云': '🌤', '多云': '⛅', '阴': '☁️',
    '大雾': '🌫',
    '小雨': '🌧', '中雨': '🌧', '大雨': '🌧',
    '暴雨': '⛈', '大暴雨': '⛈', '特大暴雨': '⛈', '阵雨': '🌦',
    '有雨': '🌧', '雷阵雨': '⛈',
    '小雪': '❄️', '中雪': '❄️', '大雪': '❄️',
    '暴雪': '❄️', '阵雪': '🌨', '有雪': '❄️',
    '雨夹雪': '🌨', '冻雨': '🌨', '冰粒': '🌨'
  }
  return map[particleText] || '🍃'
}

/**
 * 晾晒提示语（基于归一化后的粒子关键词）
 */
const getWeatherTip = (particleText, humidity, feelLike) => {
  const tips = {
    '晴': `阳光正好，体感 ${feelLike}°C`,
    '晴间多云': humidity > 80 ? '阴冷潮湿，衣服很难干' : '阳光被遮挡，晾晒稍慢',
    '多云': '云量较多',
    '阴': humidity > 80 ? '阴冷潮湿，衣服很难干' : '纯阴天，蒸发较慢',
    '大雾': '大雾/恶劣天气，别晒衣服啦',
    '小雨': '小雨，记得带伞',
    '中雨': '中雨，路面湿滑',
    '大雨': '大雨，注意避雨',
    '暴雨': '暴雨倾盆，减少外出',
    '大暴雨': '大暴雨，注意安全',
    '特大暴雨': '特大暴雨，注意安全',
    '阵雨': '阵雨来袭，快收衣服',
    '有雨': '有雨，衣服赶紧收进屋',
    '雷阵雨': '雷阵雨来袭！带闪电危险，快收衣服',
    '小雪': '小雪，防寒保暖',
    '中雪': '中雪，注意出行',
    '大雪': '大雪，减少外出',
    '暴雪': '暴雪，注意安全',
    '阵雪': '阵雪',
    '有雪': '有雪，防寒保暖',
    '冻雨': '冻雨，路面结冰严重',
    '雨夹雪': '雨夹雪，防寒保暖',
    '冰粒': '冰粒，注意防滑'
  }
  return tips[particleText] || '天气不错'
}

const Header = props => {
  const { onWeatherChange } = props
  const router = useRouter()
  const [isOpen, changeShow] = useState(false)
  const [time, setTime] = useState('')
  const fetchAttempts = useRef(0)

  const [weather, setWeather] = useState({
    temp: '--',
    text: '加载中',
    icon: '🍃',
    humidity: '',
    tip: '正在查看晾晒指数...',
    alert: '',
    forecast: '',
    error: false
  })

  const toggleMenuOpen = () => changeShow(!isOpen)
  const toggleSideBarClose = () => changeShow(false)

  // 实时时钟
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date()
      setTime(now.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', hour12: false }))
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // 天气获取（带重试）
  const fetchWeather = () => {
    fetch('https://wttr.in/?format=j1&lang=zh-cn')
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then(data => {
        fetchAttempts.current = 0
        const current = data.current_condition[0]
        if (!current) throw new Error('No current_condition')

        const temp = parseInt(current.temp_C)
        const feelLike = current.FeelsLikeC
        const humidity = current.humidity
        const windSpeed = parseInt(current.windspeedKmph || '0')
        const precipMM = parseFloat(current.precipMM || '0')

        // 🆕 分离：原始描述（给用户 UI 看） vs 归一化关键词（给 GardenTree 粒子）
        const descZh = current['lang_zh-cn']?.[0]?.value || ''
        const descEn = current.weatherDesc?.[0]?.value || ''
        const rawText = descZh || descEn
        const weatherCode = parseInt(current.weatherCode || '113', 10)

        console.log('🌤 [Header] 原始描述:', rawText, '| Code:', weatherCode)

        // ===== 1. 归一化 → GardenTree 粒子关键词 =====
        let particleText = normalizeWeather(rawText, weatherCode)
        const icon = getWeatherIcon(particleText)
        let tip = getWeatherTip(particleText, humidity, feelLike)

        // ===== 2. 风力增强标记（给粒子系统识别）=====
        let displayText = rawText
        if (windSpeed >= 28 && !particleText.includes('风') && !particleText.includes('吹')) {
          particleText = `${particleText}伴大风`
        }

        // ===== 3. 灾害预警 =====
        let alert = ''
        if (windSpeed >= 40) {
          alert = `🚩 台风/强风预警：当前风速 ${windSpeed}km/h`
        } else if (temp >= 37) {
          alert = `🧡 高温红色预警：气温 ${temp}°C`
        } else if (temp <= -10) {
          alert = `💙 严寒寒潮预警：气温 ${temp}°C`
        } else if (descEn.toLowerCase().includes('thunder')) {
          alert = `⛈ 强对流天气预警（雷电）`
        } else if (precipMM >= 20) {
          alert = `🌧 强降水预警：降水量 ${precipMM}mm`
        }

        // ===== 4. 未来短临预测 =====
        let forecast = ''
        try {
          const hourly = data.weather[0]?.hourly || []
          const currentHour = new Date().getHours()
          const upcoming = hourly.filter(h => parseInt(h.time) / 100 > currentHour).slice(0, 2)
          for (let f of upcoming) {
            const fDesc = f.weatherDesc?.[0]?.value || ''
            const fDescZh = f['lang_zh-cn']?.[0]?.value || ''
            const fText = fDescZh || fDesc
            const timeStr = (parseInt(f.time) / 100).toString().padStart(2, '0') + ':00'
            const rainChance = parseInt(f.chanceofrain || '0')
            const snowChance = parseInt(f.chanceofsnow || '0')
            const thunderChance = parseInt(f.chanceofthunder || '0')

            if (thunderChance >= 40 || fText.includes('雷') || fDesc.toLowerCase().includes('thunder')) {
              forecast = `⏳ ${timeStr} 雷电概率 ${thunderChance}%`
              break
            } else if (rainChance >= 40 || fText.includes('雨') || fDesc.toLowerCase().includes('rain') || fDesc.toLowerCase().includes('drizzle') || fDesc.toLowerCase().includes('shower')) {
              forecast = `⏳ ${timeStr} 降雨概率 ${rainChance}%`
              break
            } else if (snowChance >= 40 || fText.includes('雪') || fDesc.toLowerCase().includes('snow') || fDesc.toLowerCase().includes('sleet')) {
              forecast = `⏳ ${timeStr} 降雪概率 ${snowChance}%`
              break
            }
          }
        } catch (e) { /* ignore */ }

        console.log('✅ [Header] 显示文字:', displayText, '| 粒子关键词:', particleText)

        setWeather({
          temp: temp.toString(),
          text: displayText,
          icon,
          humidity,
          tip,
          alert,
          forecast,
          error: false
        })

        // 🆕 分离传递：displayText 给 Header UI，text (particleText) 给 GardenTree 粒子
        if (onWeatherChange) {
          onWeatherChange({ text: particleText, displayText, alert, tip })
        }
      })
      .catch(err => {
        console.error('❌ [Header] 天气获取失败:', err)
        if (fetchAttempts.current < 2) {
          fetchAttempts.current += 1
          setTimeout(fetchWeather, 2000)
          return
        }

        setWeather({
          temp: '26',
          text: '晴',
          icon: '☀️',
          humidity: '50',
          tip: '无法获取天气，使用默认晴 (检查网络)',
          alert: '',
          forecast: '',
          error: true
        })
        if (onWeatherChange) {
          onWeatherChange({ text: '晴', displayText: '晴', alert: '', tip: '默认晴' })
        }
      })
  }

  useEffect(() => {
    fetchWeather()
    const interval = setInterval(fetchWeather, 30 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    router.events.on('routeChangeComplete', toggleSideBarClose)
    return () => router.events.off('routeChangeComplete', toggleSideBarClose)
  }, [router.events])

  return (
    <div id='top-nav' className='z-40 relative select-none'>
      <div
        id='sticky-nav'
        className='top-0 w-full z-20 transition-all duration-300 bg-white/70 dark:bg-zinc-950/75 backdrop-blur-md border-b border-slate-100/60 dark:border-zinc-900/40 fixed'
      >
        <div className='w-full max-w-[1400px] mx-auto flex justify-between items-center px-6 py-3.5'>
          <Logo {...props} />

          {/* 桌面端天气显示 */}
          <div className="hidden lg:flex items-center space-x-3 bg-emerald-50/60 dark:bg-zinc-900/40 backdrop-blur-sm px-3.5 py-1.5 rounded-full border border-emerald-100/70 dark:border-zinc-800/50 text-sm text-slate-700 dark:text-zinc-300 shadow-sm transition-all max-w-xl xl:max-w-2xl overflow-hidden">
            <span className="font-mono font-medium flex-shrink-0">{time || '00:00'}</span>
            <span className="text-emerald-200 dark:text-zinc-700 flex-shrink-0">|</span>
            <div className="flex items-center space-x-1.5 flex-shrink-0">
              <span>{weather.icon}</span>
              <span className="font-semibold">{weather.temp}°C</span>
              {weather.humidity && (
                <span className="text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-100/40 dark:bg-emerald-950/30 px-1.5 py-0.5 rounded font-mono">
                  💧湿度{weather.humidity}%
                </span>
              )}
            </div>
            <span className="text-slate-200 dark:text-zinc-800 flex-shrink-0">|</span>
            <div className="text-xs font-normal truncate transition-all duration-300">
              {weather.error ? (
                <span className="text-red-400">⚠️ 天气加载失败，使用默认</span>
              ) : weather.alert ? (
                <span className="text-red-500 dark:text-red-400 font-bold animate-pulse">{weather.alert}</span>
              ) : weather.forecast ? (
                <span className="text-amber-600 dark:text-amber-400 font-medium">{weather.forecast}</span>
              ) : (
                <span className="text-slate-400 dark:text-zinc-500">({weather.text}) · {weather.tip}</span>
              )}
            </div>
          </div>

          <button
            onClick={toggleMenuOpen}
            aria-label="Toggle Menu"
            className='w-9 h-9 justify-center items-center cursor-pointer flex lg:hidden rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors focus:outline-none'
          >
            {isOpen ? <span className="text-sm font-bold">✕</span> : <span className="text-base">🌿</span>}
          </button>
        </div>
      </div>

      <SideBarDrawer isOpen={isOpen} onClose={toggleSideBarClose}>
        <div className="pt-8 px-4 flex flex-col h-[calc(100vh-4rem)] justify-between">
          <div className="space-y-6">
            <MenuListSide {...props} isMobile={true} />
          </div>
          <div className="mb-6 p-4 rounded-2xl bg-slate-50 dark:bg-zinc-900/60 border border-slate-100 dark:border-zinc-800/60">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2 text-sm font-semibold text-slate-800 dark:text-zinc-200">
                <span>{weather.icon}</span>
                <span>{weather.text}</span>
                <span>{weather.temp}°C</span>
              </div>
              {weather.humidity && (
                <span className="text-xs text-slate-500 dark:text-zinc-400 font-mono">💧 湿度 {weather.humidity}%</span>
              )}
            </div>
            <p className="text-xs text-slate-400 dark:text-zinc-500 leading-relaxed">
              {weather.error ? '⚠️ 天气获取失败，使用默认值' :
                weather.alert ? weather.alert :
                weather.forecast ? weather.forecast :
                weather.tip}
            </p>
          </div>
        </div>
      </SideBarDrawer>
    </div>
  )
}

export default Header