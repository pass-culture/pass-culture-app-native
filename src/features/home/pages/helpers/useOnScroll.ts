import { NativeScrollEvent, NativeSyntheticEvent, Platform } from 'react-native'

import { useOpacityTransition } from 'ui/animations/helpers/useOpacityTransition'
import { useThrottle } from 'ui/hooks/useThrottle'

export const useOnScroll = (
  scrollListenerToThrottle: (e: NativeSyntheticEvent<NativeScrollEvent>) => void,
  scrollListener: (e: NativeSyntheticEvent<NativeScrollEvent>) => void
) => {
  const throttledListener = useThrottle(scrollListenerToThrottle, 100, { leading: false })

  const listeners = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    // In React-Native only, the event is not usable several milliseconds after its throw
    // so we need to persist it, if we want to access its value in a debounced function.
    // https://reactjs.org/docs/legacy-event-pooling.html
    if (Platform.OS !== 'web') e.persist()

    throttledListener(e)
    scrollListener(e)
  }

  const { headerTransition: scrollButtonTransition, onScroll } = useOpacityTransition({
    listener: listeners,
  })

  return { scrollButtonTransition, onScroll }
}
