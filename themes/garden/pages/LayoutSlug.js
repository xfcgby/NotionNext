import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import LayoutSideBar from '../layouts/LayoutSideBar'
import LayoutArticle from '../layouts/LayoutArticle'
import ArticleAdjacent from '../components/ArticleAdjacent'
import ArticleRecommend from '../components/ArticleRecommend'
import Comment from '@/components/Comment'
import ProgressBar from '../components/ProgressBar'
import ArticleMeta from '../components/ArticleMeta'
import TocSidebar from '../components/TocSidebar'
import LoadingSpinner from '../components/LoadingSpinner'
import { useReadingProgress } from '../hooks/useReadingProgress'
import { useTocTracker } from '../hooks/useTocTracker'
import { useWordCount } from '../hooks/useWordCount'
import { useRedirect404 } from '../hooks/useRedirect404'

/**
 * ==========================================================================
 * 【文章详情页】LayoutSlug
 * ==========================================================================
 */
const LayoutSlug = props => {
  const { post, lock, validPassword } = props
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const readingProgress = useReadingProgress(isClient)
  const { activeTocId, tocVisible } = useTocTracker(isClient, post)
  const { wordCount, readingTime } = useWordCount(post)

  useRedirect404(!post, isClient, router)

  if (!post) {
    return (
      <LayoutSideBar props={props}>
        <div className="garden-card p-6 md:p-10 min-h-[400px] flex items-center justify-center w-full">
          <LoadingSpinner animate={true} />
        </div>
      </LayoutSideBar>
    )
  }

  const coverImage = post?.pageCover || post?.cover || post?.page_cover

  return (
    <LayoutSideBar props={props}>
      {/* 📊 阅读进度条 */}
      <ProgressBar progress={readingProgress} />

      {/* 🔥 外层 flex：画布和目录并列 */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* 左侧：白色画布 */}
        <LayoutArticle
          post={post}
          lock={lock}
          validPassword={validPassword}
          isClient={isClient}
          coverImage={coverImage}
          meta={<ArticleMeta post={post} wordCount={wordCount} readingTime={readingTime} />}
        >
          {/* 🌱 文末相邻文章 */}
          <div className="mt-10 pt-6 border-t border-dashed border-slate-100 dark:border-zinc-800">
            <ArticleAdjacent {...props} />
          </div>

          {/* 🌱 文末推荐 */}
          <div className="mt-8">
            <ArticleRecommend {...props} />
          </div>

          {/* 评论区 */}
          <div id="comment-wrapper" className="mt-10 pt-6 border-t border-dashed border-slate-100 dark:border-zinc-800">
            <Comment frontMatter={post} />
          </div>
        </LayoutArticle>

        {/* 右侧：目录 */}
        <TocSidebar
          toc={post?.toc}
          activeTocId={activeTocId}
          tocVisible={tocVisible}
        />
      </div>
    </LayoutSideBar>
  )
}

export default LayoutSlug