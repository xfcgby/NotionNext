import { useState, useEffect } from 'react'

/**
 * 📝 文章字数统计 Hook
 * 遍历 Notion blockMap 统计所有文本类型 block 的字符数
 */
export function useWordCount(post) {
  const [wordCount, setWordCount] = useState(0)

  useEffect(() => {
    if (!post?.blockMap?.block) return

    let count = 0
    const blocks = post.blockMap.block
    const textBlockTypes = [
      'text', 'paragraph',
      'bulleted_list_item', 'numbered_list_item',
      'quote', 'callout',
      'to_do', 'toggle',
      'heading_1', 'heading_2', 'heading_3',
      'code', 'equation'
    ]

    Object.values(blocks).forEach(block => {
      const value = block?.value
      if (textBlockTypes.includes(value?.type)) {
        let textArray = []
        if (value?.type === 'code' || value?.type === 'equation') {
          textArray = value?.properties?.title?.[0] || []
        } else {
          textArray = value?.properties?.title || []
        }

        textArray.forEach(textItem => {
          if (typeof textItem === 'string') {
            count += textItem.replace(/\s+/g, '').length
          } else if (Array.isArray(textItem) && typeof textItem[0] === 'string') {
            count += textItem[0].replace(/\s+/g, '').length
          }
        })
      }
    })

    setWordCount(count)
  }, [post])

  const readingTime = Math.max(1, Math.ceil(wordCount / 500))

  return { wordCount, readingTime }
}