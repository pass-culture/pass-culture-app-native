import { useGetFavoriteDisplayPrice } from './useGetFavoriteDisplayPrice'

describe('getFavoriteDisplayPrice', () => {
  it.each`
    price        | startPrice   | expected
    ${undefined} | ${undefined} | ${undefined}
    ${null}      | ${null}      | ${undefined}
    ${0}         | ${null}      | ${'Gratuit'}
    ${1000}      | ${null}      | ${'10\u00a0€'}
    ${null}      | ${0}         | ${'Dès 0\u00a0€'}
    ${null}      | ${1000}      | ${'Dès 10\u00a0€'}
  `(
    'getFavoriteDisplayPrice({ price: $price, startPrice: $startPrice }) \t= $expected',
    ({ price, startPrice, expected }) => {
      expect(
        useGetFavoriteDisplayPrice({
          price,
          startPrice,
        })
      ).toBe(expected)
    }
  )
})
