import { ViewStyle } from 'react-native'

import { ColorsType } from 'theme/types'

interface AccessibleIconSharedProperties {
  color?: ColorsType
  testID?: string
  style?: ViewStyle
  accessibilityLabel?: string
}

export interface AccessibleIcon extends AccessibleIconSharedProperties {
  size?: number | string
  opacity?: number
  backgroundColor?: ColorsType
  thin?: boolean
  badgeValue?: number
}

export interface AccessibleRectangleIcon extends AccessibleIconSharedProperties {
  width?: number | string
  height?: number | string
}
