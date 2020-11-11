import { ColorsEnum } from 'ui/theme'

export interface IconInterface {
  size?: number | string
  color?: ColorsEnum
  testID?: string
}

export interface BicolorIconInterface extends IconInterface {
  color2?: ColorsEnum
}
