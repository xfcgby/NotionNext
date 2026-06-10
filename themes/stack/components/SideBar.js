import LazyImage from '@/components/LazyImage'
import { siteConfig } from '@/lib/config'
import { useRouter } from 'next/router'
import MenuGroupCard from './MenuGroupCard'
import { MenuListSide } from './MenuListSide'

/**
 * Stack 风格专属：左侧悬浮固定侧边栏
 */
const SideBar = props => {
  const { siteInfo } = props
  const router = useRouter()

  return (
    // 💡 核心魔法：
    // 1. md:flex 在桌面端显示，hidden 在移动端隐藏（防止遮挡内容）。
    // 2. fixed left-4 top-4 bottom-4 让它牢牢固定在网页左侧。
    // 3. w-72 (288px) 保持优雅的窄边设计，bg-white / dark:bg-[#26252c] 完美配合 Stack 主题色。
    // 4. rounded-3xl (24px 圆角) 呈现出你想要的那种圆润的卡片感。
    <aside id='side-bar' className="w-72 h-[calc(100vh-2rem)] fixed left-4 top-4 bottom-4 bg-white dark:bg-[#26252c] rounded-3xl p-6 shadow-sm flex flex-col justify-between overflow-y-auto hidden md:flex border border-transparent dark:border-zinc-800 transition-all duration-300 z-30">
      
      {/* 上半部分：头像区域 + 菜单列表 */}
      <div className="w-full">
        {/* 头像容器：居中、支持点击回首页、自带炫酷旋转动效 */}
        <div className="flex flex-col items-center text-center mt-4 mb-6">
          <div
            onClick={() => {
              router.push('/')
            }}
            className='justify-center items-center flex hover:rotate-45 p-1 hover:scale-105 dark:text-gray-100 transform duration-200 cursor-pointer rounded-full border-4 border-gray-50 dark:border-zinc-700 shadow-inner'
          >
            <LazyImage
              src={siteInfo?.icon}
              className='rounded-full object-cover'
              width={88}
              height={88}
              alt={siteConfig('AUTHOR')}
            />
          </div>
          
          {/* 名字与简介（自动读取 Notion 配置） */}
          <h2 className="text-xl font-bold mt-4 text-gray-800 dark:text-gray-200">
            {siteConfig('AUTHOR') || '我的数字花园'}
          </h2>
          <p className="text-xs text-gray-400 mt-1 px-2 line-clamp-2">
            {siteConfig('BIO') || '记录成长与思考'}
          </p>
        </div>

        {/* 2. 原有的导航菜单列表（保留原有逻辑，零成本适配） */}
        <div className="stack-menu-wrapper mt-4 border-t border-gray-100 dark:border-zinc-800 pt-4">
          <MenuListSide {...props} />
        </div>
      </div>

      {/* 下半部分：原有的数据总览（如文章数、标签数卡片） */}
      <div className="mt-8 border-t border-gray-100 dark:border-zinc-800 pt-4">
        <MenuGroupCard {...props} />
      </div>

    </aside>
  )
}

export default SideBar