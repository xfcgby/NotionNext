import { siteConfig } from '@/lib/config'
import CONFIG from '../config'

/**
 * 🌙 深色模式切换按钮（纯受控组件）
 * 状态由父组件 RightFloatArea 统一管理，不再自行操作 DOM 和 localStorage
 */
export default function ButtonDarkModeFloat({ isDark, onToggle }) {
  if (!siteConfig('GARDEN_WIDGET_DARK_MODE', true, CONFIG)) {
    return null
  }

  return (
    <div
      onClick={onToggle}
      className="justify-center items-center w-7 h-7 text-center transform hover:scale-105 duration-200 cursor-pointer"
      title={isDark ? '切换日间模式' : '切换夜间模式'}
    >
      <i
        id="darkModeButton"
        className={`${isDark ? 'fa-sun text-yellow-400' : 'fa-moon text-slate-300'} fas text-xs`}
      />
    </div>
  )
}
