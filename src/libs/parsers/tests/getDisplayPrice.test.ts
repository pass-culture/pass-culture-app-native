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
    ${[100]}             | ${'1 €'}
    ${[200]}             | ${'2 €'}
    ${[345]}             | ${'3,45 €'}
    ${[350]}             | ${'3,50 €'}
    ${[560, 300]}        | ${'Dès 3 €'}
    ${[200, 1000, 3000]} | ${'Dès 2 €'}
    ${[-300, 560]}       | ${'5,60 €'}
    ${[800, 800]}        | ${'8 €'}
  `('getDisplayPrice($prices) \t= $expected', ({ prices, expected }) => {
    expect(getDisplayPrice(prices)).toBe(expected)
  })

  it.each`
    prices               | expected
    ${undefined}         | ${''}
    ${[]}                | ${''}
    ${[0]}               | ${'Gratuit'}
    ${[0, 700]}          | ${'Gratuit'}
    ${[100]}             | ${'1 € / place'}
    ${[200]}             | ${'2 € / place'}
    ${[345]}             | ${'3,45 € / place'}
    ${[200, 1000, 3000]} | ${'Dès 2 € / place'}
    ${[560, 300]}        | ${'Dès 3 € / place'}
    ${[-300, 560]}       | ${'5,60 € / place'}
    ${[800, 800]}        | ${'8 € / place'}
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
    ${1000}      | ${null}      | ${'10 €'}
    ${null}      | ${0}         | ${'Dès 0 €'}
    ${null}      | ${1000}      | ${'Dès 10 €'}
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
    ${0}         | ${'0 €'}
    ${500}       | ${'5 €'}
    ${-500}      | ${'-5 €'}
    ${1050}      | ${'10,50 €'}
    ${-1050}     | ${'-10,50 €'}
    ${1110}      | ${'11,10 €'}
    ${-1110}     | ${'-11,10 €'}
    ${1190}      | ${'11,90 €'}
    ${-1190}     | ${'-11,90 €'}
    ${1199}      | ${'11,99 €'}
    ${-1199}     | ${'-11,99 €'}
    ${1199.6}    | ${'12,00 €'}
    ${-1199.6}   | ${'-12,00 €'}
  `('formatToFrenchDecimal($priceInCents) \t= $expected', ({ priceInCents, expected }) => {
    expect(formatToFrenchDecimal(priceInCents)).toBe(expected)
  })
})
