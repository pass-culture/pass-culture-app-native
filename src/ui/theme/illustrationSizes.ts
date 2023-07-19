import {
  FULLPAGE_ILLUSTRATION_ICON_SIZE,
  ILLUSTRATION_ICON_SIZE,
  ILLUSTRATION_SMALL_SIZE,
} from './constants'

export type IllustrationSizesType = {
  fullPage: number
  medium: number
  small: number
}

export const illustrationSizes: IllustrationSizesType = {
  fullPage: FULLPAGE_ILLUSTRATION_ICON_SIZE,
  medium: ILLUSTRATION_ICON_SIZE,
  small: ILLUSTRATION_SMALL_SIZE,
}
