import { NativeScrollEvent, NativeSyntheticEvent, Platform } from 'react-native'

import { useOpacityTransition } from 'ui/animations/helpers/useOpacityTransition'
import { useDebounce } from 'ui/hooks/useDebounce'

export const useOnScroll = (listener: (e: NativeSyntheticEvent<NativeScrollEvent>) => void) => {
  const debouncedScrollListener = useDebounce(listener, 100)
  const scrollListener = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    // In React-Native only, the event is not usable several milliseconds after its throw
    // so we need to persist it, if we want to access its value in a debounced function.
    // https://reactjs.org/docs/legacy-event-pooling.html
    if (Platform.OS !== 'web') e.persist()

    debouncedScrollListener(e)
  }

  const { headerTransition: scrollButtonTransition, onScroll } = useOpacityTransition({
    listener: scrollListener,
  })

  return { scrollButtonTransition, onScroll }
}
