import { Dispatch, SetStateAction, useState } from 'react'

import useIsMounted from './useIsMounted'

export default function useSafeState<State>(
  initialState: State | (() => State)
): [State, Dispatch<SetStateAction<State>>] {
  const [state, setState] = useState(initialState)

  const isMounted = useIsMounted()

  function safeSetState(newState: SetStateAction<State>): void {
    if (isMounted.current) {
      setState(newState)
    } else {
      // eslint-disable-next-line no-console
      console.log(
        `Warning: Can't call setState on an unmounted component. 
        This is a no-op, but it indicates a memory leak in your application. 
        To fix, cancel all subscriptions and asynchronous tasks in 
        the return function of useEffect().`
      )
    }
  }

  return [state, safeSetState]
}
