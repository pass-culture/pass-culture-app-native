import React, { createContext, useCallback, useContext, memo, useState } from 'react'
import SplashScreen from 'react-native-splash-screen'

import { useShowSkeleton } from 'features/home/api/useShowSkeleton'

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
  const showSkeleton = useShowSkeleton()

  const hideSplashScreen = useCallback(() => {
    if (!showSkeleton) {
      SplashScreen.hide()
      setIsSplashScreenHidden(true)
    }
  }, [showSkeleton])

  return (
    <SplashScreenContext.Provider value={{ isSplashScreenHidden, hideSplashScreen }}>
      {props.children}
    </SplashScreenContext.Provider>
  )
})
