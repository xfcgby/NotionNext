import SmartLink from '@/components/SmartLink'

/**
 * 博客归档列表 - 数字花园生态主题版
 * @param posts 所有文章
 * @param archiveTitle 归档标题（如：2026）
 * @returns {JSX.Element}
 */
const BlogPostArchive = ({ posts = [], archiveTitle }) => {
  if (!posts || posts.length === 0) {
    return <></>
  }

  return (
    <div className='my-8 relative select-none'>
      {/* 归档年份标题：化作年轮或扎根的泥土基底 */}
      <div
        className='pt-8 pb-6 text-2xl font-semibold text-emerald-800 dark:text-emerald-300 flex items-center gap-2 font-serif'
        id={archiveTitle}>
        <span className='inline-block w-3 h-3 rounded-full bg-emerald-500 animate-pulse' />
        {archiveTitle} 年的耕耘
      </div>

      {/* 核心时间轴：藤蔓主干 */}
      <ul className='relative border-l-[3px] border-emerald-100 dark:border-emerald-950/40 ml-4 pl-6 space-y-6 before:content-[""] before:absolute before:bottom-0 before:left-[-3px] before:w-[3px] before:h-4 before:bg-gradient-to-t before:from-transparent before:to-emerald-100'>
        
        {posts?.map((post, index) => {
          return (
            <li
              key={post.id}
              className='group relative list-none transition-all duration-300 ease-in-out'
              style={{ 
                // 制造一点错落有致的“野生生长”感
                transform: `translateX(${index % 2 === 0 ? '2px' : '0px'})` 
              }}
            >
              {/* 节点：叶片/嫩芽标记 */}
              <div className='absolute -left-[31px] top-1.5 w-4 h-4 rounded-full border-2 border-emerald-400 bg-white dark:bg-zinc-900 group-hover:bg-emerald-400 group-hover:scale-125 transition-all duration-300 shadow-sm flex items-center justify-center'>
                {/* 悬浮时显现的脉络核心 */}
                <div className='w-1 h-1 rounded-full bg-transparent group-hover:bg-white transition-colors duration-300' />
              </div>

              {/* 内容包裹区 */}
              <div 
                id={post?.publishDay} 
                className='flex flex-col md:flex-row md:items-center gap-1 md:gap-4 p-2 -m-2 rounded-xl border border-transparent hover:border-emerald-100/50 hover:bg-emerald-50/30 dark:hover:bg-emerald-950/10 transition-all duration-300'
              >
                {/* 时间戳：温润的泥土色系 */}
                <span className='text-xs font-mono tracking-wider text-stone-400 dark:text-stone-500 whitespace-nowrap'>
                  {post.date?.start_date}
                </span>

                {/* 文章标题：嫩芽伸展的交互 */}
                <SmartLink
                  href={post?.href}
                  passHref
                  className='text-sm md:text-base text-stone-700 dark:text-stone-300 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-200 font-medium overflow-x-hidden cursor-pointer'
                >
                  <span className='relative inline-block'>
                    {post.title}
                    {/* 自适应日夜间模式的下划线萌芽效果 */}
                    <span className='absolute bottom-0 left-0 w-0 h-[2px] bg-gradient-to-r from-emerald-400 to-teal-400 group-hover:w-full transition-all duration-300 ease-out' />
                  </span>
                </SmartLink>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default BlogPostArchive