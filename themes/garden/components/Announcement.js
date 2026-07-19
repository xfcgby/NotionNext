import React from 'react'
import dynamic from 'next/dynamic'

// 动态引入 NotionNext 核心页面渲染组件
const NotionPage = dynamic(() => import('@/components/NotionPage'), { ssr: false })

/**
 * 📢 数字花园专属 · 植物呼吸灯公告栏
 */
export default function Announcement({ notice }) {
  
  // 🛡️ 防御层：如果没有真正的公告数据，优雅隐藏
  if (!notice) return null

  // 判断这个公告是高级的 Notion 块页面，还是普通的纯文本字符串
  const isNotionPageBlock = notice && typeof notice === 'object' && notice.blockMap

  return (
    <div className="w-full flex flex-col font-sans relative overflow-hidden p-2 select-none">
      
      {/* 标题栏区域 */}
      <div className="flex items-center justify-between mb-4 border-b border-dashed border-lime-100 dark:border-zinc-800 pb-2">
        <div className="flex items-center space-x-2.5">
          <span className="text-lg">📢</span>
          <h3 className="font-bold text-slate-700 dark:text-zinc-300 text-sm tracking-wide">
            花园公告栏
          </h3>
        </div>
        
        {/* 🟢 拟物呼吸信号灯 */}
        <div className="flex items-center space-x-1.5 bg-lime-50 dark:bg-lime-950/30 px-2 py-0.5 rounded-full border border-lime-200/40 dark:border-lime-900/30">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-lime-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-lime-500"></span>
          </span>
          <span className="text-[10px] text-lime-600 dark:text-lime-400 font-mono font-bold uppercase tracking-wider">
            Live
          </span>
        </div>
      </div>

      {/* 📜 公告展示文本区域 */}
      <div className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed font-normal bg-slate-50/50 dark:bg-zinc-800/40 p-3.5 rounded-2xl border border-slate-100 dark:border-zinc-800/50 shadow-inner">
        {isNotionPageBlock ? (
          // 如果公告本身是个高级 Notion 页面，用它自己的 notice 数据去渲染
          <div id="announcement-content" className="notion-custom-style">
            <NotionPage post={notice} />
          </div>
        ) : (
          // 如果只是普通的纯文本字符串
          <div className="italic">
            “ {typeof notice === 'string' ? notice : (notice?.title || '数字生命花园正在静谧生长中...')} ”
          </div>
        )}
      </div>

    </div>
  )
}