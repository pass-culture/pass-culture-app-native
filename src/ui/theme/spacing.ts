import { PixelRatio } from 'react-native'

const UNIT_SPACE_DP = 4

export const getSpacing = (numberOfSpaces: number): number =>
  PixelRatio.roundToNearestPixel(UNIT_SPACE_DP * numberOfSpaces)
export const getSpacingString = (numberOfSpaces: number): string =>
  `${getSpacing(numberOfSpaces)}px`
