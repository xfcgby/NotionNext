// components/ClothesLine.js
import React, { useState, useMemo, useEffect } from 'react'
import { useRouter } from 'next/router'

// 🛠️ 辅助函数：从缓存获取
const getFromCache = (key) => {
  if (typeof window === 'undefined') return null
  try {
    const s = sessionStorage.getItem(key)
    if (s) return JSON.parse(s)
    return null
  } catch (e) {
    return null
  }
}

export default function ClothesLine({ tags = [], posts = [] }) {
  const router = useRouter()
  const [tooltip, setTooltip] = useState('点击衣物过滤所有文章')
  
  // 🌱 客户端获取全站标签数据（优先从缓存读取）
  const [siteTags, setSiteTags] = useState(() => {
    const cached = getFromCache('notion_site_tags')
    return cached || []
  })

  useEffect(() => {
    // 1. 如果缓存已有有效数据，不再请求
    if (siteTags.length > 0) return

    // 2. 缓存不存在，从 API 获取
    fetch('/api/site-stats')
      .then(r => r.json())
      .then(data => {
        if (data.tags && data.tags.length > 0) {
          setSiteTags(data.tags)
          try {
            sessionStorage.setItem('notion_site_tags', JSON.stringify(data.tags))
          } catch (e) {}
        }
      })
      .catch(err => {
        console.warn('[ClothesLine] 获取全站标签失败:', err)
      })
  }, [])


  // 内联样式
  const styles = `
    .cloth-item {
      cursor: pointer;
      position: relative;
      z-index: 10;
    }
    .cloth-inner-swing {
      animation: clothSwing 4.5s ease-in-out infinite;
      transition: all 0.2s ease;
      transform-origin: top center;
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 100%;
    }
    .cloth-item:hover .cloth-inner-swing {
      transform: scale(1.06);
      filter: drop-shadow(0 4px 8px rgba(0,0,0,0.06));
    }
    @keyframes clothSwing {
      0%, 100% { transform: rotate(-3deg); }
      50% { transform: rotate(3deg); }
    }
  `

  // 使用全站标签数据（优先），回退到 props
  const normalizedTags = useMemo(() => {
    if (siteTags.length > 0) return siteTags
    
    if (tags && tags.length > 0) {
      if (typeof tags[0] === 'string') return tags.map(name => ({ name, count: 1 }))
      if (tags[0]?.name) return tags
      if (tags[0]?.tag) return tags.map(t => ({ name: t.tag, count: t.count || 1 }))
      if (typeof tags === 'string') return tags.split(',').map(s => ({ name: s.trim(), count: 1 }))
    }

    if (posts && posts.length > 0) {
      const tagMap = {}
      posts.forEach(post => {
        const postTags = post?.tags || []
        if (Array.isArray(postTags)) {
          postTags.forEach(tag => {
            const tagName = typeof tag === 'string' ? tag : tag?.name || tag?.tag || ''
            if (tagName) tagMap[tagName] = (tagMap[tagName] || 0) + 1
          })
        }
      })
      return Object.keys(tagMap).map(name => ({ name, count: tagMap[name] }))
    }

    return []
  }, [tags, posts, siteTags])

  if (!normalizedTags || normalizedTags.length === 0) {
    return (
      <div className="w-full flex flex-col items-center py-4 select-none">
        <div className="text-center text-xs text-slate-400 dark:text-zinc-500">
          🧺 花园尚未晾晒衣物…
        </div>
      </div>
    )
  }

  const colors = ['#FFF0F5', '#E8F0FE', '#E6F9EC', '#FFFEE4', '#FDEBD0', '#E0F7FA']
  const clothesTypes = ['t-shirt', 'pants', 'skirt', 'socks']

  const hashCode = (str) => {
    let hash = 5381
    for (let i = 0; i < str.length; i++) {
      hash = (hash * 33) ^ str.charCodeAt(i)
    }
    return Math.abs(hash)
  }

  const getClothesSVG = (type, fillColor) => {
    const stroke = "#8a6d4d"
    if (type === 'pants') {
      return (
        <svg viewBox="0 0 60 60" className="w-10 h-10">
          <path d="M16,12 L44,12 L45,18 L41,22 L38,48 L29,48 L28,28 L27,28 L26,48 L17,48 L14,22 L11,18 Z" fill={fillColor} stroke={stroke} strokeWidth="1.3" strokeLinejoin="round"/>
          <line x1="16" y1="16" x2="44" y2="16" stroke={stroke} strokeWidth="1" strokeDasharray="2,2"/>
        </svg>
      )
    }
    if (type === 'skirt') {
      return (
        <svg viewBox="0 0 60 60" className="w-10 h-10">
          <path d="M22,8 L24,14 M38,8 L36,14" stroke={stroke} strokeWidth="1" strokeLinecap="round"/>
          <path d="M22,14 L38,14 L36,22 L48,46 Q30,51 12,46 L24,22 Z" fill={fillColor} stroke={stroke} strokeWidth="1.3" strokeLinejoin="round"/>
          <path d="M16,46 Q30,42 44,46" fill="none" stroke={stroke} strokeWidth="0.8"/>
        </svg>
      )
    }
    if (type === 'socks') {
      return (
        <svg viewBox="0 0 60 60" className="w-10 h-10">
          <path d="M15,10 L24,10 L24,26 Q24,34 33,34 L33,41 L25,41 Q15,41 15,31 Z" fill={fillColor} stroke={stroke} strokeWidth="1.2" strokeLinejoin="round"/>
          <path d="M33,14 L42,14 L42,30 Q42,38 51,38 L51,45 L43,45 Q33,45 33,35 Z" fill={fillColor} stroke={stroke} strokeWidth="1.2" strokeLinejoin="round"/>
          <line x1="15" y1="13" x2="24" y2="13" stroke={stroke} strokeWidth="0.8"/>
          <line x1="33" y1="17" x2="42" y2="17" stroke={stroke} strokeWidth="0.8"/>
        </svg>
      )
    }
    return (
      <svg viewBox="0 0 60 60" className="w-10 h-10">
        <path d="M14,12 L22,12 Q30,17 38,12 L46,12 L55,21 L47,26 L45,21 L45,48 L15,48 L15,21 L13,26 L5,21 Z" fill={fillColor} stroke={stroke} strokeWidth="1.3" strokeLinejoin="round"/>
        <path d="M24,12 Q30,16 36,12" fill="none" stroke={stroke} strokeWidth="1.2"/>
      </svg>
    )
  }

  const chunks = []
  const chunkSize = 3
  for (let i = 0; i < normalizedTags.length; i += chunkSize) {
    chunks.push(normalizedTags.slice(i, i + chunkSize))
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <div className="w-full flex flex-col items-center py-4 select-none relative font-sans">
        <div className="mb-6 px-4 py-2 bg-slate-50/80 dark:bg-zinc-800/60 backdrop-blur-md rounded-2xl border border-slate-200/50 dark:border-zinc-700/50 text-center text-xs text-slate-500 dark:text-zinc-400 shadow-2xs transition-all duration-300">
          🧺 <span className="font-medium text-slate-600 dark:text-zinc-300">{tooltip}</span>
        </div>
        <div className="w-full flex flex-col space-y-12 relative px-2">
          {chunks.map((rowTags, rowIndex) => (
            <div key={rowIndex} className="relative w-full h-16">
              <div className="absolute top-6 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-slate-300/80 to-transparent dark:via-zinc-700/80 z-0" />
              <div className="absolute top-0 left-0 w-full flex justify-around px-2 z-10">
                {rowTags.map((tag) => {
                  const tagHash = hashCode(tag.name)
                  const fillColor = colors[tagHash % colors.length]
                  const clothesType = clothesTypes[tagHash % clothesTypes.length]
                  return (
                    <div
                      key={tag.name}
                      className="cloth-item flex flex-col items-center w-full"
                      onClick={() => router.push(`/tag/${encodeURIComponent(tag.name)}`)}
                      onMouseEnter={() => setTooltip(` ${tag.name} (${tag.count} 篇破土文章)`)}
                      onMouseLeave={() => setTooltip('点击衣物过滤所有文章')}
                    >
                      <div className="cloth-inner-swing">
                        <div className="w-1.5 h-3 bg-amber-700/60 rounded-[1px] relative top-1 z-30 shadow-sm" />
                        {getClothesSVG(clothesType, fillColor)}
                      </div>
                      <div className="mt-0.5 text-[10px] text-slate-500 dark:text-zinc-400 font-mono text-center truncate w-full px-1">
                        {tag.name}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}