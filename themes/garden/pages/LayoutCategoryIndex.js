import React from 'react'
import LayoutSideBar from '../layouts/LayoutSideBar'
import CategoryGroup from '../components/CategoryGroup'

/**
 * ==========================================================================
 * 【分类页】LayoutCategoryIndex
 * ==========================================================================
 */
const LayoutCategoryIndex = props => {
  return (
    <LayoutSideBar props={props}>
      <div className="garden-card p-6 bg-white dark:bg-zinc-900 rounded-xl shadow-sm">
        <CategoryGroup {...props} />
      </div>
    </LayoutSideBar>
  )
}

export default LayoutCategoryIndex