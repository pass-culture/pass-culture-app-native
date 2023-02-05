/* eslint-disable no-restricted-imports */
export * from 'react-native-animatable'

// To differentiate from RN View and Text
export { Text as AnimatedText, View as AnimatedView } from 'react-native-animatable'

export const NAV_DELAY_IN_MS = 200 // Standard delay to wait before triggering animation, to avoid animation component during navigation

export const pxToPercent = ({ startSize, endSize }: { startSize: number; endSize: number }) => {
  return startSize / endSize
}
