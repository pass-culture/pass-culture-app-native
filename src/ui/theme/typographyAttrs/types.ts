import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'

export type TextSemanticLevel = 1 | 2 | 3 | 4 | 'p' | 'span'

export type HeadingAttrs = {
  accessibilityRole?: AccessibilityRole
  accessibilityLevel?: TextSemanticLevel
}
