import React, { useState, useMemo } from 'react'
import LayoutSideBar from '../layouts/LayoutSideBar'
import GardenTree from '../components/GardenTree'
import CalendarHeatmap from '../components/CalendarHeatmap'
import BlogPostListPage from '../components/BlogPostListPage'
import YearSelector from '../components/YearSelector'
import PostListWrapper from '../components/PostListWrapper'

/**
 * ==========================================================================
 * 【首页布局组件】LayoutIndex
 * ==========================================================================
 */
const LayoutIndex = props => {
  const { notice, tags, posts } = props
  const [activeYear, setActiveYear] = useState(new Date().getFullYear().toString())

  const yearsList = useMemo(() => {
    if (!posts || posts.length === 0) return []
    const yearsSet = new Set()
    posts.forEach(post => {
      const rawDate = post?.publishDate || post?.date?.start_date
      if (rawDate) {
        let year = ''
        if (typeof rawDate === 'string') year = rawDate.split('-')[0]?.trim()
        else if (typeof rawDate === 'number') year = new Date(rawDate).getFullYear().toString()
        else {
          const d = new Date(rawDate)
          year = isNaN(d.getTime()) ? '' : d.getFullYear().toString()
        }
        if (year && year.length === 4 && !isNaN(year)) {
          yearsSet.add(year)
        }
      }
    })
    return Array.from(yearsSet).sort((a, b) => b - a)
  }, [posts])

  const historyAccumulatedPosts = useMemo(() => {
    if (!posts || posts.length === 0) return []
    const targetYearNum = parseInt(activeYear)
    return posts.filter(post => {
      const rawDate = post?.publishDate || post?.date?.start_date
      let postYear = 0
      if (typeof rawDate === 'string') postYear = parseInt(rawDate.split('-')[0])
      else if (typeof rawDate === 'number') postYear = new Date(rawDate).getFullYear()
      else {
        const d = new Date(rawDate)
        postYear = isNaN(d.getTime()) ? 0 : d.getFullYear()
      }
      return postYear > 0 && postYear <= targetYearNum
    })
  }, [posts, activeYear])

  return (
    <LayoutSideBar props={props}>
      <section className="flex-1 min-w-0 space-y-6">
        {/* 生命树 */}
        <div className="garden-card p-6 flex flex-col items-center relative">
          <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2 border-b border-dashed border-slate-100 dark:border-zinc-800 pb-3">
            <div className="flex items-center space-x-2">
              <span className="text-xl">🌳</span>
              <h2 className="font-bold text-slate-800 dark:text-zinc-200">数字生命年轮时光机</h2>
            </div>
            <YearSelector
              years={yearsList}
              activeYear={activeYear}
              onChange={setActiveYear}
            />
          </div>
          <GardenTree key={activeYear} posts={historyAccumulatedPosts} currentYear={activeYear} />
        </div>

        {/* 热力图 */}
        <div className="garden-card p-6">
          <div className="flex items-center space-x-2 mb-4">
            <span className="text-xl">🌱</span>
            <h2 className="font-bold text-slate-800 dark:text-zinc-200">全年度耕耘热力图</h2>
          </div>
          <CalendarHeatmap posts={posts} currentYear={activeYear} />
        </div>

        {/* 文章列表 */}
        <PostListWrapper title="新芽破土集" icon="🍃">
          <BlogPostListPage {...props} />
        </PostListWrapper>
      </section>
    </LayoutSideBar>
  )
}

export default LayoutIndex