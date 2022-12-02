import { useFocusEffect } from '@react-navigation/native'
import { useCallback } from 'react'
import { StatusBar } from 'react-native'

export const useWhiteStatusBar = () => {
  return useFocusEffect(
    useCallback(() => {
      StatusBar.setBarStyle('light-content', true)

      /**
       * When there are two screens that use this hook, it does:
       * 1. mount the new screen : set the light theme
       * 2. unmount the old screen : set the dark theme
       * So it result with a dark screen where it is unwanted
       *
       * In order to prevent having a dark theme on some screens where it is unwanted
       * We added this weird hacky fix
       *
       * When there are two screens that use this hook, it does:
       * 1. mount the new screen : set the light theme
       * 2. unmount the old screen : set the dark theme
       * 3. weird hacky fix: after the mount of the new screen: set the light theme (again)
       *
       * It does a flash white -> black -> white which is unwanted but
       *
       * We haven't found a better solution at the moment
       */
      setTimeout(() => {
        StatusBar.setBarStyle('light-content', false)
      })

      return () => StatusBar.setBarStyle('dark-content', true)
    }, [])
  )
}
