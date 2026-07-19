import React from 'react'

/**
 * 📋 文章元信息栏（日期/阅读时间/字数/分类/标签）
 */
export default function ArticleMeta({ post, wordCount, readingTime }) {
  const rawDate = post?.publishDate || post?.date?.start_date
  let publishDate = ''
  if (rawDate) {
    if (typeof rawDate === 'string') {
      publishDate = rawDate.split(' ')[0]
    } else {
      const d = new Date(rawDate)
      publishDate = isNaN(d.getTime()) ? '' : d.toISOString().split('T')[0]
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-3 mb-8 pb-4 border-b border-dashed border-slate-100 dark:border-zinc-800 text-xs text-slate-500 dark:text-zinc-400">
      {publishDate && (
        <span className="flex items-center gap-1">
          📅 {publishDate}
        </span>
      )}
      <span className="flex items-center gap-1">
        ⏱️ {readingTime} 分钟阅读
      </span>
      <span className="flex items-center gap-1">
        📝 {wordCount} 字
      </span>
      {post?.category && (
        <span className="flex items-center gap-1 bg-lime-50 dark:bg-lime-950/30 text-lime-600 dark:text-lime-400 px-2 py-0.5 rounded-md">
          📁 {post.category}
        </span>
      )}
      {post?.tags && post.tags.length > 0 && (
        <div className="flex items-center gap-1 flex-wrap">
          {post.tags.map(tag => (
            <span key={tag} className="bg-slate-50 dark:bg-zinc-800 text-slate-500 dark:text-zinc-400 px-2 py-0.5 rounded-md">
              #{tag}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}