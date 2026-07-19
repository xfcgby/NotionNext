import React from 'react'
import { uuidToId } from 'notion-utils'

/**
 * 📑 文章目录侧边栏
 */
export default function TocSidebar({ toc, activeTocId, tocVisible }) {
  if (!toc || toc.length === 0) return null

  const handleClick = (e, itemId) => {
    e.preventDefault()
    const shortId = itemId.replace(/-/g, '')
    let el = document.querySelector(`[data-id="${shortId}"]`)
    if (!el) {
      el = document.querySelector(`[data-id="${itemId}"]`)
    }
    if (!el) {
      el = document.getElementById(itemId)
    }
    if (el) {
      const headerOffset = 100
      const elementPosition = el.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
    }
  }

  return (
    <aside
      id="toc-aside"
      className={`hidden lg:block w-64 shrink-0 transition-all duration-300 ${
        tocVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
    >
      <div className="sticky top-24">
        <div className="garden-card p-4">
          <h3 className="text-xs font-bold text-slate-600 dark:text-zinc-300 mb-3 flex items-center gap-1">
            📑 目录
          </h3>
          <nav className="space-y-1 max-h-[calc(100vh-200px)] overflow-y-auto custom-scrollbar">
            {toc.map((item, index) => (
              <a
                key={index}
                href={`#${item.id}`}
                onClick={(e) => handleClick(e, item.id)}
                className={`block text-xs py-1.5 px-2 rounded-md transition-colors duration-200 truncate ${
                  activeTocId === item.id
                    ? 'bg-lime-50 dark:bg-lime-950/30 text-lime-600 dark:text-lime-400 font-medium'
                    : 'text-slate-500 dark:text-zinc-500 hover:text-slate-800 dark:hover:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800/30'
                } ${
                  item.level === 1 ? 'pl-2' : item.level === 2 ? 'pl-4' : 'pl-6'
                }`}
              >
                {item.text}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </aside>
  )
}