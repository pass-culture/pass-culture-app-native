import React, { createContext, useContext, useRef, RefObject, useMemo, useCallback } from 'react'
import { ScrollView, View } from 'react-native'

import { AnchorName } from 'ui/components/anchor/anchor-name'

type AnchorContextType = {
  registerAnchor: (name: AnchorName, ref: RefObject<View>) => void
  scrollToAnchor: (name: AnchorName) => void
}

const AnchorContext = createContext<AnchorContextType | undefined>(undefined)

type AnchorProviderProps = {
  scrollViewRef: RefObject<ScrollView>
  handleCheckScrollY(): number
  children: React.ReactNode
}

export const AnchorProvider = ({
  scrollViewRef,
  handleCheckScrollY,
  children,
}: AnchorProviderProps) => {
  const anchors = useRef<Record<AnchorName, RefObject<View>>>(
    {} as Record<AnchorName, RefObject<View>>
  )

  const registerAnchor = useCallback((name: AnchorName, ref: RefObject<View>) => {
    anchors.current[name] = ref
  }, [])

  const scrollToAnchor = useCallback(
    (name: AnchorName) => {
      const anchorRef = anchors.current[name]
      if (anchorRef?.current) {
        anchorRef?.current.measure(
          (
            _x: number,
            _y: number,
            _width: number,
            height: number,
            _pageX: number,
            pageY: number
          ) => {
            const currentPageScroll = handleCheckScrollY()
            scrollViewRef.current?.scrollTo({
              y: pageY + currentPageScroll - height,
              animated: true,
            })
          }
        )
      }
    },
    [handleCheckScrollY, scrollViewRef]
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
