import React from 'react'

/**
 * 🌱 加载中占位组件
 */
export default function LoadingSpinner({ text = '正在加载文章内容...', animate = true }) {
  return (
    <div className="text-center">
      <div className={`text-4xl mb-4 ${animate ? 'animate-spin' : 'animate-pulse'}`}>🌱</div>
      <div className="text-slate-400">{text}</div>
    </div>
  )
}