import LazyImage from '@/components/LazyImage'
import { siteConfig } from '@/lib/config'
import { useRouter } from 'next/router'
import MenuGroupCard from './MenuGroupCard'
import { MenuListSide } from './MenuListSide'
import Footer from './Footer'

/**
 * 🍃 极简呼吸感 Stack 侧边栏 (防报错全清空版)
 */
const SideBar = props => {
  const { siteInfo, notice } = props
  const router = useRouter()

  return (
    <div id='side-bar' className="bg-white dark:bg-zinc-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-zinc-700/50 flex flex-col justify-between min-h-[calc(100vh-4rem)] transition-all duration-300">
      
      <div>
        {/* 1. 头像与数据统计 */}
        <div className='w-full flex flex-col items-center mb-4'>
          <div
            onClick={() => router.push('/')}
            className='justify-center items-center flex hover:scale-105 transform duration-200 cursor-pointer py-4'
          >
            <LazyImage
              src={siteInfo?.icon}
              className='rounded-full'
              width={80}
              height={80}
              alt={siteConfig('AUTHOR')}
            />
          </div>
          <MenuGroupCard {...props} />
        </div>

        {/* 📢 2. 极简无背景公告（如果 Notion 后台配了公告就显示，没配就不占地方） */}
        {notice?.summary && (
          <div className="mt-4 px-2 text-center">
            <p className="text-xs text-gray-400 dark:text-zinc-500 leading-relaxed italic">
              "{notice.summary}"
            </p>
          </div>
        )}

        {/* 3. 导航菜单 */}
        <div className="stack-menu-wrapper mt-6">
          <MenuListSide {...props} />
        </div>
      </div>

      {/* 4. 页脚版权落款 */}
      <div className="mt-8 pt-4 border-t border-gray-100 dark:border-zinc-700/50 text-center text-xs">
        <Footer {...props} />
      </div>

    </div>
  )
}

export default SideBar