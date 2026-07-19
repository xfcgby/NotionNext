import React from 'react'
import LayoutSideBar from '../layouts/LayoutSideBar'
import BlogPostListPage from '../components/BlogPostListPage'

/**
 * ==========================================================================
 * 【文章列表布局】LayoutPostList
 * ==========================================================================
 */
const LayoutPostList = props => {
  return (
    <LayoutSideBar props={props}>
      <div className="w-full">
        <BlogPostListPage {...props} />
      </div>
    </LayoutSideBar>
  )
}

export default LayoutPostList