import SmartLink from '@/components/SmartLink'
import { useRouter } from 'next/router'

/**
 * 📄 数字花园专属 · 温润水渍手绘胶囊分页器 (顶级美化版)
 */
const PaginationNumber = ({ page, totalPage }) => {
  const router = useRouter()
  const currentPage = +page
  const showNext = page < totalPage
  
  // 🛡️ 完美保留原代码的高阶路由清洁整理算法，防止翻页参数紊乱
  const pagePrefix = router.asPath
    .split('?')[0]
    .replace(/\/page\/[1-9]\d*/, '')
    .replace(/\/$/, '')
    .replace('.html', '')
    
  const pages = generatePages(pagePrefix, page, currentPage, totalPage)

  return (
    <div className="w-full flex items-center justify-center space-x-2.5 py-10 font-sans select-none">
      
      {/* 🌱 上一叶 */}
      <SmartLink
        href={{
          pathname: currentPage === 2 ? `${pagePrefix}/` : `${pagePrefix}/page/${currentPage - 1}`,
          query: router.query.s ? { s: router.query.s } : {}
        }}
        rel="prev"
        className={`px-3.5 py-1.5 bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-xl text-xs font-bold text-slate-500 dark:text-zinc-400 shadow-2xs hover:border-lime-200 dark:hover:border-lime-900/60 hover:text-lime-600 dark:hover:text-lime-400 transition-all duration-300 active:scale-95 ${
          currentPage === 1 ? 'invisible pointer-events-none' : 'flex items-center'
        }`}
      >
        🌱 上一叶
      </SmartLink>

      {/* 🔢 中间聚合页码小舱 */}
      <div className="flex items-center space-x-1.5 bg-slate-50/80 dark:bg-zinc-800/50 backdrop-blur-md p-1 rounded-xl border border-slate-100 dark:border-zinc-700/40 shadow-inner">
        {pages}
      </div>

      {/* 下一叶 🌿 */}
      <SmartLink
        href={{
          pathname: `${pagePrefix}/page/${currentPage + 1}`,
          query: router.query.s ? { s: router.query.s } : {}
        }}
        rel="next"
        className={`px-3.5 py-1.5 bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-xl text-xs font-bold text-slate-500 dark:text-zinc-400 shadow-2xs hover:border-lime-200 dark:hover:border-lime-900/60 hover:text-lime-600 dark:hover:text-lime-400 transition-all duration-300 active:scale-95 ${
          !showNext ? 'invisible pointer-events-none' : 'flex items-center'
        }`}
      >
        下一叶 🌿
      </SmartLink>

    </div>
  )
}

/**
 * 🎨 改造单个数字页码按钮的插画美学外观
 */
function getPageElement(page, currentPage, pagePrefix) {
  const selected = page === currentPage
  
  return (
    <SmartLink
      href={page === 1 ? `${pagePrefix}/` : `${pagePrefix}/page/${page}`}
      key={page}
      passHref
      className={`w-7 h-7 flex items-center justify-center text-xs rounded-lg font-mono font-bold transition-all duration-300 cursor-pointer ${
        selected
          ? 'bg-white dark:bg-zinc-700 text-lime-600 dark:text-lime-400 shadow-2xs font-black scale-105 border border-lime-100 dark:border-zinc-600'
          : 'text-slate-400 hover:text-slate-700 dark:text-zinc-500 dark:hover:text-zinc-300 hover:bg-white/60 dark:hover:bg-zinc-700/40'
      }`}
    >
      {page}
    </SmartLink>
  )
}

/**
 * 🧱 完美继承原代码的动态省略号页码生成逻辑
 */
function generatePages(pagePrefix, page, currentPage, totalPage) {
  const pages = []
  const groupCount = 7 // 最多显示页签数
  
  if (totalPage <= groupCount) {
    for (let i = 1; i <= totalPage; i++) {
      pages.push(getPageElement(i, page, pagePrefix))
    }
  } else {
    pages.push(getPageElement(1, page, pagePrefix))
    const dynamicGroupCount = groupCount - 2
    let startPage = currentPage - 2
    if (startPage <= 1) {
      startPage = 2
    }
    if (startPage + dynamicGroupCount > totalPage) {
      startPage = totalPage - dynamicGroupCount
    }
    if (startPage > 2) {
      pages.push(<div key={-1} className="text-slate-300 dark:text-zinc-600 text-xs px-1 select-none font-mono">...</div>)
    }

    for (let i = startPage; i < startPage + dynamicGroupCount; i++) {
      if (i < totalPage) {
        pages.push(getPageElement(i, page, pagePrefix))
      }
    }

    if (startPage + dynamicGroupCount < totalPage) {
      pages.push(<div key={-2} className="text-slate-300 dark:text-zinc-600 text-xs px-1 select-none font-mono">...</div>)
    }
    pages.push(getPageElement(totalPage, page, pagePrefix))
  }
  return pages
}

export default PaginationNumber