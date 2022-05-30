import { getNoHeadingAttrs } from 'ui/theme/typographyAttrs/getNoHeadingAttrs'

describe('getNoHeadingAttrs()', () => {
  it('should return accessibility attribute with no values', () => {
    expect(getNoHeadingAttrs()).toEqual({
      accessibilityRole: undefined,
      'aria-level': undefined,
      dir: 'ltr',
    })
  })
})
