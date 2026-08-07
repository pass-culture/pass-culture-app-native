import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { HeadingAttrs, TextSemanticLevel } from 'ui/theme/typographyAttrs/types'

export const getTextSemanticAttrs = (level: TextSemanticLevel): HeadingAttrs => ({
  accessibilityRole: AccessibilityRole.HEADER,
  accessibilityLevel: level,
})
