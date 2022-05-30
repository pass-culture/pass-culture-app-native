import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

describe('getHeadingAttrs()', () => {
  it.each`
    headingLevel | display
    ${1}         | ${{}}
    ${2}         | ${{}}
    ${3}         | ${{}}
    ${4}         | ${{}}
    ${5}         | ${{}}
    ${6}         | ${{}}
  `('getHeadingAttrs($headingLevel) = $display', ({ headingLevel, display }) => {
    expect(getHeadingAttrs(headingLevel)).toEqual(display)
  })
})
