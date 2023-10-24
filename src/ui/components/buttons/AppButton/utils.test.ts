import { getEffectiveBorderRadius } from './utils'

describe('getEffectiveBorderRadius', () => {
  it('should return the border radius if the border radius is not too high', () => {
    const buttonHeight = 40
    const borderRadius = 19

    expect(getEffectiveBorderRadius({ buttonHeight, borderRadius })).toEqual(19)
  })

  it('should return half of the height if the border radius is to high', () => {
    const buttonHeight = 40
    const borderRadius = 21

    expect(getEffectiveBorderRadius({ buttonHeight, borderRadius })).toEqual(20)
  })
})
