import React, {
  forwardRef,
  useCallback,
  useMemo,
  useImperativeHandle,
  useRef,
  useState,
  RefObject,
} from 'react'
import {
  View,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  ScrollViewProps,
} from 'react-native'
import { IOScrollView } from 'react-native-intersection-observer'
import styled from 'styled-components/native'

import { ScrollContext, ScrollContextType } from './ScrollContext'

const ScrollViewWithContext = forwardRef<
  ScrollView,
  ScrollViewProps & { sticky?: boolean; stickyOffset?: number }
>(({ children, onScroll, sticky, stickyOffset = 0, ...props }, ref) => {
  const scrollViewRef = useRef<ScrollView>(null)
  useImperativeHandle(ref, () => scrollViewRef.current as ScrollView)
  const [stickyElements, setStickyElements] = useState<Record<string, React.JSX.Element>>({})
  const elements = useRef<
    Record<string, { ref: RefObject<View>; element: () => React.JSX.Element }>
  >({})
  const anchorRef = useRef<View>(null)

  const onScrollListeners: ScrollViewProps['onScroll'][] = useMemo(() => [onScroll], [onScroll])

  const registerElement = useCallback(
    (id: string, ref: RefObject<View>, element: React.JSX.Element) => {
      elements.current[id] = { ref, element: () => element }
    },
    []
  )

  const rerenderElement = useCallback(
    (id: string, ref: RefObject<View>, element: React.JSX.Element) => {
      // const elementToUpdate = elements.current[id]
      // if (elementToUpdate) {
      //   const Element = () => element
      //   elements.current[id] = { ref, element: () => element }
      //   setStickyElements((stickyElements) => {
      //     if (!stickyElements[id]) {
      //       return stickyElements
      //     }
      //     return { ...stickyElements, [id]: <Element /> }
      //   })
      // }
    },
    []
  )

  const contextValue: ScrollContextType = useMemo(
    () => ({
      addScrollListener: (listener: (event: NativeSyntheticEvent<NativeScrollEvent>) => void) => {
        onScrollListeners.push(listener)
      },
      registerElement,
      rerenderElement,
    }),
    [onScrollListeners, registerElement, rerenderElement]
  )

  const onScrollStickyListener = useCallback(() => {
    let anchorY: number
    let anchorHeight: number

    anchorRef.current?.measureInWindow((_elementX, elementY, _elementWidth, elementHeight) => {
      anchorY = elementY
      anchorHeight = elementHeight
    })

    Object.keys(elements.current).forEach((id) => {
      elements.current[id]?.ref.current?.measureInWindow(
        (_elementX, elementY, _elementWidth, _elementHeight) => {
          const Element = elements.current[id]?.element
          elements.current[id]?.ref.current?.measure((_x, _y, _width, height) => {
            const breakpoint = anchorY + anchorHeight
            if (elementY <= breakpoint && !!Element && !stickyElements[id]) {
              setStickyElements((e) => ({ ...e, [id]: <Element /> }))
              return
            }
            if (elementY > breakpoint - height && stickyElements[id]) {
              const { [id]: _removedKey, ...newStickyElements } = stickyElements
              setStickyElements(newStickyElements)
            }
          })
        }
      )
    })
  }, [stickyElements])

  const onInternalScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (sticky) {
        onScrollStickyListener()
      }
      onScrollListeners.forEach((onScroll) => onScroll?.(event))
    },
    [onScrollListeners, onScrollStickyListener, sticky]
  )

  return (
    <ScrollContext.Provider value={contextValue}>
      {sticky ? (
        <StickyContainer stickyOffset={stickyOffset} ref={anchorRef}>
          {Object.values(stickyElements)}
        </StickyContainer>
      ) : null}
      <IOScrollView ref={scrollViewRef} onScroll={onInternalScroll} {...props}>
        {children}
      </IOScrollView>
    </ScrollContext.Provider>
  )
})

const StickyContainer = styled.View<{ stickyOffset: number }>(({ stickyOffset, theme }) => ({
  marginTop: stickyOffset,
  position: 'absolute',
  left: 0,
  right: 0,
  zIndex: theme.zIndex.header,
}))

ScrollViewWithContext.displayName = 'ScrollViewWithContext'

export default ScrollViewWithContext
