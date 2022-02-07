import {
  TALL_BUTTON_HEIGHT,
  SMALL_BUTTON_HEIGHT,
  DEFAULT_INLINE_BUTTON_HEIGHT,
} from 'ui/theme/constants'

export type ButtonHeightsType = {
  tall: number
  small: number
  inline: number
}

export const buttonHeights: ButtonHeightsType = {
  tall: TALL_BUTTON_HEIGHT,
  small: SMALL_BUTTON_HEIGHT,
  inline: DEFAULT_INLINE_BUTTON_HEIGHT,
}
