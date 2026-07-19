import SmartLink from '@/components/SmartLink'

/**
 * 🗂️ 数字花园专属 · 数字标本分类盒组件 (高颜值重构版)
 * 将生硬的满宽方块升级为错落有致的治愈系生态小圆角小抽屉
 */
const CategoryGroup = ({ currentCategory, categories }) => {
  if (!categories || categories.length === 0) {
    return <></>
  }

  return (
    <>
      {/* 📦 标本架大容器：改为流式布局，预留舒适的上下呼吸间距 */}
      <div id="category-list" className="flex flex-wrap gap-2 px-4 py-2 select-none">
        {categories.map(category => {
          const selected = currentCategory === category.name
          
          return (
            <SmartLink
              key={category.name}
              href={`/category/${category.name}`}
              passHref
              className={`inline-flex items-center text-xs font-bold tracking-wide px-3.5 py-1.5 rounded-xl transition-all duration-300 cursor-pointer border shadow-2xs active:scale-95 ${
                selected
                  ? 'bg-lime-600 text-white border-lime-600 dark:bg-lime-500 dark:border-lime-500 font-black shadow-[0_4px_12px_rgba(101,163,13,0.15)] -translate-y-[1px]'
                  : 'bg-white text-slate-600 border-slate-100 hover:border-lime-200 hover:text-lime-600 dark:bg-zinc-900 dark:text-zinc-400 dark:border-zinc-800/80 dark:hover:border-lime-900/50 dark:hover:text-lime-400'
              }`}
            >
              <div className="flex items-center space-x-1.5"> 
                {/* 📂 带有微幅拟物摇晃效果的分类小架子 */}
                <span className="text-sm transition-transform duration-300 group-hover:scale-105">
                  {selected ? '📂' : '📁'}
                </span>
                
                {/* 分类文本名字 */}
                <span>{category.name}</span>
                
                {/* 🪵 标本计数角标，未激活时轻量化显示，激活时变为嫩白 */}
                <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-md ${
                  selected 
                    ? 'bg-lime-700/50 text-lime-100 font-black' 
                    : 'bg-slate-50 text-slate-400 dark:bg-zinc-800 dark:text-zinc-500'
                }`}>
                  {category.count}
                </span>
              </div>
            </SmartLink>
          )
        })}
      </div>
    </>
  )
}

export default CategoryGroup