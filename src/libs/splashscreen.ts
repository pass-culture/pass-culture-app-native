import { useEffect } from 'react'
import SplashScreen from 'react-native-splash-screen'

/**
 * Hides the splash screen after some delay.
 *
 * @param delay delay in milliseconds after which the splash screen will hide.
 */
export function useHideSplashScreen(delay = 500): void {
  useEffect(() => {
    const timer = setTimeout(() => {
      SplashScreen.hide()
    }, delay)
    return () => clearTimeout(timer)
  }, [])
}
