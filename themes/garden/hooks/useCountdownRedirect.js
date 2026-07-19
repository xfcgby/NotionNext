import { useState, useEffect } from 'react'

/**
 * ⏱️ 倒计时自动跳转 Hook
 * 用于 404 页面等场景的倒计时重定向
 */
export function useCountdownRedirect(router, seconds = 5, targetPath = '/') {
  const [countdown, setCountdown] = useState(seconds)

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => prev - 1)
    }, 1000)
    const redirectTimer = setTimeout(() => {
      router.push(targetPath)
    }, seconds * 1000)
    return () => {
      clearInterval(timer)
      clearTimeout(redirectTimer)
    }
  }, [router, seconds, targetPath])

  return countdown
}