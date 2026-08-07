import { getTextSemanticAttrs } from 'ui/theme/typographyAttrs/getTextSemanticAttrs'

describe('getTextSemanticAttrs()', () => {
  it.each`
    accessibilityLevel
    ${1}
    ${2}
    ${3}
    ${4}
    ${'p'}
    ${'span'}
  `('should return accessibilityLevel $accessibilityLevel', ({ accessibilityLevel }) => {
    expect(getTextSemanticAttrs(accessibilityLevel)).toEqual({
      accessibilityRole: undefined,
      accessibilityLevel,
    })
  })
})
