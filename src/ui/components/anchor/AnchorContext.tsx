import React, { createContext, useContext, useRef, RefObject, useMemo, useCallback } from 'react'
import { ScrollView, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useTheme } from 'styled-components/native'

import { AnchorName } from 'ui/components/anchor/anchor-name'

type AnchorContextType = {
  registerAnchor: (name: AnchorName, ref: RefObject<View | null>) => void
  scrollToAnchor: (name: AnchorName) => void
}

const AnchorContext = createContext<AnchorContextType | undefined>(undefined)

type AnchorProviderProps = {
  scrollViewRef: RefObject<ScrollView | null>
  handleCheckScrollY(): number
  children: React.ReactNode
  offset?: number
}

export const AnchorProvider = ({
  scrollViewRef,
  handleCheckScrollY,
  offset = 0,
  children,
}: AnchorProviderProps) => {
  const { top } = useSafeAreaInsets()
  const { appBarHeight, isDesktopViewport, navTopHeight, isTabletViewport } = useTheme()

  const anchors = useRef<Partial<Record<AnchorName, RefObject<View | null>>>>({})

  const registerAnchor = useCallback((name: AnchorName, ref: RefObject<View | null>) => {
    anchors.current[name] = ref
  }, [])

  const headerHeight = isTabletViewport || isDesktopViewport ? navTopHeight : 0

  const scrollToAnchor = useCallback(
    (name: AnchorName) => {
      const anchorRef = anchors.current[name]
      if (anchorRef?.current) {
        anchorRef?.current.measure(
          (
            _x: number,
            _y: number,
            _width: number,
            _height: number,
            _pageX: number,
            pageY: number
          ) => {
            const currentPageScroll = handleCheckScrollY()
            scrollViewRef.current?.scrollTo({
              y: pageY + currentPageScroll - appBarHeight - headerHeight - top - offset,
              animated: true,
            })
          }
        )
      }
    },
    [appBarHeight, handleCheckScrollY, headerHeight, offset, scrollViewRef, top]
  )

  const value = useMemo(
    () => ({
      registerAnchor,
      scrollToAnchor,
    }),
    [registerAnchor, scrollToAnchor]
  )

  return <AnchorContext.Provider value={value}>{children}</AnchorContext.Provider>
}

export const useScrollToAnchor = () => {
  const context = useContext(AnchorContext)

  if (!context) {
    throw new Error('useScrollToAnchor must be used within an AnchorProvider.')
  }

  return context.scrollToAnchor
}

export const useRegisterAnchor = () => {
  const context = useContext(AnchorContext)

  if (!context) {
    throw new Error('useRegisterAnchor must be used within an AnchorProvider.')
  }

  return context.registerAnchor
}
