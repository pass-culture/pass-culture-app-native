import React, { createContext, useCallback, useContext, memo, useState, useMemo } from 'react'
import SplashScreen from 'react-native-lottie-splash-screen'

import { SplashScreenContextInterface } from './types'

const MIN_SPLASHSCREEN_DURATION_IN_MS = 2000

const SplashScreenContext = createContext<SplashScreenContextInterface>({
  isSplashScreenHidden: false,
})

export function useSplashScreenContext() {
  return useContext<SplashScreenContextInterface>(SplashScreenContext)
}

export const SplashScreenProvider = memo(function SplashScreenProvider(props: {
  children: JSX.Element
}) {
  const splashScreenBeginningTime = new Date().getTime()
  const [isSplashScreenHidden, setIsSplashScreenHidden] = useState<boolean>(false)

  const hideSplashscreenCallback = useCallback(() => {
    SplashScreen.hide()
    setIsSplashScreenHidden(true)
  }, [])

  const hideSplashScreen = useCallback(() => {
    const splashScreenDisplayDuration = new Date().getTime() - splashScreenBeginningTime
    if (splashScreenDisplayDuration < MIN_SPLASHSCREEN_DURATION_IN_MS) {
      setTimeout(
        hideSplashscreenCallback,
        MIN_SPLASHSCREEN_DURATION_IN_MS - splashScreenDisplayDuration
      )
    } else {
      hideSplashscreenCallback()
    }
  }, [splashScreenBeginningTime, hideSplashscreenCallback])

  const value = useMemo(
    () => ({ isSplashScreenHidden, hideSplashScreen }),
    [hideSplashScreen, isSplashScreenHidden]
  )
  return <SplashScreenContext.Provider value={value}>{props.children}</SplashScreenContext.Provider>
})
