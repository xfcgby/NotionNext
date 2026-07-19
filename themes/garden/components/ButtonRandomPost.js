import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import { useRouter } from 'next/router'

/**
 * 🎲 数字花园专属 · 林间漫步罗盘按钮 (随机跳转美化版)
 * 完美保留原代码文章池打散随机抽取算法，赋予手绘随风旋转特效
 */
export default function ButtonRandomPost(props) {
  const { latestPosts } = props
  const router = useRouter()
  const { locale } = useGlobal()

  function handleClick() {
    if (!latestPosts || latestPosts.length === 0) return
    const randomIndex = Math.floor(Math.random() * latestPosts.length)
    const randomPost = latestPosts[randomIndex]
    router.push(`${siteConfig('SUB_PATH', '')}/${randomPost?.slug}`)
  }

  return (
    <button
      title={locale.MENU.WALK_AROUND}
      aria-label={locale.MENU.WALK_AROUND}
      onClick={handleClick}
      className="group relative cursor-pointer text-slate-600 dark:text-zinc-400 hover:bg-lime-50/60 dark:hover:bg-lime-950/20 rounded-xl w-9 h-9 flex justify-center items-center duration-300 border border-transparent hover:border-lime-100/60 dark:hover:border-lime-900/40 transition-all select-none focus:outline-none"
    >
      {/* 🧭 拟物手绘小罗盘，鼠标悬浮时触发 360° 顺滑旋转缓动 */}
      <span className="text-sm opacity-90 transition-transform duration-700 ease-out group-hover:scale-110 group-hover:rotate-[360deg]">
        🧭
      </span>

      {/* 🟢 隐藏的氛围后视光晕：hover 时溢出一层淡淡的生态绿光 */}
      <span className="absolute inset-0 rounded-xl bg-lime-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </button>
  )
}