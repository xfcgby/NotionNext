import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import { saveDarkModeToLocalStorage } from '@/themes/theme'
import CONFIG from '../config'

/**
 * 🌙 深色模式切换按钮
 */
export default function ButtonDarkModeFloat() {
  const { isDarkMode, updateDarkMode } = useGlobal()

  // ✅ 修正：使用 GARDEN_ 前缀的配置项
  if (!siteConfig('GARDEN_WIDGET_DARK_MODE', true, CONFIG)) {
    return null
  }

  const handleChangeDarkMode = () => {
    const newStatus = !isDarkMode
    
    // 保存到本地存储
    saveDarkModeToLocalStorage(newStatus)
    
    // 更新全局状态（如果存在）
    if (typeof updateDarkMode === 'function') {
      updateDarkMode(newStatus)
    }
    
    // 切换 html 的 dark/light 类名
    const htmlElement = document.documentElement
    htmlElement.classList.remove(newStatus ? 'light' : 'dark')
    htmlElement.classList.add(newStatus ? 'dark' : 'light')
  }

  return (
    <div
      onClick={handleChangeDarkMode}
      className="justify-center items-center w-7 h-7 text-center transform hover:scale-105 duration-200 cursor-pointer"
      title={isDarkMode ? '切换日间模式' : '切换夜间模式'}
    >
      <i
        id="darkModeButton"
        className={`${isDarkMode ? 'fa-sun text-yellow-400' : 'fa-moon text-slate-300'} fas text-xs`}
      />
    </div>
  )
}