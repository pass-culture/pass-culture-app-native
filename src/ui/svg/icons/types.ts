import { ViewStyle } from 'react-native'

// eslint-disable-next-line no-restricted-imports
import { ColorsEnum, UniqueColors } from 'ui/theme/colors'

interface IconSharedProperties {
  color?: ColorsEnum | UniqueColors
  testID?: string
  style?: ViewStyle
}

export interface IconInterface extends IconSharedProperties {
  size?: number | string
  opacity?: number
  color2?: ColorsEnum | UniqueColors
  backgroundColor?: ColorsEnum | UniqueColors
}

export interface AccessibleIcon extends IconInterface {
  accessibilityLabel?: string
}

export interface BicolorIconInterface extends IconInterface {
  color2?: ColorsEnum | UniqueColors
  thin?: boolean
}

export interface AccessibleBicolorIconInterface extends BicolorIconInterface {
  accessibilityLabel?: string
}

interface RectangleIconInterface extends IconSharedProperties {
  width?: number | string
  height?: number | string
}

export interface AccessibleRectangleIconInterface extends RectangleIconInterface {
  accessibilityLabel?: string
}
