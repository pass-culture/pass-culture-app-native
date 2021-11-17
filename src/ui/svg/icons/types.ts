import { ViewStyle } from 'react-native'

import { ColorsEnum } from 'ui/theme'

interface IconSharedProperties {
  accessibilityLabel?: string
  accessible?: boolean
  color?: ColorsEnum
  testID?: string
  style?: ViewStyle
}

export interface IconInterface extends IconSharedProperties {
  size?: number | string
  opacity?: number
  color2?: ColorsEnum
}

export interface BicolorIconInterface extends IconInterface {
  color2?: ColorsEnum
  thin?: boolean
}

export interface RectangleIconInterface extends IconSharedProperties {
  width?: number | string
  height?: number | string
}
