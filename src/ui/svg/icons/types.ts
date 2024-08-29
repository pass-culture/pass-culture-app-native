import { ViewStyle } from 'react-native'

// eslint-disable-next-line no-restricted-imports
import { ColorsEnum, UniqueColors } from 'ui/theme/colors'

interface AccessibleIconSharedProperties {
  color?: ColorsEnum | UniqueColors
  testID?: string
  style?: ViewStyle
  accessibilityLabel?: string
}

export interface AccessibleIcon extends AccessibleIconSharedProperties {
  size?: number | string
  opacity?: number
  color2?: ColorsEnum | UniqueColors
  backgroundColor?: ColorsEnum | UniqueColors
}

export interface AccessibleBicolorIcon extends AccessibleIcon {
  color2?: ColorsEnum | UniqueColors
  thin?: boolean
  badgeValue?: number
}

export interface AccessibleRectangleIcon extends AccessibleIconSharedProperties {
  width?: number | string
  height?: number | string
}
