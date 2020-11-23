import { ColorsEnum } from 'ui/theme'

export interface IconInterface {
  size?: number | string
  color?: ColorsEnum
  testID?: string
}

export interface RectangleIconInterface {
  width?: number | string
  height?: number | string
  color?: ColorsEnum
  testID?: string
}

export interface BicolorIconInterface extends IconInterface {
  color2?: ColorsEnum
  thin?: boolean
}
