import { getTextAttrs } from 'ui/theme/typographyAttrs/getTextAttrs'

describe('getTextAttrs()', () => {
  it('should return an empty object in native', () => {
    expect(getTextAttrs()).toEqual({})
  })
})
