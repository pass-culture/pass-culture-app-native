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
}

export interface AccessibleIcon extends IconInterface {
  accessibilityLabel?: string
}

export interface BicolorIconInterface extends IconInterface {
  color2?: ColorsEnum | UniqueColors
  thin?: boolean
}

export interface RectangleIconInterface extends IconSharedProperties {
  width?: number | string
  height?: number | string
}
