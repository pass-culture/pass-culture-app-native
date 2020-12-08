import { getDisplayPrice } from '../getDisplayPrice'

describe('getDisplayPrice', () => {
  it.each`
    prices         | expected
    ${undefined}   | ${''}
    ${[]}          | ${''}
    ${[0]}         | ${'Gratuit'}
    ${[0.0, 7]}    | ${'Gratuit'}
    ${[1]}         | ${'1 €'}
    ${[2.0]}       | ${'2 €'}
    ${[3.45]}      | ${'3,45 €'}
    ${[5.6, 3.0]}  | ${'Dès 3 €'}
    ${[-3.0, 5.6]} | ${'5,6 €'}
    ${[8, 8]}      | ${'8 €'}
  `('getDisplayPrice($prices) \t= $expected', ({ prices, expected }) => {
    expect(getDisplayPrice(prices)).toBe(expected)
  })
})
