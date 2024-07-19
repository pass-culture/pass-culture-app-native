import React, { forwardRef, useCallback, useMemo, useImperativeHandle, useRef } from 'react'
import { NativeScrollEvent, NativeSyntheticEvent, ScrollView, ScrollViewProps } from 'react-native'
import { IOScrollView } from 'react-native-intersection-observer'

import { ScrollContext, ScrollContextType } from './ScrollContext'

const ScrollViewWithContext = forwardRef<ScrollView, ScrollViewProps>(
  ({ children, onScroll, ...props }, ref) => {
    const scrollViewRef = useRef<ScrollView>(null)
    useImperativeHandle(ref, () => scrollViewRef.current as ScrollView)

    const onScrollListeners: ScrollViewProps['onScroll'][] = useMemo(() => [onScroll], [onScroll])

    const contextValue: ScrollContextType = useMemo(
      () => ({
        addScrollListener: (listener: (event: NativeSyntheticEvent<NativeScrollEvent>) => void) => {
          onScrollListeners.push(listener)
        },
        scrollViewRef: scrollViewRef,
      }),
      [onScrollListeners, scrollViewRef]
    )

    const onInternalScroll = useCallback(
      (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        onScrollListeners.forEach((onScroll) => onScroll?.(event))
      },
      [onScrollListeners]
    )

    return (
      <ScrollContext.Provider value={contextValue}>
        <IOScrollView ref={scrollViewRef} onScroll={onInternalScroll} {...props}>
          {children}
        </IOScrollView>
      </ScrollContext.Provider>
    )
  }
)

ScrollViewWithContext.displayName = 'ScrollViewWithContext'

export default ScrollViewWithContext
