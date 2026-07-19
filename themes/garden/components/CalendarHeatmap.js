// CalendarHeatmap.js —— 纯内容组件，无自嵌套卡片
import React, { useMemo, useState, useEffect, useRef, memo } from 'react'

const CalendarHeatmap = memo(({ posts = [], onYearChange, initialYear }) => {
  // 提取可用年份
  const availableYears = useMemo(() => {
    const yearsSet = new Set()
    posts.forEach(post => {
      const rawDate = post?.publishDate || post?.date || post?.date?.start_date
      if (rawDate) {
        let year = ''
        if (typeof rawDate === 'string') year = rawDate.split('-')[0]?.trim()
        else if (typeof rawDate === 'number') year = new Date(rawDate).getFullYear().toString()
        else {
          const d = new Date(rawDate)
          year = isNaN(d.getTime()) ? '' : d.getFullYear().toString()
        }
        if (year && year.length === 4 && !isNaN(year)) yearsSet.add(year)
      }
    })
    return Array.from(yearsSet).sort((a, b) => b - a)
  }, [posts])

  const [selectedYear, setSelectedYear] = useState(() => {
    if (initialYear && availableYears.includes(String(initialYear))) return String(initialYear)
    return availableYears.length > 0 ? availableYears[0] : new Date().getFullYear().toString()
  })

  useEffect(() => {
    if (initialYear && availableYears.includes(String(initialYear))) {
      setSelectedYear(String(initialYear))
    } else if (availableYears.length > 0 && !availableYears.includes(selectedYear)) {
      setSelectedYear(availableYears[0])
    }
  }, [initialYear, availableYears, selectedYear])

  const lastDispatchedRef = useRef({ year: null, count: 0 })
  useEffect(() => {
    if (onYearChange && selectedYear) {
      const yearInt = parseInt(selectedYear, 10)
      if (!isNaN(yearInt)) {
        const count = posts.filter(p => {
          const rawDate = p?.publishDate || p?.date || p?.date?.start_date
          if (!rawDate) return false
          let pYear = 0
          if (typeof rawDate === 'string') pYear = parseInt(rawDate.split('-')[0], 10)
          else pYear = new Date(rawDate).getFullYear()
          return !isNaN(pYear) && pYear <= yearInt
        }).length
        if (lastDispatchedRef.current.year !== selectedYear || lastDispatchedRef.current.count !== count) {
          lastDispatchedRef.current = { year: selectedYear, count }
          onYearChange(yearInt, count)
        }
      }
    }
  }, [selectedYear, posts, onYearChange])

  const yearDays = useMemo(() => {
    const yearInt = parseInt(selectedYear, 10)
    if (isNaN(yearInt)) return []
    const start = new Date(yearInt, 0, 1)
    const end = new Date(yearInt, 11, 31)
    const days = []
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
      days.push({ date: dateStr, count: 0, dayOfWeek: d.getDay() })
    }
    posts.forEach(post => {
      const rawDate = post?.publishDate || post?.date || post?.date?.start_date
      if (rawDate) {
        let dateStr = ''
        if (typeof rawDate === 'string') dateStr = rawDate.split('T')[0]?.trim()
        else {
          const d = new Date(rawDate)
          if (!isNaN(d.getTime())) {
            dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
          }
        }
        const found = days.find(day => day.date === dateStr)
        if (found) found.count += 1
      }
    })
    const weeks = []
    let currentWeek = Array(7).fill(null)
    days.forEach(day => {
      currentWeek[day.dayOfWeek] = day
      if (day.dayOfWeek === 6 || day.date.endsWith('-12-31')) {
        weeks.push(currentWeek)
        currentWeek = Array(7).fill(null)
      }
    })
    if (currentWeek.some(d => d !== null)) weeks.push(currentWeek)
    return weeks
  }, [posts, selectedYear])

  const stats = useMemo(() => {
    let activeDays = 0, totalPosts = 0
    yearDays.forEach(week => {
      week.forEach(day => {
        if (day) { totalPosts += day.count; if (day.count > 0) activeDays++ }
      })
    })
    return { activeDays, totalPosts }
  }, [yearDays])

  /* ==========================================================================
   * 🎨【热力图颜色对比度优化】
   * 0篇：带微弱边框，确保格子可见但不抢眼
   * 1篇起：在原有 lime 色系基础上提亮，保持柔和不突兀
   * ========================================================================== */
  const getColorClass = (count) => {
    if (count === 0) return 'bg-gray-100/70 dark:bg-zinc-800/40 dark:border dark:border-zinc-700/50'
    if (count === 1) return 'bg-lime-200 dark:bg-lime-800'
    if (count === 2) return 'bg-lime-400 dark:bg-lime-600'
    return 'bg-lime-600 dark:bg-lime-400'
  }

  const [tooltip, setTooltip] = useState('点击年份切换热力图，同时生命树变为截至该年的累积形态')

  if (posts.length === 0) {
    return (
      <div className="w-full text-center py-6">
        <p className="text-sm text-slate-400">📭 暂无文章数据，热力图等待播种…</p>
      </div>
    )
  }

  return (
    <div className="w-full select-none">
      {/* 年份切换按钮（右对齐） */}
      <div className="flex justify-end items-center gap-1 flex-wrap mb-4">
        {availableYears.map(year => (
          <button
            key={year}
            onClick={() => {
              setSelectedYear(year)
              setTooltip(`📅 ${year} 年 · 数字花园晴雨表`)
            }}
            className={`px-3 py-1 text-xs font-mono font-bold rounded-lg transition-all ${
              selectedYear === year
                ? 'bg-white dark:bg-zinc-700 text-lime-600 dark:text-lime-400 shadow-sm scale-[1.02]'
                : 'text-slate-400 hover:text-slate-600 dark:hover:text-zinc-300 hover:bg-slate-100/50 dark:hover:bg-zinc-800/50'
            }`}
          >
            {year}
          </button>
        ))}
      </div>

      {/* 热力图网格 —— 居中 + 放大方块 */}
      <div className="w-full overflow-x-auto no-scrollbar py-1">
        <div className="flex justify-center">
          <div className="flex gap-1.5" style={{ minWidth: 'fit-content' }}>
            {/* 星期标签（纵向，字号加大） */}
            <div className="flex flex-col justify-between text-[10px] font-mono text-slate-300 dark:text-zinc-600 pr-1 py-0.5 select-none leading-[18px]">
              <span>日</span><span>一</span><span>二</span><span>三</span>
              <span>四</span><span>五</span><span>六</span>
            </div>

            {/* 方块矩阵 */}
            <div className="flex gap-[4px]">
              {yearDays.map((week, wIdx) => (
                <div key={wIdx} className="flex flex-col gap-[4px]">
                  {week.map((day, dIdx) => {
                    if (!day) {
                      return <div key={`empty-${dIdx}`} className="w-[14px] h-[14px] opacity-0" />
                    }
                    return (
                      <div
                        key={day.date}
                        className={`w-[14px] h-[14px] rounded-[3px] transition-all duration-200 cursor-pointer ${getColorClass(day.count)} hover:scale-125 hover:z-10 hover:shadow-md`}
                        onMouseEnter={() => setTooltip(`📝 ${day.date} · ${day.count} 篇`)}
                        onMouseLeave={() => setTooltip('点击年份切换热力图，同时生命树变为截至该年的累积形态')}
                      />
                    )
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 固定的 tooltip 显示区 */}
      <div className="mt-2 text-[10px] text-gray-400 dark:text-gray-500 min-h-[18px] text-center">
        {tooltip}
      </div>

      {/* 底部统计 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mt-3 pt-3 border-t border-dashed border-slate-100 dark:border-zinc-800/80">
        <div className="text-[10px] text-slate-400 dark:text-zinc-500 font-mono">
          {selectedYear} 年 · 耕耘 <span className="text-lime-600 dark:text-lime-400 font-bold">{stats.activeDays}</span> 天
          · 总文章 <span className="text-slate-600 dark:text-zinc-300 font-bold">{stats.totalPosts}</span> 篇
        </div>
        <div className="flex items-center gap-1.5 text-[9px] text-slate-400 dark:text-zinc-500 font-mono">
          <span>少</span>
          <div className="w-2.5 h-2.5 rounded-[2px] bg-gray-100/70 dark:bg-zinc-800/40 border border-slate-200/20 dark:border-zinc-700/50" />
          <div className="w-2.5 h-2.5 rounded-[2px] bg-lime-200 dark:bg-lime-800" />
          <div className="w-2.5 h-2.5 rounded-[2px] bg-lime-400 dark:bg-lime-600" />
          <div className="w-2.5 h-2.5 rounded-[2px] bg-lime-600 dark:bg-lime-400" />
          <span>多</span>
        </div>
      </div>
    </div>
  )
})

CalendarHeatmap.displayName = 'CalendarHeatmap'
export default CalendarHeatmap