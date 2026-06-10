import React, { useState, useMemo } from 'react'
import CalendarHeatmap from 'react-calendar-heatmap'
import 'react-calendar-heatmap/dist/styles.css'
import { format } from 'date-fns'

export default function StackHeatmap({ allPosts }) {
  
  // 💡 统一提取文章日期的辅助函数，确保所有逻辑认准同一个时间
  const getPostDate = (post) => {
    // 依次读取：真实发布日期 -> 关联开始日期 -> 创建日期
    return post?.publishDay || post?.date?.start_date || post?.createdTime
  }

  // 1. 数据清洗：转为热力图标准格式
  const heatmapData = useMemo(() => {
    const counts = {}
    allPosts?.forEach(post => {
      const dateStr = getPostDate(post) // 👈 统一使用上面的精准时间
      if (dateStr) {
        try {
          const formattedDate = format(new Date(dateStr), 'yyyy-MM-dd')
          counts[formattedDate] = (counts[formattedDate] || 0) + 1
        } catch (e) {
          // 防止脏数据导致整站崩溃
        }
      }
    })
    return Object.keys(counts).map(date => ({ date, count: counts[date] }))
  }, [allPosts])

  // 2. 自动提取有文章的所有年份
  const years = useMemo(() => {
    const yearSet = new Set()
    allPosts?.forEach(post => {
      const dateStr = getPostDate(post)
      if (dateStr) {
        try {
          yearSet.add(new Date(dateStr).getFullYear())
        } catch (e) {}
      }
    })
    // 兜底：如果没文章，默认展示今年
    if (yearSet.size === 0) yearSet.add(new Date().getFullYear())
    // 年份从大到小排序
    return Array.from(yearSet).sort((a, b) => b - a)
  }, [allPosts])

  // 当前选中的年份（默认展示最新的一年）
  const [selectedYear, setSelectedYear] = useState(years[0])

  // 3. 计算每个年份的文章总数（用于按钮上的数字角标展示）
  const countsByYear = useMemo(() => {
    const map = {}
    allPosts?.forEach(post => {
      const dateStr = getPostDate(post)
      if (dateStr) {
        try {
          const y = new Date(dateStr).getFullYear()
          map[y] = (map[y] || 0) + 1
        } catch (e) {}
      }
    })
    return map
  }, [allPosts])

  return (
    <div className="bg-white dark:bg-[#26252c] rounded-3xl p-6 shadow-sm border border-transparent dark:border-zinc-800 transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2 text-gray-800 dark:text-gray-200 font-bold text-base">
          <i className="fa-solid fa-fire text-purple-500"></i>
          <span>文章更新热力图</span>
        </div>
        
        {/* 年份切换 Tab */}
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {years.map(year => (
            <button
              key={year}
              onClick={() => setSelectedYear(year)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedYear === year
                  ? 'bg-purple-500 text-white shadow-md shadow-purple-500/20'
                  : 'bg-gray-100 dark:bg-zinc-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200'
              }`}
            >
              {year} <span className="opacity-60 font-normal">({countsByYear[year] || 0})</span>
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto no-scrollbar">
        <div className="min-w-[620px] pr-2">
          <CalendarHeatmap
            startDate={new Date(`${selectedYear}-01-01`)}
            endDate={new Date(`${selectedYear}-12-31`)}
            values={heatmapData}
            classForValue={(value) => {
              if (!value || value.count === 0) return 'heatmap-empty'
              return `heatmap-scale-${Math.min(value.count, 4)}`
            }}
            showWeekdayLabels={true}
          />
        </div>
      </div>
    </div>
  )
}