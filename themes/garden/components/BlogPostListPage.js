import Link from 'next/link'
import PaginationNumber from './PaginationNumber'

/**
 * 🍃 数字花园专属 · 新芽破土文章单项卡片组件
 */
export function BlogPostCardGarden({ post, index }) {
  // 🛡️ 安全提取文章的封面图（Garden 主题字段）
  const cover = post?.pageCover || post?.cover || post?.page_cover

  // 🛡️ 安全解析多类型日期
  const rawDate = post?.publishDate || post?.date?.start_date
  let showDate = '未知时间'
  if (rawDate) {
    if (typeof rawDate === 'string') showDate = rawDate.split(' ')[0]
    else {
      const d = new Date(rawDate)
      showDate = isNaN(d.getTime()) ? '未知时间' : d.toISOString().split('T')[0]
    }
  }

  return (
    <div 
      className="sprout-post-card garden-card overflow-hidden flex flex-col md:flex-row w-full shadow-[0_8px_30px_rgb(0,0,0,0.01)]"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      {/* 🖼️ 文章封面画幅区域 */}
      {cover && (
        <div className="w-full md:w-52 h-44 relative overflow-hidden shrink-0 bg-slate-100 dark:bg-zinc-800 border-b md:border-b-0 md:border-r border-dashed border-lime-100 dark:border-zinc-800">
          <img
            src={cover}
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
            loading="lazy"
          />
          {/* 类别小悬浮章 */}
          {post?.category && (
            <span className="absolute top-3 left-3 bg-white/90 dark:bg-zinc-900/95 backdrop-blur-md text-lime-600 dark:text-lime-400 text-[10px] font-bold px-2.5 py-1 rounded-xl shadow-2xs border border-lime-100 dark:border-zinc-800">
              📁 {post.category}
            </span>
          )}
        </div>
      )}

      {/* 📝 文章文本元数据区域 */}
      <div className="p-6 flex flex-col justify-between flex-1 min-w-0">
        <div>
          {/* 标题 */}
          <Link href={`/${post.slug}`} className="group inline-block mb-2.5 max-w-full">
            <h3 className="text-lg font-black text-slate-800 dark:text-zinc-100 truncate group-hover:text-lime-600 dark:group-hover:text-lime-400 transition-colors">
              {post.title}
            </h3>
          </Link>

          {/* 摘要简述 */}
          <p className="text-xs text-slate-400 dark:text-zinc-500 line-clamp-2 leading-relaxed mb-4">
            {post.summary || '这粒知识的种子静静地埋在泥土里，等待着你去发掘它完整的生命脉络...'}
          </p>
        </div>

        {/* 底部时间与生态微型标签轴 */}
        <div className="flex items-center justify-between border-t border-dashed border-slate-100 dark:border-zinc-800/60 pt-3 text-[11px] font-mono text-slate-400 dark:text-zinc-500">
          <div className="flex items-center space-x-1">
            <span>📅</span>
            <span>{showDate}</span>
          </div>

          {/* 卡片内嵌的小标签群 */}
          {post?.tags && post.tags.length > 0 && (
            <div className="flex space-x-1.5 max-w-[60%] truncate justify-end">
              {post.tags.slice(0, 2).map(tag => (
                <span key={tag} className="text-[10px] bg-slate-50 dark:bg-zinc-800 text-slate-500 dark:text-zinc-400 px-2 py-0.5 rounded-md border border-slate-100 dark:border-zinc-700/40">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/**
 * 🧱 全量列表包裹骨架（已接入分页）
 */
export default function BlogPostListPageGarden({ posts = [], ...props }) {
  const { page, totalPage } = props

  if (!posts || posts.length === 0) {
    return (
      <div className="garden-card p-12 text-center text-slate-400 dark:text-zinc-500 font-mono text-sm">
        🍃 尚无新芽破土，去 Notion 浇点水吧...
      </div>
    )
  }

  return (
    <div className="w-full flex flex-col space-y-6">
      {/* 文章列表 */}
      {posts.map((post, index) => (
        <BlogPostCardGarden key={post.id || index} post={post} index={index} />
      ))}

      {/* 📄 分页器 */}
      {page && totalPage && totalPage > 1 && (
        <PaginationNumber page={page} totalPage={totalPage} />
      )}
    </div>
  )
}