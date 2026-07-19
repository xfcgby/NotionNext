// components/SearchDrawer.js
import { Router } from 'next/router'
import { useImperativeHandle, useRef, useEffect } from 'react'
import SearchInput from './SearchInput'

const SearchDrawer = ({ cRef, slot }) => {
  const searchDrawer = useRef()
  const searchInputRef = useRef()

  // 暴露给父组件的方法
  useImperativeHandle(cRef, () => {
    return {
      show: () => {
        searchDrawer?.current?.classList?.remove('hidden')
        setTimeout(() => {
          searchInputRef?.current?.focus()
        }, 100)
      },
      hide: () => {
        searchDrawer?.current?.classList?.add('hidden')
      }
    }
  })

  const hidden = () => {
    searchDrawer?.current?.classList?.add('hidden')
  }

  // 监听路由变化自动关闭
  Router.events.on('routeChangeComplete', (...args) => {
    hidden()
  })

  // 🟢 新增：监听自定义事件打开搜索抽屉
  useEffect(() => {
    const handleOpenSearch = () => {
      searchDrawer?.current?.classList?.remove('hidden')
      setTimeout(() => {
        searchInputRef?.current?.focus()
      }, 100)
    }

    document.addEventListener('openSearchDrawer', handleOpenSearch)
    return () => {
      document.removeEventListener('openSearchDrawer', handleOpenSearch)
    }
  }, [])

  return (
    <div id='search-drawer-wrapper' ref={searchDrawer} className='hidden'>
      <div className='flex-col fixed px-5 w-full left-0 top-14 z-40 justify-center'>
        <div className='md:max-w-3xl w-full mx-auto animate__animated animate__faster animate__fadeIn'>
          <SearchInput cRef={searchInputRef} />
          {slot}
        </div>
      </div>

      {/* 背景蒙版 */}
      <div 
        id='search-drawer-background' 
        onClick={hidden} 
        className='animate__animated animate__faster animate__fadeIn fixed bg-day dark:bg-night top-0 left-0 z-40 w-full h-full' 
      />
    </div>
  )
}

export default SearchDrawer