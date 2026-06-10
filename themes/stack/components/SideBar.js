import LazyImage from '@/components/LazyImage'
import { siteConfig } from '@/lib/config'
import { useRouter } from 'next/router'
import MenuGroupCard from './MenuGroupCard'
import { MenuListSide } from './MenuListSide'
import Footer from '@/components/Footer' // 👈 自动引入 NotionNext 全局自带的页脚落款组件

/**
 * Stack 侧边栏卡片
 */
const SideBar = props => {
  const { siteInfo } = props
  const router = useRouter()
  return (
    <div id='side-bar' className="bg-white dark:bg-zinc-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-zinc-700/50 flex flex-col justify-between min-h-[calc(100vh-4rem)]">
      
      {/* 上半部分：头像 + 统计卡片 + 侧拉导航菜单 */}
      <div>
        <div className='w-full flex justify-center mb-4'>
          <div>
            <div
              onClick={() => {
                router.push('/')
              }}
              className='justify-center items-center flex hover:rotate-45 py-4 hover:scale-105 dark:text-gray-100 transform duration-200 cursor-pointer'>
              {/* 头像 */}
              <LazyImage
                src={siteInfo?.icon}
                className='rounded-full'
                width={80}
                alt={siteConfig('AUTHOR')}
              />
            </div>
            {/* 包含文章、分类、标签计数的总览卡片 */}
            <MenuGroupCard {...props} />
          </div>
        </div>

        {/* 侧拉抽屉的菜单项 */}
        <div className="stack-menu-wrapper mt-6">
          <MenuListSide {...props} />
        </div>
      </div>

      {/* 👇 下半部分：回归并优雅对齐你的版权落款 */}
      <div className='mt-8 pt-6 border-t border-gray-100 dark:border-zinc-700/50 text-xs text-gray-400 dark:text-zinc-500'>
        <Footer {...props} />
      </div>

    </div>
  )
}

export default SideBar