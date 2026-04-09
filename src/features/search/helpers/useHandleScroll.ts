import { Dispatch, MutableRefObject, SetStateAction, useCallback } from 'react'
import { NativeScrollEvent, NativeSyntheticEvent } from 'react-native'

import { isCloseToBottom } from 'libs/analytics'

type Params = {
  isBottomReachedRef: MutableRefObject<boolean>
  setIsBottomReached: Dispatch<SetStateAction<boolean>>
}

export const useHandleScroll = ({ isBottomReachedRef, setIsBottomReached }: Params) => {
  return useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const closeToBottom = isCloseToBottom(event.nativeEvent)
      if (closeToBottom !== isBottomReachedRef.current) {
        isBottomReachedRef.current = closeToBottom
        setIsBottomReached(closeToBottom)
      }
    },
    [isBottomReachedRef, setIsBottomReached]
  )
}
