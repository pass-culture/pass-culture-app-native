import { createContext, RefObject, useContext } from 'react'
import { NativeScrollEvent, NativeSyntheticEvent, ScrollView } from 'react-native'

export type ScrollContextType = {
  addScrollListener(listener: (event: NativeSyntheticEvent<NativeScrollEvent>) => void): void
  scrollViewRef: RefObject<ScrollView>
}

export const ScrollContext = createContext<ScrollContextType | undefined>(undefined)

export const useScrollRef = () => {
  const context = useContext(ScrollContext)
  if (context === undefined) {
    throw new Error(
      'useScroll must be used within a ScrollViewWithContext, replace the ScrollView by a ScrollViewWithContext'
    )
  }
  return context.scrollViewRef
}

export const useOnScroll = (listener: (event: NativeSyntheticEvent<NativeScrollEvent>) => void) => {
  const context = useContext(ScrollContext)
  if (context === undefined) {
    throw new Error(
      'useScroll must be used within a ScrollViewWithContext, replace the ScrollView by a ScrollViewWithContext'
    )
  }
  context.addScrollListener(listener)
}
