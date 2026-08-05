import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { HeadingAttrs, HeadingLevel } from 'ui/theme/typographyAttrs/types'

export const getHeadingAttrs = (_level: HeadingLevel): HeadingAttrs => ({
  accessibilityRole: AccessibilityRole.HEADER,
  accessibilityLevel: undefined,
})
