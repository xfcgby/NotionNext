import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import CONFIG from '../config'
import Link from 'next/link'
import { useRouter } from 'next/router'

/**
 * 🌿 数字花园专属 · 藤蔓舒展菜单项组件 (MenuListTop 最终版)
 * 完美复刻原 HTML 的温润过渡感，将生硬的 FontAwesome 图标升级为灵动的拟物 Emoji
 */
export const MenuListTop = props => {
  const { customNav } = props
  const { locale } = useGlobal()
  const router = useRouter()

  // 1. 组装数字生命花园的标准生态核心菜单轴，并读取后台开关保护
  const links = [
    {
      id: 'index',
      icon: '🏡',
      name: locale?.NAV?.INDEX || '首页',
      href: '/',
      show: siteConfig('HEXO_MENU_INDEX', true, CONFIG) // 读取配置，默认展示
    },
    {
      id: 'archive',
      icon: '📜',
      name: locale?.NAV?.ARCHIVE || '归档',
      href: '/archive',
      show: siteConfig('HEXO_MENU_ARCHIVE', true, CONFIG) // 读取配置，默认展示
    },
    {
      id: 'category',
      icon: '📁',
      name: locale?.COMMON?.CATEGORY || '分类',
      href: '/category',
      show: siteConfig('HEXO_MENU_CATEGORY', true, CONFIG) // 开启全生态展示
    },
    {
      id: 'tag',
      icon: '🧺',
      name: locale?.COMMON?.TAGS || '标签',
      href: '/tag',
      show: siteConfig('HEXO_MENU_TAG', true, CONFIG) // 开启全生态展示
    }
  ]

  // 2. 🛡️ 完美承接：如果用户在 Notion 后台自主添加了动态自定义菜单（如“关于我”），平滑拼接到末尾
  let finalLinks = links.filter(l => l.show)
  if (customNav && customNav.length > 0) {
    // 为自定义菜单分配一个萌萌的叶子图标
    const formattedCustomNav = customNav.map((item, index) => ({
      id: `custom-${index}`,
      icon: '🍃',
      name: item.name,
      href: item.to || item.href || '/',
      show: true
    }))
    finalLinks = finalLinks.concat(formattedCustomNav)
  }

  return (
    <div className="flex items-center space-x-1 lg:space-x-4">
      {finalLinks.map(link => {
        // ⚖️ 智能精准路由判定：当前页面是否处于激活高亮状态
        const isActive = router.pathname === link.href || router.asPath === link.href

        return (
          <Link
            key={link.id}
            href={link.href}
            className={`relative px-3 py-1.5 rounded-xl text-xs font-bold tracking-wide transition-all duration-300 flex items-center space-x-1.5 group select-none ${
              isActive
                ? 'text-lime-600 dark:text-lime-400 bg-lime-50/60 dark:bg-lime-950/20 font-black'
                : 'text-slate-600 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-slate-100/40 dark:hover:bg-zinc-800/20'
            }`}
          >
            {/* 🌸 随鼠标悬浮微微放大并倾斜的拟物图标 */}
            <span className="text-sm opacity-90 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
              {link.icon}
            </span>

            {/* ✍️ 核心：文字与下划线藤蔓延展（通过 style.js 的 .menu-link 暗号提供风动力） */}
            <span className="menu-link relative py-0.5">
              {link.name}
            </span>

            {/* 🟢 仪式感小触点：如果菜单正处于激活状态，下方悄悄绽放一个小嫩芽绿点 */}
            {isActive && (
              <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-lime-500 dark:bg-lime-400 animate-pulse" />
            )}
          </Link>
        )
      })}
    </div>
  )
}