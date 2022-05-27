import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

describe('getHeadingAttrs()', () => {
  it.each`
    headingLevel | ariaLevel    | accessibilityRole
    ${0}         | ${undefined} | ${undefined}
    ${1}         | ${1}         | ${'header'}
    ${2}         | ${2}         | ${'header'}
    ${3}         | ${3}         | ${'header'}
    ${4}         | ${4}         | ${'header'}
    ${5}         | ${5}         | ${'header'}
    ${6}         | ${6}         | ${'header'}
  `(
    "getHeadingAttrs($headingLevel) = {accessibilityRole: $accessibilityRole, aria-level: $display, dir: 'ltr'}",
    ({ headingLevel, ariaLevel, accessibilityRole }) => {
      expect(getHeadingAttrs(headingLevel)).toEqual({
        accessibilityRole,
        'aria-level': ariaLevel,
        dir: 'ltr',
      })
    }
  )
})
