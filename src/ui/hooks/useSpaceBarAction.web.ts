import { useFocusEffect } from '@react-navigation/native'
import { useCallback } from 'react'

export const useSpaceBarAction = (callback?: () => void) => {
  useFocusEffect(
    useCallback(() => {
      const handleEsc = (event: KeyboardEvent) => {
        if (event.key === 'Spacebar' || event.key === ' ') {
          event.preventDefault() // Chrome - Block scrolling on space bar press
          return callback?.()
        }
      }
      globalThis.addEventListener('keydown', handleEsc)

      return () => {
        globalThis.removeEventListener('keydown', handleEsc)
      }
    }, [callback])
  )
}
