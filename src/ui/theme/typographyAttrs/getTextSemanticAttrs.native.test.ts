import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { getTextSemanticAttrs } from 'ui/theme/typographyAttrs/getTextSemanticAttrs'

describe('getTextSemanticAttrs()', () => {
  it.each`
    headingLevel | accessibilityLevel | accessibilityRole
    ${1}         | ${undefined}       | ${AccessibilityRole.HEADER}
    ${2}         | ${undefined}       | ${AccessibilityRole.HEADER}
    ${3}         | ${undefined}       | ${AccessibilityRole.HEADER}
    ${4}         | ${undefined}       | ${AccessibilityRole.HEADER}
    ${5}         | ${undefined}       | ${AccessibilityRole.HEADER}
    ${6}         | ${undefined}       | ${AccessibilityRole.HEADER}
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
