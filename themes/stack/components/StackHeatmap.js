import React, { useState, useMemo, useEffect } from 'react'
import CalendarHeatmap from 'react-calendar-heatmap'
import 'react-calendar-heatmap/dist/styles.css'
import { format } from 'date-fns'

export default function StackHeatmap({ allPosts }) {
  
  // ✨ 【核心修复】：在组件加载时，通过 useEffect 安全、精准地向页面注入热力图颜色样式
  useEffect(() => {
    if (typeof window === 'undefined') return

    // 检查是否已经注入过，防止页面切换时重复注入
    if (document.getElementById('stack-heatmap-custom-style')) return

    const style = document.createElement('style')
    style.id = 'stack-heatmap-custom-style'
    style.innerHTML = `
      /* 白天模式下的热力方块颜色 */
      .react-calendar-heatmap .heatmap-empty {
        fill: #ebedf0 !important;
      }
      .react-calendar-heatmap .heatmap-scale-1 {
        fill: #e0d4fc !important; /* 浅紫：1篇文章 */
      }
      .react-calendar-heatmap .heatmap-scale-2 {
        fill: #bfa3f7 !important; /* 中紫：2篇文章 */
      }
      .react-calendar-heatmap .heatmap-scale-3 {
        fill: #9e71f2 !important; /* 亮紫：3篇文章 */
      }
      .react-calendar-heatmap .heatmap-scale-4 {
        fill: #7c3aed !important; /* 深紫：4篇及以上 */
      }

      /* 暗黑模式下的热力方块颜色 (当最外层有 .dark 类时自动切换) */
      .dark .react-calendar-heatmap .heatmap-empty {
        fill: #2d2d30 !important;
      }
      .dark .react-calendar-heatmap .heatmap-scale-1 {
        fill: #3c2475 !important;
      }
      .dark .react-calendar-heatmap .heatmap-scale-2 {
        fill: #5c35b7 !important;
      }
      .dark .react-calendar-heatmap .heatmap-scale-3 {
        fill: #7c3aed !important;
      }
      .dark .react-calendar-heatmap .heatmap-scale-4 {
        fill: #a78bfa !important;
      }

      /* 优化滑过格子时的微动效，并加入精致微圆角 */
      .react-calendar-heatmap rect {
        transition: fill 0.2s ease;
        cursor: pointer;
        rx: 2px; 
      }
      .react-calendar-heatmap rect:hover {
        opacity: 0.8;
      }
    `
    document.head.appendChild(style)
  }, [])

  // 💡 统一提取文章日期的辅助函数，确保所有逻辑认准同一个时间
  const getPostDate = (post) => {
    return post?.publishDay || post?.date?.start_date || post?.createdTime
  }

  // 1. 数据清洗：转为热力图标准格式
  const heatmapData = useMemo(() => {
    const counts = {}
    allPosts?.forEach(post => {
      const dateStr = getPostDate(post)
      if (dateStr) {
        try {
          const formattedDate = format(new Date(dateStr), 'yyyy-MM-dd')
          counts[formattedDate] = (counts[formattedDate] || 0) + 1
        } catch (e) {}
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
    if (yearSet.size === 0) yearSet.add(new Date().getFullYear())
    return Array.from(yearSet).sort((a, b) => b - a)
  }, [allPosts])

  // 当前选中的年份
  const [selectedYear, setSelectedYear] = useState(years[0])

  // 3. 计算每个年份的文章总数
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