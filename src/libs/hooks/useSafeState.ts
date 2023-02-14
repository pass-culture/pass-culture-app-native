import { Dispatch, SetStateAction, useCallback, useState } from 'react'

import useIsMounted from './useIsMounted'

export default function useSafeState<State>(
  initialState: State | (() => State)
): [State, Dispatch<SetStateAction<State>>] {
  const [state, setState] = useState(initialState)

  const isMounted = useIsMounted()

  const safeSetState = useCallback(
    (newState: SetStateAction<State>): void => {
      if (isMounted.current) {
        setState(newState)
      } else {
        // eslint-disable-next-line no-console
        console.log(
          // eslint-disable-next-line local-rules/apostrophe-in-text
          `Warning: Can't call setState on an unmounted component. 
          This is a no-op, but it indicates a memory leak in your application. 
          To fix, cancel all subscriptions and asynchronous tasks in 
          the return function of useEffect().`
        )
      }
    },
    [isMounted]
  )

  return [state, safeSetState]
}
