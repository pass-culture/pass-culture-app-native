import { getPriceAsNumber } from 'features/search/helpers/getPriceAsNumber/getPriceAsNumber'

describe('getPriceAsNumber', () => {
  it('should return the price as number when it entered', () => {
    const price = getPriceAsNumber('1,99')
    expect(price).toStrictEqual(1.99)
  })

  it('should return the default price as number when it not entered', () => {
    const price = getPriceAsNumber(undefined, 0)
    expect(price).toStrictEqual(0)
  })
})
