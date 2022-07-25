import React, { createContext, useCallback, useContext, memo, useState } from 'react'
import { Platform } from 'react-native'
import SplashScreen from 'react-native-splash-screen'

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
    const timeout = Platform.OS === 'android' ? 6000 : 4000
    setTimeout(() => {
      SplashScreen.hide()
      setIsSplashScreenHidden(true)
    }, timeout)
  }, [])

  return (
    <SplashScreenContext.Provider value={{ isSplashScreenHidden, hideSplashScreen }}>
      {props.children}
    </SplashScreenContext.Provider>
  )
})
