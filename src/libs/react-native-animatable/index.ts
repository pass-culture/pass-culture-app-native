/* eslint-disable no-restricted-imports */
export * from 'react-native-animatable'
import { RefObject } from 'react'
import { View, ViewProps, ViewStyle } from 'react-native'
import { AnimatableProperties, View as AnimatedView, Animation } from 'react-native-animatable'

// To differentiate from RN View and Text
export { Text as AnimatedText, View as AnimatedView } from 'react-native-animatable'

export const NAV_DELAY_IN_MS = 200 // Standard delay to wait before triggering animation, to avoid animation component during navigation

export const pxToPercent = ({ startSize, endSize }: { startSize: number; endSize: number }) => {
  return startSize / endSize
}

export type AnimatedViewRefType = AnimatedView & View

type AnimatedMethods = Partial<{
  [k in Animation]: (duration?: number) => Promise<{ finished: boolean }>
}>

export type AnimatedRef = RefObject<
  React.Component<AnimatableProperties<ViewStyle> & ViewProps, never, never> & AnimatedMethods
>
