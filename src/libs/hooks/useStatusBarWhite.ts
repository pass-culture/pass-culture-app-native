import { useFocusEffect } from '@react-navigation/native'
import { useCallback } from 'react'
import { StatusBar } from 'react-native'

export const useStatusBarWhite = () => {
  return useFocusEffect(
    useCallback(() => {
      StatusBar.setBarStyle('light-content', true)
      return () => StatusBar.setBarStyle('dark-content', true)
    }, [])
  )
}
