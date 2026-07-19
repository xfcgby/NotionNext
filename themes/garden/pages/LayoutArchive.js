import React from 'react'
import LayoutSideBar from '../layouts/LayoutSideBar'
import BlogPostArchive from '../components/BlogPostArchive'

/**
 * ==========================================================================
 * 【归档页】LayoutArchive
 * ==========================================================================
 */
const LayoutArchive = props => {
  return (
    <LayoutSideBar props={props}>
      <div className="garden-card p-6 bg-white dark:bg-zinc-900 rounded-xl shadow-sm">
        <BlogPostArchive {...props} />
      </div>
    </LayoutSideBar>
  )
}

export default LayoutArchive