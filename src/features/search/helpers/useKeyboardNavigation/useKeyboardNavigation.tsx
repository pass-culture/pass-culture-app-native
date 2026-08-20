import { useCallback, useEffect, useState } from 'react'
import { Platform } from 'react-native'

type Props = {
  itemCount: number
  onSelect: (index: number) => void
}

export function useKeyboardNavigation({ itemCount, onSelect }: Props) {
  const [focusedIndex, setFocusedIndex] = useState<number>(-1)
  const [prevItemCount, setPrevItemCount] = useState<number>(itemCount)

  // Réinitialiser la sélection directement pendant le rendu si itemCount change
  if (prevItemCount !== itemCount) {
    setPrevItemCount(itemCount)
    setFocusedIndex(-1)
  }

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (itemCount === 0) return

      if (event.key === 'ArrowDown') {
        event.preventDefault()
        setFocusedIndex((prev) => (prev < itemCount - 1 ? prev + 1 : 0))
      } else if (event.key === 'ArrowUp') {
        event.preventDefault()
        setFocusedIndex((prev) => (prev > 0 ? prev - 1 : itemCount - 1))
      } else if (event.key === 'Enter' && focusedIndex >= 0) {
        event.preventDefault()
        onSelect(focusedIndex)
      }
    },
    [itemCount, focusedIndex, onSelect]
  )

  useEffect(() => {
    if (Platform.OS !== 'web') return

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleKeyDown])

  return { focusedIndex }
}
