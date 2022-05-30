import { Platform } from 'react-native'

import { getTextAttrs } from 'ui/theme/typographyAttrs/getTextAttrs'

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6
export const getHeadingAttrs = (level: HeadingLevel) => {
  return Platform.OS === 'web'
    ? {
        accessibilityRole: 'header',
        'aria-level': level,
        ...getTextAttrs(),
      }
    : {}
}
