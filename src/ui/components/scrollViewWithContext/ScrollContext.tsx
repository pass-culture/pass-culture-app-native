import { createContext, RefObject, useContext } from 'react'
import { NativeScrollEvent, NativeSyntheticEvent, ScrollView, View } from 'react-native'

export type ScrollContextType = {
  addScrollListener(listener: (event: NativeSyntheticEvent<NativeScrollEvent>) => void): void
  scrollViewRef: RefObject<ScrollView>
  stickyElements: Record<string, React.JSX.Element>
  registerElement: (id: string, ref: RefObject<View>, element: React.JSX.Element) => void
}

export const ScrollContext = createContext<ScrollContextType | undefined>(undefined)

export const useScrollRef = () => {
  const context = useContext(ScrollContext)
  if (context === undefined) {
    throw new Error(
      'useScrollRef must be used within a ScrollViewWithContext, replace the ScrollView by a ScrollViewWithContext'
    )
  }
  return context.scrollViewRef
}

export const useOnScroll = (listener: (event: NativeSyntheticEvent<NativeScrollEvent>) => void) => {
  const context = useContext(ScrollContext)
  if (context === undefined) {
    throw new Error(
      'useOnScroll must be used within a ScrollViewWithContext, replace the ScrollView by a ScrollViewWithContext'
    )
  }
  context.addScrollListener(listener)
}
