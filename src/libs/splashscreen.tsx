import { createContext, useCallback, useContext } from 'react'
import React from 'react'
import SplashScreen from 'react-native-splash-screen'
import { useIsFetching } from 'react-query'

import { QueryKeys } from 'libs/queryKeys'

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
  const [isSplashScreenHidden, setIsSplashScreenHidden] = useSafeState<boolean>(false)
  const isFetchingHomepageLayout = useIsFetching(QueryKeys.HOMEPAGE_MODULES) > 0
  const isFetchingAlgoliaModules = useIsFetching([QueryKeys.ALGOLIA_MODULE]) > 0

  const hideSplashScreen = useCallback(() => {
    if (!isFetchingHomepageLayout && isFetchingAlgoliaModules) {
      SplashScreen.hide()
      setIsSplashScreenHidden(true)
    }
  }, [isFetchingHomepageLayout, isFetchingAlgoliaModules])

  return (
    <SplashScreenContext.Provider value={{ isSplashScreenHidden, hideSplashScreen }}>
      {props.children}
    </SplashScreenContext.Provider>
  )
}
