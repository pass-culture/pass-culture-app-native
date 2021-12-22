import {
  getDisplayPrice,
  getDisplayPriceWithDuoMention,
  getFavoriteDisplayPrice,
  formatToFrenchDecimal,
} from '../getDisplayPrice'

describe('getDisplayPrice', () => {
  it.each`
    prices               | expected
    ${undefined}         | ${''}
    ${[]}                | ${''}
    ${[0]}               | ${'Gratuit'}
    ${[0, 700]}          | ${'Gratuit'}
    ${[100]}             | ${'1\u00a0€'}
    ${[200]}             | ${'2\u00a0€'}
    ${[345]}             | ${'3,45\u00a0€'}
    ${[350]}             | ${'3,50\u00a0€'}
    ${[560, 300]}        | ${'Dès 3\u00a0€'}
    ${[200, 1000, 3000]} | ${'Dès 2\u00a0€'}
    ${[-300, 560]}       | ${'5,60\u00a0€'}
    ${[800, 800]}        | ${'8\u00a0€'}
  `('getDisplayPrice($prices) \t= $expected', ({ prices, expected }) => {
    expect(getDisplayPrice(prices)).toBe(expected)
  })

  it.each`
    prices               | expected
    ${undefined}         | ${''}
    ${[]}                | ${''}
    ${[0]}               | ${'Gratuit'}
    ${[0, 700]}          | ${'Gratuit'}
    ${[100]}             | ${'1\u00a0€ / place'}
    ${[200]}             | ${'2\u00a0€ / place'}
    ${[345]}             | ${'3,45\u00a0€ / place'}
    ${[200, 1000, 3000]} | ${'Dès 2\u00a0€ / place'}
    ${[560, 300]}        | ${'Dès 3\u00a0€ / place'}
    ${[-300, 560]}       | ${'5,60\u00a0€ / place'}
    ${[800, 800]}        | ${'8\u00a0€ / place'}
  `('getDisplayPriceWithDuoMention($prices) \t= $expected', ({ prices, expected }) => {
    expect(getDisplayPriceWithDuoMention(prices)).toBe(expected)
  })
})

describe('getFavoriteDisplayPrice', () => {
  it.each`
    price        | startPrice   | expected
    ${undefined} | ${undefined} | ${''}
    ${null}      | ${null}      | ${''}
    ${0}         | ${null}      | ${'Gratuit'}
    ${1000}      | ${null}      | ${'10\u00a0€'}
    ${null}      | ${0}         | ${'Dès 0\u00a0€'}
    ${null}      | ${1000}      | ${'Dès 10\u00a0€'}
  `(
    'getFavoriteDisplayPrice({ price: $price, startPrice: $startPrice }) \t= $expected',
    ({ price, startPrice, expected }) => {
      expect(
        getFavoriteDisplayPrice({
          price,
          startPrice,
        })
      ).toBe(expected)
    }
  )
})

describe('formatToFrenchDecimal()', () => {
  it.each`
    priceInCents | expected
    ${0}         | ${'0\u00a0€'}
    ${500}       | ${'5\u00a0€'}
    ${-500}      | ${'-5\u00a0€'}
    ${1050}      | ${'10,50\u00a0€'}
    ${-1050}     | ${'-10,50\u00a0€'}
    ${1110}      | ${'11,10\u00a0€'}
    ${-1110}     | ${'-11,10\u00a0€'}
    ${1190}      | ${'11,90\u00a0€'}
    ${-1190}     | ${'-11,90\u00a0€'}
    ${1199}      | ${'11,99\u00a0€'}
    ${-1199}     | ${'-11,99\u00a0€'}
    ${1199.6}    | ${'12,00\u00a0€'}
    ${-1199.6}   | ${'-12,00\u00a0€'}
  `('formatToFrenchDecimal($priceInCents) \t= $expected', ({ priceInCents, expected }) => {
    expect(formatToFrenchDecimal(priceInCents)).toBe(expected)
  })
})
