// components/MenuItemCollapse.js
import Collapse from '@/components/Collapse'
import SmartLink from '@/components/SmartLink'
import { useState } from 'react'

/** * 折叠菜单 * @param {*} param0 * @returns */
export const MenuItemCollapse = props => {
  const { link } = props
  const [show, changeShow] = useState(false)
  const hasSubMenu = link?.subMenus?.length > 0
  const [isOpen, changeIsOpen] = useState(false)

  const toggleShow = () => {
    changeShow(!show)
  }

  const toggleOpenSubMenu = () => {
    changeIsOpen(!isOpen)
  }

  if (!link || !link.show) {
    return null
  }

  return (
    <>
      <div className='w-full px-8 py-3 dark:hover:bg-indigo-500 hover:bg-indigo-500 hover:text-white text-left dark:bg-hexo-black-gray' onClick={toggleShow}>
        {/* 关键修改：将主菜单项（有子菜单的）改为SmartLink，确保点击跳转 */}
        {hasSubMenu ? (
          <SmartLink
            href={link.href}
            onClick={(e) => {
              toggleOpenSubMenu() // 触发子菜单展开
              // 如果需要阻止默认跳转（仅展开子菜单），可取消下面这行；否则保留跳转
              // e.preventDefault()
            }}
            className='font-extralight flex justify-between pl-2 pr-4 dark:text-gray-200 no-underline tracking-widest pb-1'
          >
            <span className='transition-all items-center duration-200'>
              {link?.icon && <i className={link.icon + ' mr-4'} />}
              {link?.name}
            </span>
            <i className={`px-2 fas fa-chevron-left transition-all duration-300 ${isOpen ? '-rotate-90' : ''} text-gray-400`}></i>
          </SmartLink>
        ) : (
          <SmartLink
            href={link?.href}
            target={link?.target}
            className='font-extralight flex justify-between pl-2 pr-4 dark:text-gray-200 no-underline tracking-widest pb-1'
          >
            <span className='transition-all items-center duration-200'>
              {link?.icon && <i className={link.icon + ' mr-4'} />}
              {link?.name}
            </span>
          </SmartLink>
        )}
      </div>

      {/* 折叠子菜单 */}
      {hasSubMenu && (
        <Collapse isOpen={isOpen} onHeightChange={props.onHeightChange}>
          {link.subMenus.map((sLink, index) => {
            return (
              <div key={index} className='dark:hover:bg-indigo-500 hover:bg-indigo-500 hover:text-white dark:bg-black dark:text-gray-200 text-left px-10 justify-start bg-gray-50 tracking-widest transition-all duration-200 py-3 pr-6'>
                <SmartLink href={sLink.href} target={link?.target}>
                  <span className='text-sm ml-4 whitespace-nowrap'>
                    {link?.icon && <i className={sLink.icon + ' mr-2'} />}
                    {sLink.title}
                  </span>
                </SmartLink>
              </div>
            )
          })}
        </Collapse>
      )}
    </>
  )
}
