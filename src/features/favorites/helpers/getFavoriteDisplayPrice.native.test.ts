import { Currency } from 'shared/currency/useGetCurrencyToDisplay'
import { DEFAULT_PACIFIC_FRANC_TO_EURO_RATE } from 'shared/exchangeRates/defaultRateValues'

import { getFavoriteDisplayPrice } from './getFavoriteDisplayPrice'

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
        getFavoriteDisplayPrice({
          currency: Currency.EURO,
          euroToPacificFrancRate: DEFAULT_PACIFIC_FRANC_TO_EURO_RATE,
          price,
          startPrice,
        })
      ).toBe(expected)
    }
  )
})
