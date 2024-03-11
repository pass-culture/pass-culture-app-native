import {
  getDisplayPrice,
  formatToFrenchDecimal,
  formatPriceInEuroToDisplayPrice,
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
  `(
    'getDisplayPrice($prices) \t= $expected without format price options',
    ({ prices, expected }) => {
      expect(getDisplayPrice(prices)).toBe(expected)
    }
  )

  it.each`
    prices               | expected
    ${undefined}         | ${''}
    ${[]}                | ${''}
    ${[0]}               | ${'Gratuit'}
    ${[0, 700]}          | ${'Gratuit'}
    ${[100]}             | ${'1,00\u00a0€'}
    ${[200]}             | ${'2,00\u00a0€'}
    ${[345]}             | ${'3,45\u00a0€'}
    ${[350]}             | ${'3,50\u00a0€'}
    ${[560, 300]}        | ${'Dès 3,00\u00a0€'}
    ${[200, 1000, 3000]} | ${'Dès 2,00\u00a0€'}
    ${[-300, 560]}       | ${'5,60\u00a0€'}
    ${[800, 800]}        | ${'8,00\u00a0€'}
  `('getDisplayPrice($prices) \t= $expected with format price options', ({ prices, expected }) => {
    expect(getDisplayPrice(prices, { fractionDigits: 2 })).toBe(expected)
  })
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
  `(
    'formatToFrenchDecimal($priceInCents) \t= $expected without format price options',
    ({ priceInCents, expected }) => {
      expect(formatToFrenchDecimal(priceInCents)).toBe(expected)
    }
  )

  it.each`
    priceInCents | expected
    ${0}         | ${'0,00\u00a0€'}
    ${500}       | ${'5,00\u00a0€'}
    ${-500}      | ${'-5,00\u00a0€'}
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
  `(
    'formatToFrenchDecimal($priceInCents) \t= $expected with format price options',
    ({ priceInCents, expected }) => {
      expect(formatToFrenchDecimal(priceInCents, { fractionDigits: 2 })).toBe(expected)
    }
  )
})

describe('formatPriceInEuroToDisplayPrice()', () => {
  it.each`
    priceInEuro | expected
    ${0}        | ${'0\u00a0€'}
    ${50}       | ${'50\u00a0€'}
    ${-50}      | ${'-50\u00a0€'}
    ${10.5}     | ${'10,50\u00a0€'}
    ${-10.5}    | ${'-10,50\u00a0€'}
    ${17.9}     | ${'17,90\u00a0€'}
    ${19.99}    | ${'19,99\u00a0€'}
    ${-19.99}   | ${'-19,99\u00a0€'}
    ${20.999}   | ${'20,99\u00a0€'}
    ${-20.999}  | ${'-21\u00a0€'}
  `('formatPriceInEuroToDisplayPrice($priceInEuro) \t= $expected', ({ priceInEuro, expected }) => {
    expect(formatPriceInEuroToDisplayPrice(priceInEuro)).toBe(expected)
  })
})
