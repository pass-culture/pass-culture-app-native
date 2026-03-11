import { useCallback, useRef } from 'react'
import { NativeScrollEvent, NativeSyntheticEvent, ScrollView } from 'react-native'

import { useOpacityTransition } from 'ui/animations/helpers/useOpacityTransition'

type UseOfferScrollParams = {
  scrollListener: (event: NativeSyntheticEvent<NativeScrollEvent>) => void
}

export const useOfferScroll = ({ scrollListener }: UseOfferScrollParams) => {
  const scrollViewRef = useRef<ScrollView>(null)
  const scrollYRef = useRef<number>(0)

  const { headerTransition, onScroll } = useOpacityTransition({
    listener: scrollListener,
  })

  const handleCheckScrollY = useRef(() => scrollYRef.current).current

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      onScroll(event)
      scrollYRef.current = event.nativeEvent.contentOffset.y
    },
    [onScroll]
  )

  return {
    scrollViewRef,
    headerTransition,
    handleScroll,
    handleCheckScrollY,
  }
}
