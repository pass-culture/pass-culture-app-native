import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

describe('getHeadingAttrs()', () => {
  it.each`
    headingLevel | ariaLevel
    ${1}         | ${1}
    ${2}         | ${2}
    ${3}         | ${3}
    ${4}         | ${4}
    ${5}         | ${5}
    ${6}         | ${6}
  `(
    "getHeadingAttrs($headingLevel) = {accessibilityRole: 'header', aria-level: $display, dir: 'ltr'}",
    ({ headingLevel, ariaLevel }) => {
      expect(getHeadingAttrs(headingLevel)).toEqual({
        accessibilityRole: 'header',
        'aria-level': ariaLevel,
        dir: 'ltr',
      })
    }
  )
})
