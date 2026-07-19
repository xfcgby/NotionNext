import React from 'react'

/**
 * 🍃 文章列表区块包装器
 */
export default function PostListWrapper({ title, icon, children }) {
  return (
    <div className="w-full">
      <div className="flex items-center space-x-2 mb-6 pl-2">
        <span className="text-xl">{icon}</span>
        <h2 className="font-bold text-slate-800 dark:text-zinc-200 text-lg">{title}</h2>
      </div>
      {children}
    </div>
  )
}