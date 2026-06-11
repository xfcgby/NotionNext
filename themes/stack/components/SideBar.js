import LazyImage from '@/components/LazyImage'
import { siteConfig } from '@/lib/config'
import { useRouter } from 'next/router'
import MenuGroupCard from './MenuGroupCard'
import { MenuListSide } from './MenuListSide'
import Footer from './Footer'

/**
 * 🍃 Stack 主题终极物理侧边栏（数据自给自足 + 全局防御 + 精准公告版）
 */
const SideBar = props => {
  const { siteInfo, notice, allPosts, posts } = props
  const router = useRouter()

  // 🧩 1. 公告栏数据智能拦截（大小写不敏感）
  const allAvailableData = allPosts || posts || []
  const runtimeNoticeItem = Array.isArray(allAvailableData) 
    ? allAvailableData.find(post => {
        const typeStr = Array.isArray(post?.type) ? post.type[0] : post?.type
        const statusStr = Array.isArray(post?.status) ? post.status[0] : post?.status
        return typeStr?.toLowerCase() === 'notice' && statusStr?.toLowerCase() === 'published'
      })
    : null

  const notionNoticeSummary = runtimeNoticeItem?.summary || runtimeNoticeItem?.title
  const noticeText = notice?.summary || notionNoticeSummary || '欢迎来到我的数字化花园，这里记录技术、思绪与创作。'

  // 📊 2. 核心黑科技：在组件内部直接为 MenuGroupCard 实时计算和组装数据统计
  // 过滤出所有真正的文章（Type 为 Post 且已发布）
  const validPosts = Array.isArray(allAvailableData)
    ? allAvailableData.filter(post => {
        const typeStr = Array.isArray(post?.type) ? post.type[0] : post?.type
        const statusStr = Array.isArray(post?.status) ? post.status[0] : post?.status
        return typeStr?.toLowerCase() === 'post' && statusStr?.toLowerCase() === 'published'
      })
    : []

  // 实时去重计算分类（Category）数量
  const categories = new Set()
  validPosts.forEach(post => {
    if (post?.category) {
      if (Array.isArray(post.category)) {
        post.category.forEach(c => categories.add(c))
      } else {
        categories.add(post.category)
      }
    }
  })

  // 实时去重计算标签（Tag）数量
  const tags = new Set()
  validPosts.forEach(post => {
    if (post?.tags) {
      if (Array.isArray(post.tags)) {
        post.tags.forEach(t => tags.add(t))
      } else {
        tags.add(post.tags)
      }
    }
  })

  // 🛠️ 重新组装一个绝对不会断流、饱满的 props 传给原版的统计卡片
  const patchedProps = {
    ...props,
    postCount: validPosts.length,
    categoryOptions: Array.from(categories).map(name => ({ name })),
    tagOptions: Array.from(tags).map(name => ({ name }))
  }

  return (
    <div id='side-bar' className="bg-white dark:bg-[#26252c] rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-zinc-800 flex flex-col justify-between min-h-[calc(100vh-4rem)] transition-all duration-300 w-full">
      
      <div>
        {/* 1. 头像与满血复活的数据统计卡片 */}
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
              alt={siteConfig('AUTHOR') || 'Avatar'}
            />
          </div>
          {/* 💡 这里传入我们刚刚在前端实时算好的、金刚不坏的数据源 */}
          <MenuGroupCard {...patchedProps} />
        </div>

        {/* 📢 2. 公告栏卡片：精准展现 Notion 后台写的内容 */}
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