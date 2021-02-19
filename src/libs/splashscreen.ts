import { useEffect, useState } from 'react'
import SplashScreen from 'react-native-splash-screen'

export const DEFAULT_SPLASHSCREEN_DELAY = 500

type Params = {
  delay?: number
  shouldHideSplashScreen?: boolean
}

/**
 * Hides the splash screen after some delay.
 *
 * @param delay delay in milliseconds after which the splash screen will hide.
 * @param shouldHideSplashScreen boolean used to "lock" the splashscreen until some condition is met.
 *
 * @returns object with property `isSplashScreenHidden`, set to `true` once `SplashScreen.hide()` is called.
 */
export function useHideSplashScreen(params?: Params): { isSplashScreenHidden: boolean } {
  const shouldHideSplashScreen =
    params?.shouldHideSplashScreen === undefined ? true : params.shouldHideSplashScreen
  const delay =
    params?.delay === undefined ? DEFAULT_SPLASHSCREEN_DELAY : params.shouldHideSplashScreen
  const [isSplashScreenHidden, setIsSplashScreenHidden] = useState(false)

  useEffect(() => {
    if (!shouldHideSplashScreen) {
      return
    }
    const timer = setTimeout(() => {
      SplashScreen.hide()
      setIsSplashScreenHidden(true)
    }, delay)
    return () => clearTimeout(timer)
  }, [shouldHideSplashScreen])

  return { isSplashScreenHidden }
}
