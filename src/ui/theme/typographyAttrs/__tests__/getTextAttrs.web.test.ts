import { getTextAttrs } from 'ui/theme/typographyAttrs/getTextAttrs'

describe('getTextAttrs()', () => {
  it('should return dir with "ltr" by default', () => {
    expect(getTextAttrs()).toEqual({ dir: 'ltr' })
  })

  it('should return dir with custom value', () => {
    const dir = 'rtl'
    expect(getTextAttrs(dir)).toEqual({ dir })
  })
})
