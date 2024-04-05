import { getNoHeadingAttrs } from 'ui/theme/typographyAttrs/getNoHeadingAttrs'

describe('getNoHeadingAttrs()', () => {
  it('should return an empty object in native', () => {
    expect(getNoHeadingAttrs()).toEqual({})
  })
})
