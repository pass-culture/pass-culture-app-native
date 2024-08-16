import { createContext, RefObject } from 'react'
import { NativeScrollEvent, NativeSyntheticEvent, ScrollView, View } from 'react-native'

export type ScrollContextType = {
  addScrollListener(listener: (event: NativeSyntheticEvent<NativeScrollEvent>) => void): void
  scrollViewRef: RefObject<ScrollView>
  stickyElements: Record<string, React.JSX.Element>
  registerElement: (id: string, ref: RefObject<View>, element: React.JSX.Element) => void
}

export const ScrollContext = createContext<ScrollContextType | undefined>(undefined)
