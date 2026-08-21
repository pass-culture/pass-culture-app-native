import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { getTextSemanticAttrs } from 'ui/theme/typographyAttrs/getTextSemanticAttrs'

describe('getTextSemanticAttrs()', () => {
  it.each`
    headingLevel | accessibilityLevel | accessibilityRole
    ${'h1'}      | ${'h1'}            | ${AccessibilityRole.HEADER}
    ${'h2'}      | ${'h2'}            | ${AccessibilityRole.HEADER}
    ${'h3'}      | ${'h3'}            | ${AccessibilityRole.HEADER}
    ${'h4'}      | ${'h4'}            | ${AccessibilityRole.HEADER}
    ${'p'}       | ${'p'}             | ${AccessibilityRole.TEXT}
    ${'span'}    | ${'span'}          | ${AccessibilityRole.TEXT}
  `(
    "getTextSemanticAttrs($headingLevel) = {accessibilityRole: $accessibilityRole, accessibilityLevel: $accessibilityLevel, dir: 'ltr'}",
    ({ headingLevel, accessibilityLevel, accessibilityRole }) => {
      expect(getTextSemanticAttrs(headingLevel)).toEqual({ accessibilityRole, accessibilityLevel })
    }
  )
})
