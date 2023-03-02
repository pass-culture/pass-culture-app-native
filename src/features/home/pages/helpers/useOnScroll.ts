import { NativeScrollEvent, NativeSyntheticEvent, Platform } from 'react-native'

import { useDebounce } from 'ui/hooks/useDebounce'

export const useOnScroll = (listener: (e: NativeSyntheticEvent<NativeScrollEvent>) => void) => {
  const debouncedScrollListener = useDebounce(listener, 400)
  const scrollListener = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    // In React-Native only, the event is not usable several milliseconds after its throw
    // so we need to persist it, if we want to access its value in a debounced function.
    // https://reactjs.org/docs/legacy-event-pooling.html
    if (Platform.OS !== 'web') e.persist()

    debouncedScrollListener(e)
  }

  return { onScroll: scrollListener }
}
