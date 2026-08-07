import { HeadingAttrs, HeadingLevel } from 'ui/theme/typographyAttrs/types'

export const getHeadingAttrs = (level: HeadingLevel): HeadingAttrs => ({
  accessibilityRole: undefined,
  accessibilityLevel: level,
})
