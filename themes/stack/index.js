import Comment from '@/components/Comment'
import replaceSearchResult from '@/components/Mark'
import NotionPage from '@/components/NotionPage'
import ShareBar from '@/components/ShareBar'
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import { isBrowser } from '@/lib/utils'
import dynamic from 'dynamic'
import SmartLink from '@/components/SmartLink'
import { useRouter } from 'next/router'
import { createContext, useContext, useEffect, useState } from 'react'
import ArticleAdjacent from './components/ArticleAdjacent'
import ArticleCopyright from './components/ArticleCopyright'
import { ArticleLock } from './components/ArticleLock'
import ArticleRecommend from './components/ArticleRecommend'
import BlogPostArchive from './components/BlogPostArchive'
import BlogPostListPage from './components/BlogPostListPage'
import BlogPostListScroll from './components/BlogPostListScroll'
import Card from './components/Card'
import SearchNav from './components/SearchNav'
import SlotBar from './components/SlotBar'
import TagItemMini from './components/TagItemMini'
import CONFIG from './config'
import SideBar from './components/SideBar'
import StackHeatmap from './components/StackHeatmap'

const ThemeGlobalHexo = createContext()
export const useHexoGlobal = () => useContext(ThemeGlobalHexo)

/**
 * 🌟 核心大骨架：全站唯一的外壳，把夜间模式单独剥离到右下角悬浮球
 */
const LayoutBase = props => {
  const { children } = props
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const { isDarkMode, toggleTheme } = useGlobal()

  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [router.asPath])

  if (!children) return null

  return (
    <div id="stack-theme-root" className="w-full min-h-screen bg-[#f6f6f6] dark:bg-[#1a191f] text-gray-900 antialiased p-4 transition-colors duration-300 relative">
      <div className="max-w-6xl mx-auto relative flex flex-col md:flex-row gap-6 items-start justify-start w-full">
        
        {/* 左侧固定边栏：全站生命周期里有且仅有一个 */}
        <div id="stack-left-sidebar" className="w-full md:w-[280px] shrink-0 md:sticky md:top-4 z-30">
          <SideBar {...props} />
        </div>

        {/* 右侧自适应主内容区 */}
        <main id="stack-main-content" className="flex-1 min-w-0 w-full space-y-6 z-10">
          {mounted ? children : (
            <div className="animate-pulse w-full h-40 bg-gray-50 dark:bg-zinc-800 rounded-3xl" />
          )}
        </main>
      </div>

      {/* 🌓 独立右下角悬浮球：只有在客户端完全挂载后才渲染，百分百防打包报错 */}
      {mounted && (
        <button
          onClick={toggleTheme}
          className="fixed bottom-6 right-6 z-50 p-3.5 rounded-full bg-white dark:bg-[#26252c] text-gray-600 dark:text-gray-300 shadow-lg border border-gray-100 dark:border-zinc-800 hover:scale-110 active:scale-95 transition-all duration-200 group"
          title="切换主题"
        >
          <i className={`fas ${isDarkMode ? 'fa-sun text-amber-500' : 'fa-moon text-indigo-500'} text-lg transition-transform duration-300 group-hover:rotate-12`} />
        </button>
      )}

    </div>
  )
}

/**
 * 首页
 */
const LayoutIndex = props => {
  const { posts, allPosts } = props 

  return (
    <div key="stack-layout-index" className="w-full space-y-6">
      <StackHeatmap allPosts={allPosts || posts} />
      <LayoutPostList {...props} />
    </div>
  )
}

/**
 * 博客列表
 */
const LayoutPostList = props => {
  return (
    <div className='w-full'>
      <SlotBar {...props} />
      {siteConfig('POST_LIST_STYLE') === 'page' ? (
        <BlogPostListPage {...props} />
      ) : (
        <BlogPostListScroll {...props} />
      )}
    </div>
  )
}

/**
 * 搜索页
 */
const LayoutSearch = props => {
  const { keyword } = props
  const router = useRouter()
  const currentSearch = keyword || router?.query?.s

  useEffect(() => {
    if (currentSearch) {
      replaceSearchResult({
        doms: document.getElementsByClassName('replace'),
        search: keyword,
        target: {
          element: 'span',
          className: 'text-red-500 border-b border-dashed'
        }
      })
    }
  })

  return (
    <div key="stack-layout-search" className='w-full'>
      {!currentSearch ? (
        <SearchNav {...props} />
      ) : (
        <div id='posts-wrapper'>
          {siteConfig('POST_LIST_STYLE') === 'page' ? (
            <BlogPostListPage {...props} />
          ) : (
            <BlogPostListScroll {...props} />
          )}
        </div>
      )}
    </div>
  )
}

/**
 * 归档页
 */
const LayoutArchive = props => {
  const { archivePosts } = props
  return (
    <div key="stack-layout-archive" className='w-full'>
      <Card className='w-full'>
        <div className='mb-10 pb-20 bg-white md:p-12 p-3 min-h-full dark:bg-[#26252c] rounded-3xl shadow-sm'>
          {Object.keys(archivePosts).map(archiveTitle => (
            <BlogPostArchive
              key={archiveTitle}
              posts={archivePosts[archiveTitle]}
              archiveTitle={archiveTitle}
            />
          ))}
        </div>
      </Card>
    </div>
  )
}

/**
 * 文章详情页
 */
const LayoutSlug = props => {
  const { post, lock, validPassword } = props
  const router = useRouter()
  const waiting404 = siteConfig('POST_WAITING_TIME_FOR_404') * 1000
  
  useEffect(() => {
    if (!post) {
      setTimeout(() => {
        if (isBrowser) {
          const article = document.querySelector('#article-wrapper #notion-article')
          if (!article) {
            router.push('/404')
          }
        }
      }, waiting404)
    }
  }, [post])

  return (
    <div key={`stack-slug-${post?.id || router.asPath}`} className='w-full lg:hover:shadow rounded-3xl p-6 bg-white dark:bg-[#26252c] shadow-sm article'>
      {lock && <ArticleLock validPassword={validPassword} />}

      {!lock && post && (
        <div className='overflow-x-auto flex-grow mx-auto md:w-full'>
          <article id='article-wrapper' className='subpixel-antialiased overflow-y-hidden'>
            <section className='justify-center mx-auto max-w-2xl lg:max-w-full'>
              {post && <NotionPage post={post} />}
            </section>

            <ShareBar post={post} />
            {post?.type === 'Post' && (
              <div className="mt-8 space-y-6">
                <ArticleCopyright {...props} />
                <ArticleRecommend {...props} />
                <ArticleAdjacent {...props} />
              </div>
            )}
          </article>

          <div className='pt-6 duration-200 overflow-x-auto bg-white dark:bg-[#26252c]'>
            <Comment frontMatter={post} />
          </div>
        </div>
      )}
    </div>
  )
}

/**
 * 404页面
 */
const Layout404 = props => {
  const router = useRouter()
  const { locale } = useGlobal()
  
  useEffect(() => {
    setTimeout(() => {
      if (isBrowser) {
        const article = document.querySelector('#article-wrapper #notion-article')
        if (!article) {
          router.push('/')
        }
      }
    }, 3000)
  })

  return (
    <div key="stack-layout-404" className='text-black w-full h-screen text-center justify-center content-center items-center flex flex-col'>
      <div className='dark:text-gray-200'>
        <h2 className='inline-block border-r-2 border-gray-600 mr-2 px-3 py-2 align-top'>404</h2>
        <div className='inline-block text-left h-32 leading-10 items-center'>
          <h2 className='m-0 p-0'>{locale.COMMON.NOT_FOUND}</h2>
        </div>
      </div>
    </div>
  )
}

/**
 * 分类列表页
 */
const LayoutCategoryIndex = props => {
  const { categoryOptions } = props
  const { locale } = useGlobal()
  return (
    <div key="stack-layout-category" className='w-full'>
      <Card className='w-full min-h-screen bg-white dark:bg-[#26252c] rounded-3xl p-6 shadow-sm'>
        <div className='dark:text-gray-200 mb-5 font-bold'>
          <i className='mr-2 fas fa-th' /> {locale.COMMON.CATEGORY}:
        </div>
        <div id='category-list' className='duration-200 flex flex-wrap gap-4'>
          {categoryOptions?.map(category => (
            <SmartLink key={category.name} href={`/category/${category.name}`} passHref legacyBehavior>
              <div className='duration-300 dark:hover:text-white px-4 py-2 cursor-pointer bg-gray-50 dark:bg-zinc-800 rounded-xl hover:text-purple-500 transition-colors'>
                <i className='mr-2 fas fa-folder' /> {category.name} ({category.count})
              </div>
            </SmartLink>
          ))}
        </div>
      </Card>
    </div>
  )
}

/**
 * 标签列表页
 */
const LayoutTagIndex = props => {
  const { tagOptions } = props
  const { locale } = useGlobal()
  return (
    <div key="stack-layout-tags" className='w-full'>
      <Card className='w-full bg-white dark:bg-[#26252c] rounded-3xl p-6 shadow-sm'>
        <div className='dark:text-gray-200 mb-5 font-bold'>
          <i className='mr-2 fas fa-tag' /> {locale.COMMON.TAGS}:
        </div>
        <div id='tags-list' className='duration-200 flex flex-wrap gap-2'>
          {tagOptions.map(tag => (
            <div key={tag.name}>
              <TagItemMini key={tag.name} tag={tag} />
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

export {
  Layout404,
  LayoutArchive,
  LayoutBase,
  LayoutCategoryIndex,
  LayoutIndex,
  LayoutPostList,
  LayoutSearch,
  LayoutSlug,
  LayoutTagIndex,
  CONFIG as THEME_CONFIG
}