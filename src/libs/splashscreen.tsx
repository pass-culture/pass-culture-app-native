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

export function SplashScreenProvider(props: { children: JSX.Element }) {
  const [isSplashScreenHidden, setIsSplashScreenHidden] = useSafeState<boolean>(false)

  const hideSplashScreen = useCallback(() => {
    SplashScreen.hide()
    setIsSplashScreenHidden(true)
  }, [])

  return (
    <SplashScreenContext.Provider value={{ isSplashScreenHidden, hideSplashScreen }}>
      {props.children}
    </SplashScreenContext.Provider>
  )
}
