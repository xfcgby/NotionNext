import React, { useMemo } from 'react'
import { useRouter } from 'next/router'
import LayoutSideBar from '../layouts/LayoutSideBar'
import BlogPostListPage from '../components/BlogPostListPage'
import SearchInput from '../components/SearchInput'

/**
 * ==========================================================================
 * 【搜索页】LayoutSearch
 * ==========================================================================
 */
const LayoutSearch = props => {
  const { keyword, posts, allPosts } = props
  const router = useRouter()

  const currentSearch = keyword || router?.query?.s || router?.query?.keyword || router?.asPath?.split('/search/')?.[1]

  const filteredPosts = useMemo(() => {
    if (!currentSearch) return posts || []

    const searchKey = currentSearch.toLowerCase().trim()
    const sourcePosts = allPosts || posts || []

    return sourcePosts.filter(post => {
      const title = (post.title || '').toLowerCase()
      const summary = (post.summary || '').toLowerCase()
      const content = (post.content || '').toLowerCase()
      const tags = (post.tags || []).join(' ').toLowerCase()
      const category = (post.category || '').toLowerCase()

      return title.includes(searchKey) ||
        summary.includes(searchKey) ||
        content.includes(searchKey) ||
        tags.includes(searchKey) ||
        category.includes(searchKey)
    })
  }, [currentSearch, posts, allPosts])

  return (
    <LayoutSideBar props={props}>
      <div className="garden-card p-6 space-y-4 bg-white dark:bg-zinc-900 rounded-xl shadow-sm">
        <SearchInput {...props} />

        <div className="pt-4">
          {currentSearch ? (
            <div>
              <div className="mb-4 text-sm text-slate-500 dark:text-zinc-400">
                🔍 搜索 "<span className="font-bold text-lime-600 dark:text-lime-400">{currentSearch}</span>"
                找到 <span className="font-bold">{filteredPosts.length}</span> 篇叶子
              </div>

              <BlogPostListPage posts={filteredPosts} {...props} />
            </div>
          ) : (
            <div className="text-center py-8 text-slate-400 dark:text-zinc-500">
              <div className="text-4xl mb-2">🔍</div>
              <p>输入关键词开始搜索...</p>
            </div>
          )}
        </div>
      </div>
    </LayoutSideBar>
  )
}

export default LayoutSearch