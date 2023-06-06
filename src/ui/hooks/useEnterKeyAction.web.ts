import { useFocusEffect } from '@react-navigation/native'
import { useCallback } from 'react'

export const useEnterKeyAction = (callback?: () => void) => {
  useFocusEffect(
    useCallback(() => {
      const handleEsc = (event: KeyboardEvent) => {
        if (event.key === 'Enter') {
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
