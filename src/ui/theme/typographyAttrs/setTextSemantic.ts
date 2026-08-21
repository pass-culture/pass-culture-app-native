import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { isHeadingLevel } from 'ui/theme/isHeadingLevel'
import { HeadingAttrs, TextSemanticLevel } from 'ui/theme/typographyAttrs/types'

export const setTextSemantic = (level: TextSemanticLevel): HeadingAttrs => ({
  accessibilityRole: isHeadingLevel(level) ? AccessibilityRole.HEADER : AccessibilityRole.TEXT,
  accessibilityLevel: level,
})
