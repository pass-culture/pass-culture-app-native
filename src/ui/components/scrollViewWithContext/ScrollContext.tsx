import { createContext, RefObject } from 'react'
import { NativeScrollEvent, NativeSyntheticEvent, View } from 'react-native'

export type ScrollContextType = {
  addScrollListener(listener: (event: NativeSyntheticEvent<NativeScrollEvent>) => void): void
  registerElement: (id: string, ref: RefObject<View>, element: React.JSX.Element) => void
  rerenderElement: (id: string, ref: RefObject<View>, element: React.JSX.Element) => void
}

export const ScrollContext = createContext<ScrollContextType | undefined>(undefined)
