import { useEffect } from 'react'
import SplashScreen from 'react-native-splash-screen'

export const DEFAULT_SPLASHSCREEN_DELAY = 500
/**
 * Hides the splash screen after some delay.
 *
 * @param delay delay in milliseconds after which the splash screen will hide.
 */
export function useHideSplashScreen(delay = DEFAULT_SPLASHSCREEN_DELAY): void {
  useEffect(() => {
    const timer = setTimeout(() => {
      SplashScreen.hide()
    }, delay)
    return () => clearTimeout(timer)
  }, [])
}
