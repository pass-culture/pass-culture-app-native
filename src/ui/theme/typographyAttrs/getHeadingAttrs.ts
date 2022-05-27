import { Platform } from 'react-native'

import { getTextAttrs } from 'ui/theme/typographyAttrs/getTextAttrs'

export type HeadingLevel = 0 | 1 | 2 | 3 | 4 | 5 | 6
export const getHeadingAttrs = (level: HeadingLevel) => {
  const headingLevel = level !== 0 ? level : undefined
  const accessibilityRole = headingLevel ? 'header' : undefined
  return Platform.OS === 'web'
    ? {
        accessibilityRole,
        'aria-level': headingLevel,
        ...getTextAttrs(),
      }
    : {}
}
