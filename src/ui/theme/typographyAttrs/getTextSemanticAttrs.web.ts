import { HeadingAttrs, TextSemanticLevel } from 'ui/theme/typographyAttrs/types'

export const getTextSemanticAttrs = (level: TextSemanticLevel): HeadingAttrs => ({
  accessibilityRole: undefined,
  accessibilityLevel: level,
})
