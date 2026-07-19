import React from 'react'

/**
 * 📊 顶部阅读进度条
 */
export default function ProgressBar({ progress }) {
  return (
    <div className="fixed top-0 left-0 w-full h-1 z-50 bg-transparent">
      <div
        className="h-full bg-lime-500 transition-all duration-150 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}