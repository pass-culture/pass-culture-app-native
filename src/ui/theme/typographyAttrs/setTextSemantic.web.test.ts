import { setTextSemantic } from 'ui/theme/typographyAttrs/setTextSemantic'

describe('setTextSemantic()', () => {
  it.each`
    accessibilityLevel
    ${1}
    ${2}
    ${3}
    ${4}
    ${'p'}
    ${'span'}
  `('should return accessibilityLevel $accessibilityLevel', ({ accessibilityLevel }) => {
    expect(setTextSemantic(accessibilityLevel)).toEqual({
      accessibilityRole: undefined,
      accessibilityLevel,
    })
  })
})
