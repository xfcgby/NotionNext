import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import { useRouter } from 'next/router'
import { useGardenGlobal } from '..'

/**
 * 🔍 数字花园专属 · 生态探照灯搜索按钮 (美化升级版)
 * 完美保留原有 Algolia / 本地动态路由分发逻辑，注入手绘暖金微光
 */
export default function SearchButton(props) {
  const { locale } = useGlobal()
  const router = useRouter()
  const { searchModal } = useGardenGlobal()

  function handleSearch() {
    if (siteConfig('ALGOLIA_APP_ID')) {
      searchModal.current.openSearch()
    } else {
      router.push('/search')
    }
  }

  return (
    <>
      <button
        onClick={handleSearch}
        title={locale.NAV.SEARCH}
        aria-label={locale.NAV.SEARCH}
        className="group relative cursor-pointer text-slate-600 dark:text-zinc-400 hover:bg-amber-50/60 dark:hover:bg-amber-950/20 rounded-xl w-9 h-9 flex justify-center items-center duration-300 border border-transparent hover:border-amber-100/60 dark:hover:border-amber-900/40 transition-all select-none focus:outline-none"
      >
        {/* 🌟 拟物手绘探照灯 Emoji，悬浮时微微放大并带有探寻式摆动 */}
        <span className="text-sm opacity-90 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">
          🔍
        </span>

        {/* 🟢 隐藏的氛围后视光晕：hover 时悄悄溢出一层淡淡的植物阳光感 */}
        <span className="absolute inset-0 rounded-xl bg-amber-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </button>
    </>
  )
}