import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

describe('getHeadingAttrs()', () => {
  it.each`
    accessibilityLevel
    ${1}
    ${2}
    ${3}
    ${4}
    ${'p'}
  `('should return accessibilityLevel $accessibilityLevel', ({ accessibilityLevel }) => {
    expect(getHeadingAttrs(accessibilityLevel)).toEqual({
      accessibilityRole: undefined,
      accessibilityLevel,
    })
  })
})
