import { useFocusEffect } from '@react-navigation/native'
import { useCallback } from 'react'

export const useEscapeKeyAction = (callback?: () => void) => {
  useFocusEffect(
    useCallback(() => {
      const handleEsc = (event: KeyboardEvent) => {
        if (event.key === 'Escape' || event.key === 'Esc') {
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
