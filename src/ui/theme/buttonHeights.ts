import {
  TALL_BUTTON_HEIGHT,
  SMALL_BUTTON_HEIGHT,
  DEFAULT_INLINE_BUTTON_HEIGHT,
  EXTRA_SMALL_BUTTON_HEIGHT,
} from 'ui/theme/constants'

export type ButtonHeightsType = {
  tall: number
  small: number
  inline: number
  extraSmall: number
}

export const buttonHeights: ButtonHeightsType = {
  extraSmall: EXTRA_SMALL_BUTTON_HEIGHT,
  tall: TALL_BUTTON_HEIGHT,
  small: SMALL_BUTTON_HEIGHT,
  inline: DEFAULT_INLINE_BUTTON_HEIGHT,
}
