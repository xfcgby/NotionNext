// ==========================================================================
// 数字花园主题入口 —— 纯导出聚合文件
// 所有布局/页面逻辑已拆分到独立目录
// ==========================================================================

export { default as LayoutBase } from './layouts/LayoutBase'
export { default as LayoutIndex } from './pages/LayoutIndex'
export { default as LayoutPostList } from './pages/LayoutPostList'
export { default as LayoutSearch } from './pages/LayoutSearch'
export { default as LayoutArchive } from './pages/LayoutArchive'
export { default as LayoutSlug } from './pages/LayoutSlug'
export { default as LayoutCategoryIndex } from './pages/LayoutCategoryIndex'
export { default as LayoutTagIndex } from './pages/LayoutTagIndex'
export { default as Layout404 } from './pages/Layout404'
export { default as THEME_CONFIG } from './config'

// 默认导出首页布局
export { default } from './pages/LayoutIndex'