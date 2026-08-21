import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'

export type TextSemanticLevel = 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span'

export type HeadingAttrs = {
  accessibilityRole?: AccessibilityRole
  accessibilityLevel?: TextSemanticLevel
}
