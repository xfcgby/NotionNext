// components/MenuListSide.js
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import { useRouter } from 'next/router'
import { useMemo, useState, useEffect } from 'react'
import CONFIG from '../config'
import Link from 'next/link'
import Collapse from '@/components/Collapse'

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

const MenuListSide = props => {
  const { customNav, customMenu } = props
  const { locale, allPosts: globalAllPosts } = useGlobal()
  const router = useRouter()

  // 🌱 客户端获取全站统计数据（优先从缓存读取）
  const [siteStats, setSiteStats] = useState(() => {
    // 初始化时尝试从缓存读取
    const cached = getFromCache('notion_site_stats')
    return cached || { totalPostCount: 0, currentYearCount: 0, loaded: false }
  })

  useEffect(() => {
    // 1. 先尝试从全局数据获取
    if (globalAllPosts && globalAllPosts.length > 0) {
      const currentYear = new Date().getFullYear()
      const currentYearCount = globalAllPosts.filter(post => {
        const rawDate = post?.publishDate || post?.date?.start_date
        let postYear = ''
        if (typeof rawDate === 'string') postYear = rawDate.split('-')[0]?.trim()
        else if (typeof rawDate === 'number') postYear = new Date(rawDate).getFullYear().toString()
        return postYear === currentYear.toString()
      }).length
      
      const stats = {
        totalPostCount: globalAllPosts.length,
        currentYearCount,
        loaded: true
      }
      setSiteStats(stats)
      try {
        sessionStorage.setItem('notion_site_stats', JSON.stringify(stats))
      } catch (e) {}
      return
    }

    // 2. 如果缓存已有有效数据，不再请求
    if (siteStats.loaded && siteStats.totalPostCount > 0) return

    // 3. 缓存不存在，从 API 获取
    fetch('/api/site-stats')
      .then(r => r.json())
      .then(data => {
        if (data.totalPostCount >= 0) {
          const stats = {
            totalPostCount: data.totalPostCount,
            currentYearCount: data.currentYearCount,
            loaded: true
          }
          setSiteStats(stats)
          try {
            sessionStorage.setItem('notion_site_stats', JSON.stringify(stats))
          } catch (e) {}
        }
      })
      .catch(err => {
        console.warn('[MenuListSide] 获取全站统计失败:', err)
      })
  }, [globalAllPosts])


  // 用于控制展开的菜单索引
  const [openIndexes, setOpenIndexes] = useState(new Set())
  const toggleMenu = (index) => {
    const newOpenIndexes = new Set(openIndexes)
    if (newOpenIndexes.has(index)) {
      newOpenIndexes.delete(index)
    } else {
      newOpenIndexes.add(index)
    }
    setOpenIndexes(newOpenIndexes)
  }

  // 1. 动态分析并过滤出最终要展现的菜单列表
  const uniqueLinks = useMemo(() => {
    const linksMap = new Map()

    const mergeLinks = (sourceLinks) => {
      if (!sourceLinks || sourceLinks.length === 0) return
      sourceLinks.forEach(item => {
        if (!item.name) return
        const existing = linksMap.get(item.name)
        let finalHref = item.to || item.slug || '/'
        if (finalHref && !finalHref.startsWith('/') && !finalHref.startsWith('http')) {
          finalHref = '/' + finalHref
        }
        const subMenus = item.subMenus || item.items || []
        if (existing) {
          linksMap.set(item.name, {
            icon: item.icon || existing.icon || 'fas fa-leaf',
            name: item.name,
            href: finalHref !== '/' ? finalHref : (existing.href || '/'),
            show: item.status !== 'Invisible',
            target: item.target || existing.target,
            subMenus: subMenus.length > 0 ? subMenus : (existing.subMenus || [])
          })
        } else {
          linksMap.set(item.name, {
            icon: item.icon || 'fas fa-leaf',
            name: item.name,
            href: finalHref,
            show: item.status !== 'Invisible',
            target: item.target,
            subMenus: subMenus
          })
        }
      })
    }

    mergeLinks(customMenu)
    mergeLinks(customNav)

    const baseLinks = [
      { icon: 'fas fa-archive', name: locale.NAV.ARCHIVE, href: '/archive', show: siteConfig('HEXO_MENU_ARCHIVE', null, CONFIG) },
      { icon: 'fas fa-search', name: locale.NAV.SEARCH, href: '/search', show: siteConfig('HEXO_MENU_SEARCH', null, CONFIG) },
      { icon: 'fas fa-folder', name: locale.COMMON.CATEGORY, href: '/category', show: siteConfig('HEXO_MENU_CATEGORY', null, CONFIG) },
      { icon: 'fas fa-tag', name: locale.COMMON.TAGS, href: '/tag', show: siteConfig('HEXO_MENU_TAG', null, CONFIG) }
    ]

    baseLinks.forEach(link => {
      if (link.name && !linksMap.has(link.name)) {
        linksMap.set(link.name, link)
      }
    })

    return Array.from(linksMap.values()).filter(item => item.show)
  }, [customNav, customMenu, locale])

  // 计算数字生命建站天数
  const gardenLiveDays = useMemo(() => {
    const since = siteConfig('SINCE', 2025)
    const start = new Date(`${since}-09-01`).getTime()
    const now = new Date().getTime()
    const days = Math.floor((now - start) / (1000 * 60 * 60 * 24))
    return days > 0 ? days : 1
  }, [])

  return (
    <div className="w-full flex flex-col font-sans relative p-1 select-none">
      <nav className="flex flex-col space-y-1 mb-6">
        {uniqueLinks.map((link, index) => {
          const isActive = router.asPath === link.href
          const hasSubMenu = link?.subMenus && link.subMenus.length > 0
          const isOpen = openIndexes.has(index)

          return (
            <div key={index} className="w-full">
              <div className="flex items-center justify-between group">
                <Link href={link.href} target={link.target} className="flex-1">
                  <div className={`flex items-center space-x-4 py-2.5 px-4 rounded-xl cursor-pointer transition-all duration-300 ${
                    isActive ? 'bg-lime-50/80 dark:bg-lime-950/20 text-lime-600 dark:text-lime-400 font-bold shadow-xs' : 'text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-800/40 hover:text-slate-900 dark:hover:text-zinc-200'
                  }`}>
                    <span className="text-sm w-5 text-center group-hover:scale-110 transition-transform duration-300 shrink-0">
                      <i className={`${link.icon} transition-colors duration-300`}></i>
                    </span>
                    <span className="text-xs font-medium tracking-wide leading-relaxed flex-1">
                      {link.name}
                    </span>
                  </div>
                </Link>
                {hasSubMenu && (
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      toggleMenu(index)
                    }}
                    className={`p-2 mr-2 text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'}`}
                    aria-label="Toggle menu"
                  >
                    <i className="fas fa-chevron-down text-xs"></i>
                  </button>
                )}
              </div>

              {hasSubMenu && (
                <Collapse isOpen={isOpen} onHeightChange={null}>
                  <div className="pl-12 pr-4 py-1 space-y-1">
                    {link.subMenus.map((sLink, sIndex) => {
                      let sHref = sLink.to || sLink.slug || '/'
                      if (sHref && !sHref.startsWith('/') && !sHref.startsWith('http')) {
                        sHref = '/' + sHref
                      }
                      const isSubActive = router.asPath === sHref
                      return (
                        <Link key={sIndex} href={sHref} target={sLink.target}>
                          <div className={`text-xs py-2 pl-2 pr-2 rounded-lg cursor-pointer transition-colors duration-200 flex items-center group ${
                            isSubActive ? 'text-lime-600 dark:text-lime-400 font-semibold bg-lime-50/50 dark:bg-lime-950/10' : 'text-slate-500 dark:text-zinc-500 hover:text-slate-800 dark:hover:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800/30'
                          }`}>
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-zinc-700 mr-3 group-hover:bg-lime-500 transition-colors"></span>
                            <span className="truncate">
                              {sLink.title || sLink.name}
                            </span>
                          </div>
                        </Link>
                      )
                    })}
                  </div>
                </Collapse>
              )}
              {hasSubMenu && isOpen && <div className="h-2"></div>}
            </div>
          )
        })}
      </nav>

      <div className="mt-2 pt-5 border-t border-dashed border-slate-100 dark:border-zinc-800 flex flex-col space-y-3.5 text-xs text-slate-600 dark:text-zinc-400">
        <div className="flex justify-between items-center transition-all hover:translate-x-0.5">
          <span className="text-slate-500 dark:text-zinc-500 flex items-center gap-1">📖 全站思想总计</span>
          <span className="font-mono text-xs text-slate-700 dark:text-zinc-300">
            <span className="font-bold text-slate-900 dark:text-zinc-100">{siteStats.totalPostCount || '--'}</span> 篇
          </span>
        </div>

        <div className="flex justify-between items-center transition-all hover:translate-x-0.5">
          <span className="text-slate-500 dark:text-zinc-500 flex items-center gap-1">🌱 年新芽数</span>
          <span className="font-mono text-xs text-slate-700 dark:text-zinc-300">
            <span className="font-bold text-slate-900 dark:text-zinc-100">{siteStats.currentYearCount || '--'}</span> 篇
          </span>
        </div>

        <div className="flex justify-between items-center transition-all hover:translate-x-0.5">
          <span className="text-slate-500 dark:text-zinc-500 flex items-center gap-1">⏳ 萌芽破土时间</span>
          <span className="font-mono text-xs text-slate-700 dark:text-zinc-300">
            <span className="font-bold text-slate-900 dark:text-zinc-100">{gardenLiveDays}</span> 天
          </span>
        </div>

        <div className="busuanzi_container_site_pv flex justify-between items-center transition-all hover:translate-x-0.5">
          <span className="text-slate-500 dark:text-zinc-500 flex items-center gap-1">✨ 倾听回响 (PV)</span>
          <span className="font-mono text-xs text-slate-700 dark:text-zinc-300">
            <span id="busuanzi_value_site_pv" className="font-bold text-slate-900 dark:text-zinc-100 busuanzi_value_site_pv">--</span> 次
          </span>
        </div>

        <div className="busuanzi_container_site_uv flex justify-between items-center transition-all hover:translate-x-0.5">
          <span className="text-slate-500 dark:text-zinc-800 flex items-center gap-1">👥 游园人数 (UV)</span>
          <span className="font-mono text-xs text-slate-700 dark:text-zinc-300">
            <span id="busuanzi_value_site_uv" className="font-bold text-slate-900 dark:text-zinc-100 busuanzi_value_site_uv">--</span> 人
          </span>
        </div>

        <div className="flex justify-between items-center transition-all hover:translate-x-0.5 pt-1 border-t border-dashed border-green-100 dark:border-zinc-800">
          <span className="text-slate-500 dark:text-zinc-500 flex items-center gap-1">📅 生态年轮跨度</span>
          <span className="font-mono text-[10px] bg-green-50 dark:bg-green-950/30 text-green-600 dark:text-green-400 px-2 py-0.5 rounded font-bold">
            {siteConfig('SINCE', 2025)} - {new Date().getFullYear()}
          </span>
        </div>
      </div>
    </div>
  )
}

export default MenuListSide