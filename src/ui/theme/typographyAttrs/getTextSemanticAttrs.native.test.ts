import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { getTextSemanticAttrs } from 'ui/theme/typographyAttrs/getTextSemanticAttrs'

describe('getTextSemanticAttrs()', () => {
  it.each`
    headingLevel | accessibilityLevel | accessibilityRole
    ${1}         | ${1}               | ${AccessibilityRole.HEADER}
    ${2}         | ${2}               | ${AccessibilityRole.HEADER}
    ${3}         | ${3}               | ${AccessibilityRole.HEADER}
    ${4}         | ${4}               | ${AccessibilityRole.HEADER}
    ${'p'}       | ${'p'}             | ${AccessibilityRole.HEADER}
    ${'span'}    | ${'span'}          | ${AccessibilityRole.HEADER}
  `(
    "getTextSemanticAttrs($headingLevel) = {accessibilityRole: $accessibilityRole, accessibilityLevel: $accessibilityLevel, dir: 'ltr'}",
    ({ headingLevel, accessibilityLevel, accessibilityRole }) => {
      expect(getTextSemanticAttrs(headingLevel)).toEqual({
        accessibilityRole,
        accessibilityLevel,
      })
    }
  )
})
