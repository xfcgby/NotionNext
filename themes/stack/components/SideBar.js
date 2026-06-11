import LazyImage from '@/components/LazyImage'
import { siteConfig } from '@/lib/config'
import { useRouter } from 'next/router'
import MenuGroupCard from './MenuGroupCard'
import { MenuListSide } from './MenuListSide'
import Footer from './Footer'

/**
 * 🍃 Stack 完美独立侧边栏
 */
const SideBar = props => {
  const { siteInfo, notice } = props
  const router = useRouter()

  const noticeText = notice?.summary || '欢迎来到我的数字化花园，这里记录技术、思绪与创作。'

  return (
    <div id='side-bar' className="bg-white dark:bg-[#26252c] rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-zinc-800 flex flex-col justify-between min-h-[calc(100vh-4rem)] transition-all duration-300 w-full">
      
      <div>
        {/* 1. 头像与数据统计 */}
        <div className='w-full flex flex-col items-center mb-4'>
          <div
            onClick={() => router.push('/')}
            className='justify-center items-center flex hover:scale-105 transform duration-200 cursor-pointer py-4'
          >
            <LazyImage
              src={siteInfo?.icon}
              className='rounded-full border border-gray-50 dark:border-zinc-700'
              width={80}
              height={80}
              alt={siteConfig('AUTHOR')}
            />
          </div>
          <MenuGroupCard {...props} />
        </div>

        {/* 📢 2. 公告栏卡片 */}
        <div className="mt-4 p-4 rounded-2xl bg-gradient-to-br from-purple-50/60 to-indigo-50/40 dark:from-zinc-800/60 dark:to-zinc-800/30 border border-purple-100/50 dark:border-zinc-700/30 transition-all">
          <div className="text-xs font-bold text-purple-600 dark:text-purple-400 flex items-center gap-2 mb-1.5">
            <i className="fas fa-bullhorn animate-pulse" />
            <span className="tracking-wider">公告栏</span>
          </div>
          <p className="text-[11px] text-gray-600 dark:text-gray-400 leading-relaxed">
            {noticeText}
          </p>
        </div>

        {/* 3. 纵向导航菜单挂载点 */}
        <div className="stack-menu-wrapper mt-6">
          <MenuListSide {...props} />
        </div>
      </div>

      {/* 4. 页脚 */}
      <div className="mt-8 pt-4 border-t border-gray-50 dark:border-zinc-800 text-center text-xs text-gray-400">
        <Footer {...props} />
      </div>

    </div>
  )
}

export default SideBar