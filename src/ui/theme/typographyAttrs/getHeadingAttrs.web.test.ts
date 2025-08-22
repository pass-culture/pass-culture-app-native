import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

describe('getHeadingAttrs()', () => {
  it.each`
    headingLevel | accessibilityLevel | accessibilityRole
    ${1}         | ${1}               | ${AccessibilityRole.HEADING}
    ${2}         | ${2}               | ${AccessibilityRole.HEADING}
    ${3}         | ${3}               | ${AccessibilityRole.HEADING}
    ${4}         | ${4}               | ${AccessibilityRole.HEADING}
    ${5}         | ${5}               | ${AccessibilityRole.HEADING}
    ${6}         | ${6}               | ${AccessibilityRole.HEADING}
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
