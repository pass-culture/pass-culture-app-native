import { useCallback, useEffect, useMemo, useState } from 'react'

type Options = Partial<{
  initialCount: number
  nextCount: number
}>

export const useListExpander = <T>(list: T[], options?: Options) => {
  const { initialCount = 6, nextCount = 3 } = options || {}
  const [count, setCount] = useState<number>(initialCount)

  useEffect(() => {
    setCount(initialCount)
  }, [list, initialCount])

  const items = useMemo(() => (count === list.length ? list : list.slice(0, count)), [count, list])

  const showMore = useCallback(
    () =>
      setCount((count) => {
        const newCount = count + nextCount
        return Math.max(newCount, items.length)
      }),
    [items.length, nextCount]
  )

  const hasReachedEnd = useMemo(() => {
    return items.length === list.length
  }, [items.length, list.length])

  return { items, showMore, hasReachedEnd }
}
