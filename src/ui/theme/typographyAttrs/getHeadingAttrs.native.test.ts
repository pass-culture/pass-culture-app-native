import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

describe('getHeadingAttrs()', () => {
  it.each`
    headingLevel | accessibilityLevel | accessibilityRole
    ${1}         | ${undefined}       | ${AccessibilityRole.HEADER}
    ${2}         | ${undefined}       | ${AccessibilityRole.HEADER}
    ${3}         | ${undefined}       | ${AccessibilityRole.HEADER}
    ${4}         | ${undefined}       | ${AccessibilityRole.HEADER}
    ${5}         | ${undefined}       | ${AccessibilityRole.HEADER}
    ${6}         | ${undefined}       | ${AccessibilityRole.HEADER}
  `(
    "getHeadingAttrs($headingLevel) = {accessibilityRole: $accessibilityRole, accessibilityLevel: $accessibilityLevel, dir: 'ltr'}",
    ({ headingLevel, accessibilityLevel, accessibilityRole }) => {
      expect(getHeadingAttrs(headingLevel)).toEqual({
        accessibilityRole,
        accessibilityLevel,
      })
    }
  )
})
