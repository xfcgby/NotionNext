import React from 'react'
import NotionPage from '@/components/NotionPage'
import ArticleCopyright from '../components/ArticleCopyright'
import { ArticleLock } from '../components/ArticleLock'
import LoadingSpinner from '../components/LoadingSpinner'

/**
 * ==========================================================================
 * 【文章详情画布布局】LayoutArticle
 * ==========================================================================
 */
const LayoutArticle = ({
  post,
  lock,
  validPassword,
  isClient,
  coverImage,
  meta,
  children
}) => {
  return (
    <div className="flex-1 min-w-0">
      <div className="w-full lg:hover:shadow lg:border rounded-t-xl lg:rounded-xl bg-white dark:bg-zinc-900 dark:border-black article transition-all duration-300 overflow-hidden">
        {lock && <ArticleLock validPassword={validPassword} />}
        {!lock && (
          <>
            {/* 🖼️ 文章头图 */}
            {coverImage && (
              <div className="w-full h-64 md:h-80 lg:h-96 relative overflow-hidden">
                <img
                  src={coverImage}
                  alt={post.title}
                  className="w-full h-full object-cover"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
                  <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4 drop-shadow-lg">
                    {post.title}
                  </h1>
                </div>
              </div>
            )}

            <div className="overflow-x-auto flex-grow mx-auto md:w-full px-4 md:px-8 py-6">
              {!coverImage && post?.title && (
                <h1 className="text-3xl font-bold mb-4 text-slate-800 dark:text-zinc-200">
                  {post.title}
                </h1>
              )}

              {/* 📋 元信息栏 */}
              {meta}

              <article
                id="article-wrapper"
                itemScope
                itemType="https://schema.org/Movie"
                className="prose dark:prose-invert max-w-none subpixel-antialiased overflow-y-hidden"
              >
                {isClient ? (
                  <>
                    {post?.blockMap && Object.keys(post.blockMap).length > 0 ? (
                      <NotionPage post={post} />
                    ) : (
                      <div className="text-center py-10 text-slate-400">
                        <div className="text-4xl mb-4">🍂</div>
                        <p>文章内容加载失败，请刷新重试</p>
                      </div>
                    )}
                  </>
                ) : (
                  <LoadingSpinner text="正在加载文章内容..." animate={false} />
                )}
              </article>

              {/* 版权信息 */}
              {post?.type === 'Post' && <ArticleCopyright post={post} />}

              {/* 文末内容 */}
              {children}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default LayoutArticle