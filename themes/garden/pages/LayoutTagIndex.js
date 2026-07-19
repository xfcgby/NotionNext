import React from 'react'
import LayoutSideBar from '../layouts/LayoutSideBar'
import TagGroups from '../components/TagGroups'

/**
 * ==========================================================================
 * 【标签页】LayoutTagIndex
 * ==========================================================================
 */
const LayoutTagIndex = props => {
  return (
    <LayoutSideBar props={props}>
      <div className="garden-card p-6 bg-white dark:bg-zinc-900 rounded-xl shadow-sm">
        <TagGroups {...props} />
      </div>
    </LayoutSideBar>
  )
}

export default LayoutTagIndex