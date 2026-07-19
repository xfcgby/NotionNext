import { useRouter } from 'next/router'
import { useEffect } from 'react'

/**
 * 🦔 数字花园专属 · 移动端空气感藤蔓侧边轴 (圆角毛玻璃升级版)
 * 完美保留原代码 Next.js 路由自动收回监听与精准显隐 DOM 拦截器
 */
const SideBarDrawer = ({ children, isOpen, onOpen, onClose, className }) => {
  const router = useRouter()
  
  useEffect(() => {
    const sideBarDrawerRouteListener = () => {
      switchSideDrawerVisible(false)
    }
    router.events.on('routeChangeComplete', sideBarDrawerRouteListener)
    return () => {
      router.events.off('routeChangeComplete', sideBarDrawerRouteListener)
    }
  }, [router.events])

  // 🌟 完美保留原代码 DOM 核心控制：通过操纵类名实现高性能抽屉开关缩进
  const switchSideDrawerVisible = (showStatus) => {
    if (showStatus) {
      onOpen && onOpen()
    } else {
      onClose && onClose()
    }
    const sideBarDrawer = window.document.getElementById('sidebar-drawer')
    const sideBarDrawerBackground = window.document.getElementById('sidebar-drawer-background')

    if (showStatus) {
      sideBarDrawer?.classList.replace('-mr-80', 'mr-0')
      sideBarDrawerBackground?.classList.replace('hidden', 'block')
    } else {
      sideBarDrawer?.classList.replace('mr-0', '-mr-80')
      sideBarDrawerBackground?.classList.replace('block', 'hidden')
    }
  }

  return (
    <div id="sidebar-wrapper" className={'block lg:hidden top-0 ' + className}>

      {/* 🌿 移动端温室侧边舱体：换上更轻盈的莫兰迪雾面底色，并附加左侧手绘圆角大弧度 */}
      <div
        id="sidebar-drawer"
        className={`${
          isOpen ? 'mr-0 w-80 visible' : '-mr-80 max-w-side invisible'
        } bg-white/90 dark:bg-zinc-950/90 backdrop-blur-xl rounded-l-3xl border-l border-lime-100/30 dark:border-zinc-800/50 right-0 top-0 shadow-[0_4px_40px_rgba(0,0,0,0.08)] flex flex-col duration-500 ease-out fixed h-full overflow-y-scroll scroll-hidden z-50`}
      >
        {/* 顶部优雅的内缩流缓冲条（增加手绘拟物空气感） */}
        <div className="w-full flex justify-end p-4 pb-0">
          <button 
            onClick={() => switchSideDrawerVisible(false)}
            className="w-8 h-8 rounded-xl bg-slate-100/60 dark:bg-zinc-800/60 text-slate-500 text-sm flex items-center justify-center font-bold"
          >
            ✕
          </button>
        </div>
        <div className="flex-1 px-2 pb-8">
          {children}
        </div>
      </div>

      {/* 🌫️ 治愈系：晨雾扩散背景蒙版 */}
      <div
        id="sidebar-drawer-background"
        onClick={() => switchSideDrawerVisible(false)}
        className={`${
          isOpen ? 'block' : 'hidden'
        } fixed inset-0 bg-slate-900/25 dark:bg-black/40 backdrop-blur-xs z-40 transition-all duration-500`}
      />

    </div>
  )
}

export default SideBarDrawer