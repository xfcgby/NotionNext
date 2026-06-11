import LazyImage from '@/components/LazyImage'
import { siteConfig } from '@/lib/config'
import { useRouter } from 'next/router'
import MenuGroupCard from './MenuGroupCard'
import { MenuListSide } from './MenuListSide'
import Footer from './Footer'

/**
 * 🍃 Stack 主题专属高级侧边栏（智能拦截 Notion Notice 属性版）
 */
const SideBar = props => {
  // 👈 顺藤摸瓜：从 props 中同时拿出 allPosts 数据源
  const { siteInfo, notice, allPosts, posts } = props
  const router = useRouter()

  // 🧩 核心黑科技：如果核心的分发接口中没有拿到 notice，我们直接去全量数据里搜寻 type === 'Notice' 且已经发布的记录
  const allAvailableData = allPosts || posts || []
  const runtimeNoticeItem = allAvailableData.find(
    post => post?.type?.[0] === 'Notice' && post?.status?.[0] === 'Published'
  )

  // 💡 双向抓取：优先读系统变量，其次读我们刚刚智能过滤出来的 Notion 属性项，最后才是兜底
  const notionNoticeSummary = runtimeNoticeItem?.summary || runtimeNoticeItem?.title
  const noticeText = notice?.summary || notionNoticeSummary || '欢迎来到我的数字化花园，这里记录技术、思绪与创作。'

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

        {/* 📢 2. 公告栏：完美展现 Notion 后台数据 */}
        <div className="mt-4 p-4 rounded-2xl bg-gradient-to-br from-purple-50/60 to-indigo-50/40 dark:from-zinc-800/60 dark:to-zinc-800/30 border border-purple-100/50 dark:border-zinc-700/30 transition-all">
          <div className="text-xs font-bold text-purple-600 dark:text-purple-400 flex items-center gap-2 mb-1.5">
            <i className="fas fa-bullhorn animate-pulse" />
            <span className="tracking-wider">公告栏</span>
          </div>
          <p className="text-[11px] text-gray-600 dark:text-gray-400 leading-relaxed">
            {noticeText}
          </p>
        </div>

        {/* 3. 纵向干净导航菜单 */}
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