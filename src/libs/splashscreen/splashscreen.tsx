import React, { createContext, useCallback, useContext, memo, useState, useMemo } from 'react'
import SplashScreen from 'react-native-lottie-splash-screen'

import { SplashScreenContextInterface } from './types'

const SplashScreenContext = createContext<SplashScreenContextInterface>({
  isSplashScreenHidden: false,
})

export function useSplashScreenContext() {
  return useContext<SplashScreenContextInterface>(SplashScreenContext)
}

export const SplashScreenProvider = memo(function SplashScreenProvider(props: {
  children: JSX.Element
}) {
  const [isSplashScreenHidden, setIsSplashScreenHidden] = useState<boolean>(false)

  const hideSplashScreen = useCallback(() => {
    SplashScreen.hide()
    setIsSplashScreenHidden(true)
  }, [])

  const value = useMemo(
    () => ({ isSplashScreenHidden, hideSplashScreen }),
    [hideSplashScreen, isSplashScreenHidden]
  )
  return <SplashScreenContext.Provider value={value}>{props.children}</SplashScreenContext.Provider>
})
