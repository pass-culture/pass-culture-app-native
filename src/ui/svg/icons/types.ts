import { ColorsEnum } from 'ui/theme'

interface IconSharedProperties {
  color?: ColorsEnum
  testID?: string
}

export interface IconInterface extends IconSharedProperties {
  size?: number | string
}

export interface RectangleIconInterface extends IconSharedProperties {
  width?: number | string
  height?: number | string
}

export interface BicolorIconInterface extends IconInterface {
  color2?: ColorsEnum
  thin?: boolean
}
