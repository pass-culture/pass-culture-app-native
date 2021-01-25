import { getDisplayPrice, getDisplayPriceWithDuoMention } from '../getDisplayPrice'

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
    ${[3.5]}       | ${'3,50 €'}
    ${[5.6, 3.0]}  | ${'Dès 3 €'}
    ${[-3.0, 5.6]} | ${'5,60 €'}
    ${[8, 8]}      | ${'8 €'}
  `('getDisplayPrice($prices) \t= $expected', ({ prices, expected }) => {
    expect(getDisplayPrice(prices)).toBe(expected)
  })

  it.each`
    prices         | expected
    ${undefined}   | ${''}
    ${[]}          | ${''}
    ${[0]}         | ${'Gratuit'}
    ${[0.0, 7]}    | ${'Gratuit'}
    ${[1]}         | ${'1 € / place'}
    ${[2.0]}       | ${'2 € / place'}
    ${[3.45]}      | ${'3,45 € / place'}
    ${[5.6, 3.0]}  | ${'Dès 3 € / place'}
    ${[-3.0, 5.6]} | ${'5,60 € / place'}
    ${[8, 8]}      | ${'8 € / place'}
  `('getDisplayPriceWithDuoMention($prices) \t= $expected', ({ prices, expected }) => {
    expect(getDisplayPriceWithDuoMention(prices)).toBe(expected)
  })
})
