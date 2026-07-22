// components/Header.js
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Logo from './Logo'
import SideBarDrawer from './SideBarDrawer'
import MenuListSide from './MenuListSide'

const Header = props => {
  const { onWeatherChange } = props // 💡 解构获取天气变更回调
  const router = useRouter()
  const [isOpen, changeShow] = useState(false)
  const [time, setTime] = useState('')
  
  // 更加硬核的综合气象状态
  const [weather, setWeather] = useState({ 
    temp: '--', 
    text: '加载中', 
    icon: '🍃', 
    humidity: '', 
    tip: '正在查看晾晒指数...',
    alert: '',       // 气象预警（高温、强风、暴雪等）
    forecast: ''     // 未来几小时降水提醒
  })

  const toggleMenuOpen = () => {
    changeShow(!isOpen)
  }

  const toggleSideBarClose = () => {
    changeShow(false)
  }

  // 1. 实时时间
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date()
      setTime(now.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', hour12: false }))
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // 2. 超全面气象与未来逐时数据深度解析
  useEffect(() => {
    fetch('https://wttr.in/?format=j1')
      .then(res => res.json())
      .then(data => {
        const current = data.current_condition[0]
        const temp = parseInt(current.temp_C)
        const feelLike = current.FeelsLikeC
        const humidity = current.humidity
        const windSpeed = parseInt(current.windspeedKmph || '0')
        const desc = current.weatherDesc[0].value.toLowerCase()
        const weatherCode = parseInt(current.weatherCode || '113', 10)
        
        let icon = '🌤'
        let tip = '适合晒衣服'
        let text = current.lang_zh ? current.lang_zh[0].value : '晴'
        let alert = ''
        let forecast = ''

        // ==================== 🚨 1. 智能灾害/恶劣天气预警触发器 ====================
        if (windSpeed >= 40) {
          alert = `🚩 台风/强风预警：当前风速 ${windSpeed}km/h，请加固户外悬挂物！`
        } else if (temp >= 37) {
          alert = `🧡 高温红色预警：气温已高达 ${temp}°C，酷热难耐，严防中暑！`
        } else if (temp <= -10) {
          alert = `💙 严寒寒潮预警：气温已跌至 ${temp}°C，谨防冻伤及管道结冰！`
        } else if (desc.includes('thunder')) {
          alert = `⛈ 强对流天气预警：伴有雷电轰鸣，请注意防雷并迅速切断户外电源！`
        }

        // ==================== 🔮 2. 未来 3-6 小时短临降水/雪精准预测 ====================
        try {
          const hourlyForecasts = data.weather[0].hourly || []
          const currentHour = new Date().getHours()
          
          const upcoming = hourlyForecasts.filter(h => {
            const hHour = parseInt(h.time) / 100
            return hHour > currentHour
          }).slice(0, 2)
          
          for (let f of upcoming) {
            const fDesc = f.weatherDesc[0].value.toLowerCase()
            const timeStr = (parseInt(f.time) / 100).toString().padStart(2, '0') + ':00'
            const rainChance = parseInt(f.chanceofrain || '0')
            const snowChance = parseInt(f.chanceofsnow || '0')

            if (rainChance >= 40 || fDesc.includes('rain') || fDesc.includes('drizzle') || fDesc.includes('shower') || fDesc.includes('thunder')) {
              forecast = `⏳ 晾晒提醒：预计 ${timeStr} 前后有降雨风险(概率 ${rainChance}%)，请注意收衣。`
              break
            } else if (snowChance >= 40 || fDesc.includes('snow') || fDesc.includes('sleet')) {
              forecast = `⏳ 晾晒提醒：预计 ${timeStr} 左右可能转雪(概率 ${snowChance}%)。`
              break
            }
          }
        } catch (e) {
          console.error("未来预测解析失败", e)
        }

        // ==================== 🌤 3. 方案 A 精准判定当前天气与图标匹配 ====================
        // 判定当前是否正在下雨/雪（过滤掉 "vicinity" 或低概率预报）
        const isCurrentlyRaining = (
          (desc.includes('rain') || desc.includes('drizzle') || desc.includes('shower') || desc.includes('thunder')) &&
          !desc.includes('vicinity') // 排除仅周边有雨
        ) || [176, 263, 266, 293, 296, 299, 302, 305, 308, 353, 356, 359, 386, 389].includes(weatherCode)

        const isCurrentlySnowing = (desc.includes('snow') || desc.includes('sleet')) && !desc.includes('vicinity')

       // ==================== 🌤 3. 基础天气状态机 (图文统一) ====================
if (desc.includes('thunder')) {
  icon = '⛈'
  text = '雷阵雨' // 👈 增加 text 修正
  tip = '雷阵雨来袭！带闪电危险，快收衣服！'
} else if (desc.includes('heavy rain') || desc.includes('torrential')) {
  icon = '⛈'
  text = '暴雨' // 👈 增加 text 修正
  tip = '暴雨倾盆！快收衣服'
} else if (isCurrentlyRaining) {
  icon = '🌧'
  text = '有雨' // 👈 增加 text 修正
  tip = '有雨，衣服赶紧收进屋'
} else if (isCurrentlySnowing) {
  icon = '❄️'
  text = '下雪' // 👈 增加 text 修正
  tip = '下雪啦，防寒保暖'
} else if (desc.includes('fog') || desc.includes('mist') || desc.includes('haze')) {
  icon = '🌫'
  text = '大雾' // 👈 增加 text 修正
  tip = '大雾弥漫，别晒衣服啦'
} else if (desc.includes('partly cloudy') || desc.includes('partly_cloudy')) {
  // 🌤️ 重点：晴间多云 / 局部多云
  icon = '🌤'
  text = '晴间多云' // 👈 彻底治好“明明有云却显示晴”的错位！
  tip = parseInt(humidity) > 80 ? '阴冷潮湿，衣服很难干' : '阳光被遮挡，晾晒稍慢'
} else if (desc.includes('cloudy') || desc.includes('overcast')) {
  // ☁️ 阴天 / 多云
  icon = '☁️'
  text = '阴' // 👈 修正为阴
  tip = parseInt(humidity) > 80 ? '阴冷潮湿，衣服很难干' : '纯阴天，蒸发较慢'
} else {
  // ☀️ 纯粹的晴天
  icon = '☀️'
  text = '晴' // 👈 只有真·晴天时才显示“晴”
  const uv = parseInt(current.uvIndex || '0')
  if (uv >= 6) {
    tip = '紫外线强，黄金杀菌时机！'
  } else {
    tip = `阳光正好，体感 ${feelLike}°C`
  }
}

        setWeather({ temp: temp.toString(), text, icon, humidity, tip, alert, forecast })

        // 💡 实时天气回调传出（与 Header 保持高度一致）
        if (onWeatherChange) {
          onWeatherChange({ text, alert })
        }
      })
      .catch(() => {
        setWeather({ temp: '26', text: '晴', icon: '☀️', humidity: '50', tip: '阳光明媚，正适合晒衣服', alert: '', forecast: '' })
        if (onWeatherChange) {
          onWeatherChange({ text: '晴', alert: '' })
        }
      })
  }, [])

  useEffect(() => {
    router.events.on('routeChangeComplete', toggleSideBarClose)
    return () => {
      router.events.off('routeChangeComplete', toggleSideBarClose)
    }
  }, [router.events])

  return (
    <div id='top-nav' className='z-40 relative select-none'>
      <div
        id='sticky-nav'
        className='top-0 w-full z-20 transition-all duration-300 bg-white/70 dark:bg-zinc-950/75 backdrop-blur-md border-b border-slate-100/60 dark:border-zinc-900/40 fixed'
      >
        <div className='w-full max-w-[1400px] mx-auto flex justify-between items-center px-6 py-3.5'>
          {/* 左侧：Logo */}
          <Logo {...props} />

          {/* 右侧：专业晾晒级气象防御中心（大屏显示） */}
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
              {weather.alert ? (
                <span className="text-red-500 dark:text-red-400 font-bold animate-pulse">{weather.alert}</span>
              ) : weather.forecast ? (
                <span className="text-amber-600 dark:text-amber-400 font-medium">{weather.forecast}</span>
              ) : (
                <span className="text-slate-400 dark:text-zinc-500">({weather.text}) · {weather.tip}</span>
              )}
            </div>
          </div>

          {/* 右侧：仅移动端菜单开关 */}
          <button
            onClick={toggleMenuOpen}
            aria-label="Toggle Menu"
            className='w-9 h-9 justify-center items-center cursor-pointer flex lg:hidden rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors focus:outline-none'
          >
            {isOpen ? <span className="text-sm font-bold">✕</span> : <span className="text-base">🌿</span>}
          </button>
        </div>
      </div>

      {/* 侧边小叶子抽屉菜单 */}
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
              {weather.alert ? (
                <span className="text-red-500 font-medium animate-pulse">{weather.alert}</span>
              ) : weather.forecast ? (
                <span className="text-amber-600 font-medium">{weather.forecast}</span>
              ) : (
                weather.tip
              )}
            </p>
          </div>
        </div>
      </SideBarDrawer>
    </div>
  )
}

export default Header
