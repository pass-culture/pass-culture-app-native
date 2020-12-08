import { getDisplayPrice } from '../getDisplayPrice'

describe('getDisplayPrice', () => {
  it.each`
    prices         | isDuo    | expected
    ${undefined}   | ${false} | ${''}
    ${[]}          | ${false} | ${''}
    ${[0]}         | ${false} | ${'Gratuit'}
    ${[0.0, 7]}    | ${false} | ${'Gratuit'}
    ${[1]}         | ${false} | ${'1 €'}
    ${[2.0]}       | ${false} | ${'2 €'}
    ${[3.45]}      | ${false} | ${'3,45 €'}
    ${[5.6, 3.0]}  | ${false} | ${'Dès 3 €'}
    ${[-3.0, 5.6]} | ${false} | ${'5,6 €'}
    ${[8, 8]}      | ${false} | ${'8 €'}
    ${[8, 8]}      | ${true}  | ${'8 € /place'}
    ${[0.0, 7]}    | ${true}  | ${'Gratuit'}
    ${[]}          | ${true}  | ${''}
    ${[3.45]}      | ${true}  | ${'3,45 € /place'}
    ${[9, 5, 2]}   | ${true}  | ${'Dès 2 € /place'}
  `('getDisplayPrice($prices) \t= $expected', ({ prices, isDuo, expected }) => {
    expect(getDisplayPrice(prices, isDuo)).toBe(expected)
  })
})
