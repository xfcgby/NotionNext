import { useEffect } from 'react'

/**
 * 🍂 404 自动重定向 Hook
 * 当内容不存在时，3秒后自动跳转到 404 页面
 */
export function useRedirect404(shouldRedirect, isClient, router) {
  useEffect(() => {
    if (!shouldRedirect || !isClient) return
    const timer = setTimeout(() => {
      router.push('/404').then(() => {
        console.warn('文章不存在，正在前往迷失空间...')
      })
    }, 3000)
    return () => clearTimeout(timer)
  }, [shouldRedirect, isClient, router])
}