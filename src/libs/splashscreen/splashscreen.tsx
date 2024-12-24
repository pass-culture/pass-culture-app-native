import React, {
  createContext,
  useContext,
  memo,
  useState,
  useMemo,
  useEffect,
  useCallback,
} from 'react'
import SplashScreen from 'react-native-lottie-splash-screen'

import { SPLASHSCREEN_EVENTS } from 'events/eventNames'
import { useEventBus } from 'events/useEventBus'

import { SplashScreenContextInterface } from './types'

const SplashScreenContext = createContext<SplashScreenContextInterface>({
  isSplashScreenHidden: false,
})

export function useSplashScreenContext() {
  return useContext<SplashScreenContextInterface>(SplashScreenContext)
}

export const SplashScreenProvider = memo(function SplashScreenProvider(props: {
  children: React.ReactNode
}) {
  const [isSplashScreenHidden, setIsSplashScreenHidden] = useState<boolean>(false)
  const eventBus = useEventBus()

  const hideSplashScreen = useCallback(() => {
    SplashScreen.hide()
    setIsSplashScreenHidden(true)
  }, [])

  useEffect(() => {
    eventBus.once(SPLASHSCREEN_EVENTS.HIDE, hideSplashScreen)
    // eventBus is not necessary in dependency array
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const value = useMemo(() => ({ isSplashScreenHidden }), [isSplashScreenHidden])
  return <SplashScreenContext.Provider value={value}>{props.children}</SplashScreenContext.Provider>
})
