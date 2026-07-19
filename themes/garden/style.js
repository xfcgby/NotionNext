/* eslint-disable react/no-unknown-property */
import { siteConfig } from '@/lib/config'
import CONFIG from './config'

/**
 * 🌿 数字花园主题客制化 CSS 动态样式表
 */
export const StyleGarden = () => {
  const themeColor = siteConfig('GARDEN_THEME_COLOR', '#84cc16', CONFIG)

  return (
    <style jsx global>{`
      :root {
        --theme-color: ${themeColor};

        /* ====== 衣物摆动动画 ====== */
        #theme-garden .cloth-item {
          cursor: pointer;
          position: relative;
          z-index: 10;
        }
        #theme-garden .cloth-inner-swing {
          animation: clothSwing 4.5s ease-in-out infinite;
          transition: all 0.2s ease;
          transform-origin: top center;
        }
        #theme-garden .cloth-item:hover .cloth-inner-swing {
          transform: scale(1.06);
          filter: drop-shadow(0 4px 8px rgba(0,0,0,0.06));
        }
        @keyframes clothSwing {
          0%, 100% { transform: rotate(-3deg); }
          50% { transform: rotate(3deg); }
        }
      }

      /* ====== 基础全局样式 ====== */
      #theme-garden body {
        background-color: #FAFDF6 !important;
        color: #1e293b;
        font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      }

      /* 🌙 终极洗白/洗黑逻辑：全面强制穿透文章主体及其所有祖先/后代非卡片容器 */
      .dark html,
      .dark body,
      .dark #theme-garden-wrapper,
      .dark #theme-garden,
      .dark main,
      .dark article,
      .dark #notion-article,
      .dark .notion,
      .dark #container,
      .dark #wrapper,
      .dark .w-full.max-w-3xl, /* 👈 精准覆盖 NotionNext 常见的居中文章容器包裹类 */
      .dark .w-full.max-w-4xl,
      .dark main > div {
        background-color: transparent !important;
        background: transparent !important;
        color: #f1f5f9;
      }

      /* ====== ☀️ 日间模式文章主体与两侧底色统一优化 ====== */
      #theme-garden article,
      #theme-garden #notion-article,
      #theme-garden .w-full.max-w-3xl,
      #theme-garden .w-full.max-w-4xl {
        background-color: transparent !important;
        background: transparent !important;
      }

      /* ====== 夜间模式全局大背景 ====== */
      .dark html::before {
        content: "";
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        z-index: -2; 
        background: radial-gradient(circle at 30% 20%, #0d1f12, #1a1508) !important;
      }

      /* 🚨 强制 canvas 透明 */
      .dark #spring-bg-canvas,
      #spring-bg-canvas {
        background: transparent !important;
        background-color: transparent !important;
      }

      /* ✨ 黄金夹层 */
      #spring-bg-canvas {
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        width: 100vw !important;
        height: 100vh !important;
        z-index: -1 !important; 
        pointer-events: none !important;
      }

      /* ====== 治愈系卡片生态组件通用样式 ====== */
      #theme-garden .garden-card {
        background-color: rgba(255, 255, 255, 0.7);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        border: 1px solid rgba(132, 204, 22, 0.12);
        border-radius: 1.5rem;
        box-shadow: 0 4px 20px -2px rgba(132, 204, 22, 0.03);
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      }
      #theme-garden .garden-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 12px 30px rgba(132, 204, 22, 0.05);
      }

      /* ====== 夜间模式卡片 ====== */
      .dark #theme-garden .garden-card {
        background-color: rgba(15, 30, 18, 0.78);
        border-color: rgba(163, 230, 53, 0.10);
        box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.4);
      }
      .dark #theme-garden .garden-card:hover {
        box-shadow: 0 12px 30px rgba(163, 230, 53, 0.05);
      }

      /* ====== 导航菜单样式 ====== */
      #theme-garden .nav-link {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 0.625rem 1rem;
        border-radius: 1rem;
        font-size: 0.875rem;
        color: #4b5563;
        transition: all 0.2s ease;
        cursor: pointer;
      }
      #theme-garden .nav-link:hover {
        background-color: rgba(132, 204, 22, 0.05);
        color: #16a34a;
      }
      .dark #theme-garden .nav-link {
        color: #a1a1aa;
      }
      .dark #theme-garden .nav-link:hover {
        background-color: rgba(132, 204, 22, 0.08);
        color: #4ade80;
      }
      #theme-garden .nav-link.active {
        background-color: rgba(132, 204, 22, 0.1);
        color: #16a34a;
        font-weight: 600;
      }
      .dark #theme-garden .nav-link.active {
        background-color: rgba(74, 222, 128, 0.15);
        color: #4ade80;
      }

      /* ==========================================================================
       * 📊【热力图文章色块优化 - 高对比度版】
       * ========================================================================== */
      .dark #theme-garden .garden-card .w-full .flex.justify-center > .flex[class*="gap-"] > .flex-col[class*="gap-"] > div:empty,
      .dark #theme-garden .garden-card .w-full .flex.justify-center > [class*="gap-"] > [class*="flex-col"] > div:empty {
        border-radius: 2px !important;
        min-width: 8px !important;
        min-height: 8px !important;
      }

      /* 
       * 颜色对比度调整：
       * Level 0 (无文章): 从 #1e3a1e 调深为 #0f1f0f，与背景更融合
       * Level 1 (1篇文章): 从 #2d6a3f 调亮为 #4ade80，对比度大幅提升
       * Level 2-4: 相应调亮，保持梯度
       */

      /* Level 0 - 无文章：深绿黑，几乎融入背景 */
      .dark #theme-garden rect[fill="#ebedf0"],
      .dark #theme-garden rect[fill="rgb(235, 237, 240)"],
      .dark #theme-garden rect[fill="#161b22"],
      .dark #theme-garden rect[fill="rgb(22, 27, 34)"],
      .dark #theme-garden rect[fill="#2d333b"],
      .dark #theme-garden rect[fill="rgb(45, 51, 59)"],
      .dark #theme-garden .heatmap-bg-0,
      .dark #theme-garden .github-contribution-rect[data-level="0"],
      .dark #theme-garden .garden-card .w-full .flex.justify-center > .flex[class*="gap-"] > .flex-col[class*="gap-"] > div:empty[style*="background"],
      .dark #theme-garden .garden-card .w-full .flex.justify-center > [class*="gap-"] > [class*="flex-col"] > div:empty[style*="background"] {
        background-color: #0f1f0f !important;
        fill: #0f1f0f !important;
        border: 1px solid rgba(74, 222, 128, 0.15) !important;
        opacity: 1 !important;
      }

      /* Level 1 - 1篇文章：明显亮绿，对比度大幅提升 */
      .dark #theme-garden rect[fill="#9be9a8"],
      .dark #theme-garden rect[fill="rgb(155, 233, 168)"],
      .dark #theme-garden rect[fill="#0e4429"],
      .dark #theme-garden rect[fill="rgb(14, 68, 41)"],
      .dark #theme-garden .heatmap-bg-1,
      .dark #theme-garden .github-contribution-rect[data-level="1"] {
        background-color: #4ade80 !important;
        fill: #4ade80 !important;
        border: 1px solid rgba(74, 222, 128, 0.6) !important;
        opacity: 1 !important;
      }

      /* Level 2 - 2篇文章：更亮的绿色 */
      .dark #theme-garden rect[fill="#40c463"],
      .dark #theme-garden rect[fill="rgb(64, 196, 99)"],
      .dark #theme-garden rect[fill="#006d32"],
      .dark #theme-garden rect[fill="rgb(0, 109, 50)"],
      .dark #theme-garden .heatmap-bg-2,
      .dark #theme-garden .github-contribution-rect[data-level="2"] {
        background-color: #86efac !important;
        fill: #86efac !important;
        border: 1px solid rgba(134, 239, 172, 0.7) !important;
        opacity: 1 !important;
      }

      /* Level 3 - 3篇文章：亮黄绿 */
      .dark #theme-garden rect[fill="#30a14e"],
      .dark #theme-garden rect[fill="rgb(48, 161, 78)"],
      .dark #theme-garden rect[fill="#26a641"],
      .dark #theme-garden rect[fill="rgb(38, 166, 65)"],
      .dark #theme-garden .heatmap-bg-3,
      .dark #theme-garden .github-contribution-rect[data-level="3"] {
        background-color: #bef264 !important;
        fill: #bef264 !important;
        border: 1px solid rgba(190, 242, 100, 0.8) !important;
        opacity: 1 !important;
      }

      /* Level 4 - 4篇及以上：最亮的黄绿，带发光效果 */
      .dark #theme-garden rect[fill="#216e39"],
      .dark #theme-garden rect[fill="rgb(33, 110, 57)"],
      .dark #theme-garden rect[fill="#39d353"],
      .dark #theme-garden rect[fill="rgb(57, 211, 83)"],
      .dark #theme-garden .heatmap-bg-4,
      .dark #theme-garden .github-contribution-rect[data-level="4"] {
        background-color: #d9f99d !important;
        fill: #d9f99d !important;
        border: 1px solid rgba(217, 249, 157, 0.9) !important;
        box-shadow: 0 0 10px rgba(163, 230, 53, 0.5) !important;
        opacity: 1 !important;
      }

      .dark #theme-garden [style*="background-color: rgb(235"],
      .dark #theme-garden [style*="background-color: #161b22"],
      .dark #theme-garden [style*="background-color: #2d333b"] {
        background-color: #0f1f0f !important;
        border: 1px solid rgba(74, 222, 128, 0.15) !important;
      }

      .dark #theme-garden .heatmap-container,
      .dark #theme-garden [class*="heatmap"] {
        color: #9ca3af !important;
      }
      .dark #theme-garden .heatmap-label,
      .dark #theme-garden [class*="heatmap"] text {
        fill: #9ca3af !important;
        color: #9ca3af !important;
      }

      /* ==========================================================================
       * ✨【数字花园色彩隐射】
       * ========================================================================== */

      /* 1. 🔐 密码锁组件 */
      #theme-garden input#password:focus {
        box-shadow: 0 0 0 2px color-mix(in srgb, var(--theme-color) 30%, transparent) !important;
        border-color: var(--theme-color) !important;
      }
      #theme-garden div[class*='bg-indigo-500'],
      #theme-garden button[class*='bg-indigo-500'],
      #theme-garden .bg-indigo-500 {
        background-color: var(--theme-color) !important;
      }

      /* 2. 📝 版权声明组件 */
      #theme-garden section ul[class*='border-indigo-500'],
      #theme-garden .border-indigo-500 {
        border-color: var(--theme-color) !important;
      }
      #theme-garden section ul {
        background-color: rgba(132, 204, 22, 0.04) !important;
        border-radius: 0.75rem;
      }
      .dark #theme-garden section ul {
        background-color: rgba(132, 204, 22, 0.02) !important;
      }

      /* 3. 👈 👉 翻页导航与推荐卡片 */
      #theme-garden a[class*='hover:text-indigo-'],
      #theme-garden span[class*='text-indigo-'] {
        color: var(--theme-color) !important;
      }

      /* 4. 🗂️ 文章大纲目录 (Catalog) */
      #theme-garden .catalog-item:hover {
        color: var(--theme-color) !important;
      }
      #theme-garden .catalog-item.font-bold {
        color: var(--theme-color) !important;
        border-left-color: var(--theme-color) !important;
      }

      /* 5. 🚀 右下角随动悬浮大挂件 */
      #theme-garden div[id='right-float-area'] div[class*='bg-indigo-'],
      #theme-garden div[class*='bg-indigo-600'] {
        background-color: var(--theme-color) !important;
      }

      /* 6. 🌿 全局细节优化 */
      ::selection {
        background: color-mix(in srgb, var(--theme-color) 20%, transparent);
        color: inherit;
      }
      ::-webkit-scrollbar-thumb {
        background-color: color-mix(in srgb, var(--theme-color) 35%, transparent);
        border-radius: 10px;
      }
      ::-webkit-scrollbar-thumb:hover {
        background-color: var(--theme-color);
      }

      /* ==========================================================================
       * 🎨【侧边栏字体颜色统一】
       * ========================================================================== */

      /* 夜间模式侧边栏所有文字统一为灰白色 */
      .dark #theme-garden aside,
      .dark #theme-garden .sidebar,
      .dark #theme-garden [class*="sidebar"] {
        color: #cbd5e1 !important;
      }

      .dark #theme-garden aside *,
      .dark #theme-garden .sidebar *,
      .dark #theme-garden [class*="sidebar"] * {
        color: #cbd5e1 !important;
      }

      /* 侧边栏统计大数字（PV、UV、文章数等）统一为更亮的白色 */
      .dark #theme-garden aside .font-bold,
      .dark #theme-garden .sidebar .font-bold,
      .dark #theme-garden [class*="sidebar"] .font-bold,
      .dark #theme-garden aside [class*="font-bold"],
      .dark #theme-garden .sidebar [class*="font-bold"],
      .dark #theme-garden [class*="sidebar"] [class*="font-bold"] {
        color: #f1f5f9 !important;
      }

      /* 侧边栏中的主题色数字（如 2025-2026）保持绿色 */
      .dark #theme-garden aside [style*="color: rgb(59"],
      .dark #theme-garden aside [style*="color: #3b"],
      .dark #theme-garden .sidebar [style*="color: rgb(59"],
      .dark #theme-garden .sidebar [style*="color: #3b"],
      .dark #theme-garden [class*="sidebar"] [style*="color: rgb(59"],
      .dark #theme-garden [class*="sidebar"] [style*="color: #3b"] {
        color: #4ade80 !important;
      }

      /* 日间模式侧边栏文字统一 */
      #theme-garden aside,
      #theme-garden .sidebar,
      #theme-garden [class*="sidebar"] {
        color: #4b5563 !important;
      }

      #theme-garden aside *,
      #theme-garden .sidebar *,
      #theme-garden [class*="sidebar"] * {
        color: #4b5563 !important;
      }

      #theme-garden aside .font-bold,
      #theme-garden .sidebar .font-bold,
      #theme-garden [class*="sidebar"] .font-bold {
        color: #1e293b !important;
      }
    `}</style>
  )
}

export { StyleGarden as Style }
export default StyleGarden