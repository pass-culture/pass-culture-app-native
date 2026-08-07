import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'

export type HeadingLevel = 1 | 2 | 3 | 4 | 'p'

export type HeadingAttrs = {
  accessibilityRole?: AccessibilityRole
  accessibilityLevel?: HeadingLevel
}
