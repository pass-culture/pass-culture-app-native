import {
  STANDARD_ICON_SIZE,
  SMALL_ICON_SIZE,
  SMALLER_ICON_SIZE,
  EXTRA_SMALL_ICON_SIZE,
} from './constants'

export type IconSizesType = {
  standard: number
  small: number
  smaller: number
  extraSmall: number
}

export const iconSizes: IconSizesType = {
  standard: STANDARD_ICON_SIZE,
  small: SMALL_ICON_SIZE,
  smaller: SMALLER_ICON_SIZE,
  extraSmall: EXTRA_SMALL_ICON_SIZE,
}
