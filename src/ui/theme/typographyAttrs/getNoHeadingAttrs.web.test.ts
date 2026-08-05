import { getNoHeadingAttrs } from 'ui/theme/typographyAttrs/getNoHeadingAttrs'

describe('getNoHeadingAttrs()', () => {
  it('should return accessibilityLevel as p', () => {
    expect(getNoHeadingAttrs()).toEqual({
      accessibilityRole: undefined,
      accessibilityLevel: 'p',
    })
  })
})
