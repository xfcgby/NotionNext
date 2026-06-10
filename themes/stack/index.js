import Comment from '@/components/Comment'
import replaceSearchResult from '@/components/Mark'
import NotionPage from '@/components/NotionPage'
import ShareBar from '@/components/ShareBar'
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import { isBrowser } from '@/lib/utils'
import { Transition } from '@headlessui/react'
import dynamic from 'next/dynamic'
import SmartLink from '@/components/SmartLink'
import { useRouter } from 'next/router'
import { createContext, useContext, useEffect } from 'react'
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

const AlgoliaSearchModal = dynamic(
  () => import('@/components/AlgoliaSearchModal'),
  { ssr: false }
)

// 主题全局状态
const ThemeGlobalHexo = createContext()
export const useHexoGlobal = () => useContext(ThemeGlobalHexo)

/**
 * 🌟 核心修复：纯净且绝对锁定的 Stack 双栏响应式骨架
 * 坚决不引入 SideRight 组件，彻底杜绝变成三栏的可能
 */
const LayoutBase = props => {
  const { children } = props

  return (
    <div className="min-h-screen bg-[#f6f6f6] dark:bg-[#1a191f] text-gray-900 antialiased p-4 transition-colors duration-300">
      <div className="max-w-6xl mx-auto relative flex flex-col md:flex-row gap-6 items-start">
        
        {/* 1. 左侧固定卡片边栏 (固定 280px 宽度) */}
        <div className="w-full md:w-[280px] shrink-0 md:sticky md:top-4 z-10">
          <SideBar {...props} />
        </div>

        {/* 2. 右侧主内容区 (自适应铺满剩余空间，物理阻断任何第三栏挂件) */}
        <main className="flex-1 min-w-0 w-full space-y-6">
          {children}
        </main>

      </div>
    </div>
  )
}

/**
 * 首页：大圆角热力图卡片 + 文章列表流
 */
const LayoutIndex = props => {
  const { posts, allPosts } = props 

  return (
    <LayoutBase {...props}>
      {/* 创作热力图卡片 */}
      <StackHeatmap allPosts={allPosts || posts} />

      {/* 文章列表卡片流 */}
      <LayoutPostList {...props} />
    </LayoutBase>
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
    <LayoutBase {...props}>
      <div className='w-full'>
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
    </LayoutBase>
  )
}

/**
 * 归档页
 */
const LayoutArchive = props => {
  const { archivePosts } = props
  return (
    <LayoutBase {...props}>
      <div className='w-full'>
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
    </LayoutBase>
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
            router.push('/404').then(() => {
              console.warn('找不到页面', router.asPath)
            })
          }
        }
      }, waiting404)
    }
  }, [post])

  return (
    <LayoutBase {...props}>
      <div className='w-full lg:hover:shadow rounded-3xl p-6 bg-white dark:bg-[#26252c] shadow-sm article'>
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
    </LayoutBase>
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
    <div className='text-black w-full h-screen text-center justify-center content-center items-center flex flex-col'>
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
    <LayoutBase {...props}>
      <div className='w-full'>
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
    </LayoutBase>
  )
}

/**
 * 标签列表页
 */
const LayoutTagIndex = props => {
  const { tagOptions } = props
  const { locale } = useGlobal()
  return (
    <LayoutBase {...props}>
      <div className='w-full'>
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
    </LayoutBase>
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