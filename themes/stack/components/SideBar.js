import LazyImage from '@/components/LazyImage'
import { siteConfig } from '@/lib/config'
import { useRouter } from 'next/router'
import MenuGroupCard from './MenuGroupCard'
import { MenuListSide } from './MenuListSide'
import Footer from './Footer'

/**
 * 🍃 Stack 主题物理侧边栏（安全加强版）
 */
const SideBar = props => {
  const { siteInfo, notice, allPosts, posts } = props
  const router = useRouter()

  // 🧩 1. 公告栏数据智能拦截
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

  // 📊 2. 核心计算：提取并统计分类与标签（加入 count 防御）
  const validPosts = Array.isArray(allAvailableData)
    ? allAvailableData.filter(post => {
        const typeStr = Array.isArray(post?.type) ? post.type[0] : post?.type
        const statusStr = Array.isArray(post?.status) ? post.status[0] : post?.status
        return typeStr?.toLowerCase() === 'post' && statusStr?.toLowerCase() === 'published'
      })
    : []

  // 统计分类数量
  const categoryMap = {}
  // 统计标签数量
  const tagMap = {}

  validPosts.forEach(post => {
    // 分类处理
    if (post?.category) {
      const cats = Array.isArray(post.category) ? post.category : [post.category]
      cats.forEach(c => {
        if (c) categoryMap[c] = (categoryMap[c] || 0) + 1
      })
    }
    // 标签处理
    if (post?.tags) {
      const tgs = Array.isArray(post.tags) ? post.tags : [post.tags]
      tgs.forEach(t => {
        if (t) tagMap[t] = (tagMap[t] || 0) + 1
      })
    }
  })

  // 重新包装，确保格式与 NotionNext 官方格式彻底对齐（必须有 name 和 count）
  const patchedProps = {
    ...props,
    postCount: validPosts.length,
    categoryOptions: Object.keys(categoryMap).map(name => ({ name, count: categoryMap[name] })),
    tagOptions: Object.keys(tagMap).map(name => ({ name, count: tagMap[name] }))
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
          <MenuGroupCard {...patchedProps} />
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