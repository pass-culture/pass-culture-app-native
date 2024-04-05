import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

describe('getHeadingAttrs()', () => {
  it.each`
    headingLevel | accessibilityLevel
    ${1}         | ${1}
    ${2}         | ${2}
    ${3}         | ${3}
    ${4}         | ${4}
    ${5}         | ${5}
    ${6}         | ${6}
  `(
    "getHeadingAttrs($headingLevel) = {accessibilityRole: 'heading', accessibilityLevel: $display, dir: 'ltr'}",
    ({ headingLevel, accessibilityLevel }) => {
      expect(getHeadingAttrs(headingLevel)).toEqual({
        accessibilityRole: AccessibilityRole.HEADING,
        accessibilityLevel,
      })
    }
  )
})
