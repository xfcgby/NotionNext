// components/MenuItemDrop.js
import SmartLink from '@/components/SmartLink'
import { useState } from 'react'

/** * 支持二级展开的菜单 * @param {*} param0 * @returns */
export const MenuItemDrop = ({ link }) => {
  const [show, changeShow] = useState(false)
  const hasSubMenu = link?.subMenus?.length > 0

  if (!link || !link.show) {
    return null
  }

  return (
    <div onMouseOver={() => changeShow(true)} onMouseOut={() => changeShow(false)}>
      {/* 关键修改：将主菜单项（有子菜单的）改为SmartLink，确保点击跳转 */}
      {!hasSubMenu && (
        <SmartLink href={link?.href} target={link?.target} className='menu-link pl-2 pr-4 no-underline tracking-widest pb-1'>
          {link?.icon && <i className={link?.icon} />}
          {link?.name}
          {hasSubMenu && <i className='px-2 fa fa-angle-down'></i>}
        </SmartLink>
      )}
      {hasSubMenu && (
        <>
          <SmartLink
            href={link?.href}
            onClick={(e) => {
              changeShow(!show) // 触发子菜单显示/隐藏
              // 如果需要阻止默认跳转（仅展开子菜单），可取消下面这行；否则保留跳转
              // e.preventDefault()
            }}
            className='cursor-pointer menu-link pl-2 pr-4 no-underline tracking-widest pb-1 relative'
          >
            {link?.icon && <i className={link?.icon} />}
            {link?.name}
            <i className={`px-2 fa fa-angle-down duration-300 ${show ? 'rotate-180' : 'rotate-0'}`}></i>
            {/* 主菜单下方的安全区域 */}
            {show && (
              <div className='absolute w-full h-3 -bottom-1 left-0 bg-transparent z-30'></div>
            )}
          </SmartLink>
        </>
      )}

      {/* 子菜单 */}
      {hasSubMenu && (
        <ul
          style={{ backdropFilter: 'blur(3px)' }}
          className={`${show ? 'visible opacity-100 top-12 pointer-events-auto' : 'invisible opacity-0 top-20 pointer-events-none'} drop-shadow-md overflow-hidden rounded-md text-black dark:text-white bg-white dark:bg-black transition-all duration-300 z-20 absolute block`}
        >
          {link.subMenus.map((sLink, index) => {
            return (
              <li key={index} className='cursor-pointer hover:bg-indigo-500 hover:text-white tracking-widest transition-all duration-200 dark:border-gray-800 py-1 pr-6 pl-3'>
                <SmartLink href={sLink.href} target={link?.target}>
                  <span className='text-sm text-nowrap font-extralight'>
                    {link?.icon && <i className={sLink?.icon}> &nbsp; </i>}
                    {sLink.title}
                  </span>
                </SmartLink>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
