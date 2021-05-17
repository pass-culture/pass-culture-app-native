import { createContext, useCallback, useContext } from 'react'
import React from 'react'
import SplashScreen from 'react-native-splash-screen'

import { useSafeState } from './hooks'

interface SplashScreenContext {
  isSplashScreenHidden: boolean
  hideSplashScreen?: () => void
}

const SplashScreenContext = createContext<SplashScreenContext>({ isSplashScreenHidden: false })

export function useSplashScreenContext() {
  return useContext<SplashScreenContext>(SplashScreenContext)
}

export function SplashScreenProvider(props: { children: Element }) {
  const hideSplashScreen = useCallback(function () {
    SplashScreen.hide()
    setContextValue((previousContextValue) => ({
      ...previousContextValue,
      isSplashScreenHidden: true,
    }))
  }, [])

  const [contextValue, setContextValue] = useSafeState({
    isSplashScreenHidden: false,
    hideSplashScreen,
  })

  return (
    <SplashScreenContext.Provider value={contextValue}>
      {props.children}
    </SplashScreenContext.Provider>
  )
}
