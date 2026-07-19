// layouts/LayoutSideBar.js
import React from 'react'
import Hero from '../components/Hero'
import Announcement from '../components/Announcement'
import ClothesLine from '../components/ClothesLine'
import MenuListSide from '../components/MenuListSide'

/**
 * ==========================================================================
 * 【通用侧边栏布局】LayoutSideBar
 * ==========================================================================
 * 左侧：完整生态栏（Hero + 公告 + 晾衣绳 + 菜单）
 * 右侧：内容区（由 children 注入）
 */
const LayoutSideBar = ({ children, props }) => {
  const { notice, tags, posts } = props
  return (
    <main className="max-w-[1400px] mx-auto px-4 lg:px-8 py-8 flex flex-col lg:flex-row gap-8">
      
      {/* 
        【修正】：外层 aside 容器在手机端保持可见！
        在手机端，卡片依然通过 grid-cols-1 垂直平铺排开，到了大屏 lg 则恢复成侧边栏。
      */}
      <aside className="w-full lg:w-80 shrink-0 grid grid-cols-1 md:grid-cols-2 lg:flex lg:flex-col gap-6">
        {/* 头像卡片 - 手机端正常显示 */}
        <div className="garden-card overflow-hidden">
          <Hero {...props} />
        </div>
        
        {/* 公告栏 - 手机端正常显示 */}
        <div className="garden-card p-5">
          <Announcement notice={notice} />
        </div>
        
        {/* 晾衣绳标签云 - 手机端正常显示 */}
        <div className="garden-card p-5">
          <ClothesLine tags={tags} posts={posts} allPosts={props.allPosts} />
        </div>

        {/* 
          🎯【核心精准修复点】🎯
          给平铺菜单单独包裹一层 div，使用 hidden lg:block 类名。
          这样在手机和 Pad 端（lg 以下），这个重复的导航菜单会被彻底抹除，
          而在大屏电脑端（lg 以上）又会完美显现！
        */}
        <div className="hidden lg:block garden-card p-4">
          <MenuListSide {...props} />
        </div>
      </aside>

      {/* 【右侧：内容区】 */}
      <section className="flex-1 min-w-0">
        {children}
      </section>
    </main>
  )
}

export default LayoutSideBar