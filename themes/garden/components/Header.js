// components/Header.js
import { useRouter } from 'next/router'
import { useEffect, useState, useRef } from 'react'
import Logo from './Logo'
import SideBarDrawer from './SideBarDrawer'
import MenuListSide from './MenuListSide'

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
    fetch('https://wttr.in/?format=j1')
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then(data => {
        fetchAttempts.current = 0 // 重置重试计数
        const current = data.current_condition[0]
        if (!current) throw new Error('No current_condition')

        const temp = parseInt(current.temp_C)
        const feelLike = current.FeelsLikeC
        const humidity = current.humidity
        const windSpeed = parseInt(current.windspeedKmph || '0')
        // 从 weatherDesc 取描述（可能英文也可能中文）
        const descRaw = current.weatherDesc[0]?.value || ''
        const desc = descRaw.toLowerCase()
        const weatherCode = parseInt(current.weatherCode || '113', 10)

        console.log('🌤 [Header] 原始描述:', descRaw)
        console.log('🌤 [Header] 小写描述:', desc)

        let icon = '🌤'
        let tip = '适合晒衣服'
        let text = '晴'
        let alert = ''
        let forecast = ''

        // ===== 灾害预警 =====
        if (windSpeed >= 40) {
          alert = `🚩 台风/强风预警：当前风速 ${windSpeed}km/h`
        } else if (temp >= 37) {
          alert = `🧡 高温红色预警：气温 ${temp}°C`
        } else if (temp <= -10) {
          alert = `💙 严寒寒潮预警：气温 ${temp}°C`
        } else if (desc.includes('thunder')) {
          alert = `⛈ 强对流天气预警（雷电）`
        }

        // ===== 未来短临预测（略） =====
        try {
          const hourly = data.weather[0]?.hourly || []
          const currentHour = new Date().getHours()
          const upcoming = hourly.filter(h => parseInt(h.time) / 100 > currentHour).slice(0, 2)
          for (let f of upcoming) {
            const fDesc = f.weatherDesc[0]?.value?.toLowerCase() || ''
            const timeStr = (parseInt(f.time) / 100).toString().padStart(2, '0') + ':00'
            const rainChance = parseInt(f.chanceofrain || '0')
            const snowChance = parseInt(f.chanceofsnow || '0')
            if (rainChance >= 40 || fDesc.includes('rain') || fDesc.includes('drizzle') || fDesc.includes('shower') || fDesc.includes('thunder')) {
              forecast = `⏳ ${timeStr} 降雨概率 ${rainChance}%`
              break
            } else if (snowChance >= 40 || fDesc.includes('snow') || fDesc.includes('sleet')) {
              forecast = `⏳ ${timeStr} 降雪概率 ${snowChance}%`
              break
            }
          }
        } catch (e) { /* ignore */ }

        // ===== 当前天气状态机（严格匹配） =====
        const isRain = (
          desc.includes('rain') ||
          desc.includes('drizzle') ||
          desc.includes('shower') ||
          desc.includes('thunder')
        ) && !desc.includes('vicinity')

        const isSnow = (desc.includes('snow') || desc.includes('sleet')) && !desc.includes('vicinity')

        // 用 weatherCode 辅助判断（部分天气代码）
        const rainCodes = [176, 263, 266, 293, 296, 299, 302, 305, 308, 353, 356, 359, 386, 389]
        const isRainByCode = rainCodes.includes(weatherCode)

        if (desc.includes('thunder')) {
          icon = '⛈'; text = '雷阵雨'; tip = '雷阵雨来袭！带闪电危险，快收衣服'
        } else if (desc.includes('heavy rain') || desc.includes('torrential')) {
          icon = '⛈'; text = '暴雨'; tip = '暴雨倾盆！快收衣服'
        } else if (isRain || isRainByCode) {
          icon = '🌧'; text = '有雨'; tip = '有雨，衣服赶紧收进屋'
        } else if (isSnow) {
          icon = '❄️'; text = '下雪'; tip = '下雪啦，防寒保暖'
        } else if (desc.includes('fog') || desc.includes('mist') || desc.includes('haze')) {
          icon = '🌫'; text = '大雾'; tip = '大雾弥漫，别晒衣服啦'
        } else if (desc.includes('partly cloudy') || desc.includes('partly_cloudy')) {
          icon = '🌤'; text = '晴间多云'; tip = humidity > 80 ? '阴冷潮湿，衣服很难干' : '阳光被遮挡，晾晒稍慢'
        } else if (desc.includes('cloudy') || desc.includes('overcast')) {
          icon = '☁️'; text = '阴'; tip = humidity > 80 ? '阴冷潮湿，衣服很难干' : '纯阴天，蒸发较慢'
        } else {
          icon = '☀️'; text = '晴'; tip = `阳光正好，体感 ${feelLike}°C`
        }

        // 🔥 关键日志
        console.log('✅ [Header] 最终 text:', text, ' desc:', desc)

        setWeather({
          temp: temp.toString(),
          text,
          icon,
          humidity,
          tip,
          alert,
          forecast,
          error: false
        })

        // 向上传递（包含 tip）
        if (onWeatherChange) {
          onWeatherChange({ text, alert, tip })
        }
      })
      .catch(err => {
        console.error('❌ [Header] 天气获取失败:', err)
        // 重试最多2次
        if (fetchAttempts.current < 2) {
          fetchAttempts.current += 1
          setTimeout(fetchWeather, 2000)
          return
        }
        // 降级：使用一个模拟雨天用于测试（如果当前时间在白天且湿度大，模拟雨）
        // 仅供演示：您可以注释掉以下模拟代码，保持默认晴
        const now = new Date()
        const hour = now.getHours()
        // 如果当前是白天且湿度（从navigator无法获取，随机模拟）
        // 为了测试，我们强制设为雨（可取消注释）
        // const testRain = true; // 打开此开关强制雨
        // if (testRain) {
        //   setWeather({ temp: '21', text: '暴雨', icon: '⛈', humidity: '100', tip: '测试暴雨', alert: '模拟暴雨', forecast: '', error: true })
        //   if (onWeatherChange) onWeatherChange({ text: '暴雨', alert: '模拟暴雨', tip: '测试暴雨' })
        //   return
        // }

        // 否则默认晴
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
          onWeatherChange({ text: '晴', alert: '', tip: '默认晴' })
        }
      })
  }

  useEffect(() => {
    fetchWeather()
    // 每30分钟刷新一次
    const interval = setInterval(fetchWeather, 30 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  // 路由切换关闭侧栏
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
