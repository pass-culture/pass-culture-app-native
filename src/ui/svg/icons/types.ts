import { ViewStyle } from 'react-native'

import { ColorsTypeLegacy } from 'theme/types'

interface AccessibleIconSharedProperties {
  color?: ColorsTypeLegacy
  testID?: string
  style?: ViewStyle
  accessibilityLabel?: string
}

export interface AccessibleIcon extends AccessibleIconSharedProperties {
  size?: number | string
  opacity?: number
  backgroundColor?: ColorsTypeLegacy
  thin?: boolean
  badgeValue?: number
}

export interface AccessibleRectangleIcon extends AccessibleIconSharedProperties {
  width?: number | string
  height?: number | string
}
