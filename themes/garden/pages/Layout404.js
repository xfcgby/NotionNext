import React from 'react'
import { useRouter } from 'next/router'
import LayoutSideBar from '../layouts/LayoutSideBar'
import { useCountdownRedirect } from '../hooks/useCountdownRedirect'

/**
 * ==========================================================================
 * 【404 页面】Layout404
 * ==========================================================================
 */
const Layout404 = props => {
  const router = useRouter()
  const countdown = useCountdownRedirect(router, 5, '/')

  return (
    <LayoutSideBar props={props}>
      <div className="garden-card p-12 bg-white dark:bg-zinc-900 rounded-xl shadow-xs flex flex-col items-center justify-center text-center min-h-[450px]">
        <div className="text-6xl mb-4 animate-bounce">🍂</div>
        <h1 className="text-5xl font-mono font-extrabold text-lime-600 dark:text-lime-400 mb-2 tracking-widest">404</h1>
        <h2 className="lg:text-xl font-bold text-slate-700 dark:text-zinc-300 mb-6">抱歉，这片土壤尚未萌发数字生命...</h2>
        <p className="text-xs text-slate-400 dark:text-zinc-500 max-w-md leading-relaxed mb-8">
          你可能输入了错误的坐标，或者这片叶子已经在时光机中枯萎。
        </p>
        <div className="inline-flex items-center space-x-2 bg-slate-100 dark:bg-zinc-800/60 px-4 py-2 rounded-xl text-xs font-medium text-slate-500 dark:text-zinc-400">
          <span className="w-2 h-2 rounded-full bg-lime-500 animate-ping"></span>
          <span>系统将在 <strong className="font-mono text-lime-600 dark:text-lime-400 font-bold">{countdown}</strong> 秒后带你重返人间...</span>
        </div>
        <button
          onClick={() => router.push('/')}
          className="mt-6 text-xs text-slate-400 hover:text-lime-600 dark:hover:text-lime-400 transition-colors underline underline-offset-4"
        >
          等不及了，立即回首页 🏠
        </button>
      </div>
    </LayoutSideBar>
  )
}

export default Layout404