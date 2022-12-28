import { useEffect, useRef } from 'react'
import { StatusBar } from 'react-native'

export function useWhiteStatusBarWithoutReactNavigation(noBackground?: boolean) {
  const timeRef = useRef(0)
  useEffect(() => {
    timeRef.current = setTimeout(() => {
      StatusBar.setBarStyle(noBackground ? 'dark-content' : 'light-content', true)
    })
    return () => {
      clearTimeout(timeRef.current)
      StatusBar.setBarStyle('dark-content', true)
    }
  }, [noBackground])
}
