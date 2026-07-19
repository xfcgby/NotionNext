import React from 'react'

/**
 * 🗓️ 年份选择器（用于首页生命树和热力图）
 */
export default function YearSelector({ years, activeYear, onChange }) {
  if (!years || years.length === 0) return null

  return (
    <div className="flex flex-wrap gap-1 bg-slate-100/60 dark:bg-zinc-800/40 p-1 rounded-xl">
      {years.map(year => (
        <button
          key={year}
          onClick={() => onChange(year)}
          className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all duration-300 ${
            activeYear === year
              ? 'bg-white dark:bg-zinc-700 text-lime-600 dark:text-lime-400 shadow-2xs'
              : 'text-slate-400 hover:text-slate-800 dark:text-zinc-400 dark:hover:text-zinc-200'
          }`}
        >
          {year}年
        </button>
      ))}
    </div>
  )
}