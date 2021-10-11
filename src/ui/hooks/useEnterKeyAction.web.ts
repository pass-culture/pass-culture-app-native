import { useFocusEffect } from '@react-navigation/native'
import { useCallback } from 'react'

export const useEnterKeyAction = (cb?: () => void) => {
  useFocusEffect(
    useCallback(() => {
      const handleEsc = (event: KeyboardEvent) => {
        if (event.key === 'Enter') {
          return cb && cb()
        }
      }
      globalThis.addEventListener('keypress', handleEsc)

      return () => {
        globalThis.removeEventListener('keypress', handleEsc)
      }
    }, [cb])
  )
}
