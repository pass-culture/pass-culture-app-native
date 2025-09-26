/* eslint-disable no-restricted-imports */
// To differentiate from RN View and Text
export {
  createAnimatableComponent,
  Text as AnimatedText,
  View as AnimatedView,
} from 'react-native-animatable'
import { View } from 'react-native'
import { View as AnimatedView } from 'react-native-animatable'

export const NAV_DELAY_IN_MS = 200 // Standard delay to wait before triggering animation, to avoid animation component during navigation

export type AnimatedViewRefType = AnimatedView & View
