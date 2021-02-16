import { useEffect } from 'react'
import SplashScreen from 'react-native-splash-screen'

export const DEFAULT_SPLASHSCREEN_DELAY = 200

type Params = {
  delay?: number
  shouldHideSplashScreen?: boolean
}

/**
 * Hides the splash screen after some delay.
 *
 * @param delay delay in milliseconds after which the splash screen will hide.
 * @param shouldHideSplashScreen boolean used to "lock" the splashscreen until some condition is met.
 */
export function useHideSplashScreen(params?: Params): void {
  const shouldHideSplashScreen =
    params?.shouldHideSplashScreen === undefined ? true : params.shouldHideSplashScreen
  const delay =
    params?.delay === undefined ? DEFAULT_SPLASHSCREEN_DELAY : params.shouldHideSplashScreen

  useEffect(() => {
    if (!shouldHideSplashScreen) {
      return
    }
    const timer = setTimeout(() => {
      SplashScreen.hide()
    }, delay)
    return () => clearTimeout(timer)
  }, [shouldHideSplashScreen])
}
