import { createContext, useCallback, useContext, useState } from 'react'
import React from 'react'
import SplashScreen from 'react-native-splash-screen'

export const DEFAULT_SPLASHSCREEN_DELAY = 1800

interface SplashScreenContext {
  isSplashScreenHidden: boolean
  hideSplashScreen?: () => void
}

const SplashScreenContext = createContext<SplashScreenContext>({ isSplashScreenHidden: false })

export function useSplashScreenContext() {
  return useContext<SplashScreenContext>(SplashScreenContext)
}

export function SplashScreenProvider(props: { children: Element }) {
  /**
   * Hides the splash screen after some delay.
   */
  const hideSplashScreen = useCallback(function () {
    setTimeout(() => {
      SplashScreen.hide()
      setContextValue((previousContextValue) => ({
        ...previousContextValue,
        isSplashScreenHidden: true,
      }))
    }, DEFAULT_SPLASHSCREEN_DELAY)
  }, [])

  const [contextValue, setContextValue] = useState({
    isSplashScreenHidden: false,
    hideSplashScreen,
  })

  return (
    <SplashScreenContext.Provider value={contextValue}>
      {props.children}
    </SplashScreenContext.Provider>
  )
}
