import { getDisplayPrice, getDisplayPriceWithDuoMention } from '../getDisplayPrice'

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
