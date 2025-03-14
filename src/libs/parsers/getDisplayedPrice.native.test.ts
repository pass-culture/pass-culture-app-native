import { Currency } from 'shared/currency/useGetCurrencyToDisplay'
import { DEFAULT_PACIFIC_FRANC_TO_EURO_RATE } from 'shared/exchangeRates/defaultRateValues'

import { getDisplayedPrice } from './getDisplayedPrice'

describe('getDisplayedPrice', () => {
  it.each`
    prices               | currency                        | expected
    ${undefined}         | ${Currency.EURO}                | ${''}
    ${[]}                | ${Currency.EURO}                | ${''}
    ${[0]}               | ${Currency.EURO}                | ${'Gratuit'}
    ${[0, 700]}          | ${Currency.EURO}                | ${'Gratuit'}
    ${[100]}             | ${Currency.EURO}                | ${'Dès 1\u00a0€'}
    ${[200]}             | ${Currency.EURO}                | ${'Dès 2\u00a0€'}
    ${[345]}             | ${Currency.EURO}                | ${'Dès 3,45\u00a0€'}
    ${[350]}             | ${Currency.EURO}                | ${'Dès 3,50\u00a0€'}
    ${[560, 300]}        | ${Currency.EURO}                | ${'Dès 3\u00a0€'}
    ${[200, 1000, 3000]} | ${Currency.EURO}                | ${'Dès 2\u00a0€'}
    ${[-300, 560]}       | ${Currency.EURO}                | ${'Dès 5,60\u00a0€'}
    ${[800, 800]}        | ${Currency.EURO}                | ${'Dès 8\u00a0€'}
    ${[100]}             | ${Currency.PACIFIC_FRANC_SHORT} | ${'Dès 120\u00a0F'}
  `(
    'getDisplayedPrice($prices) \t= $expected without format price options',
    ({ prices, currency, expected }) => {
      expect(getDisplayedPrice(prices, currency, DEFAULT_PACIFIC_FRANC_TO_EURO_RATE)).toBe(expected)
    }
  )

  it.each`
    prices               | currency                        | isDuoDisplayable | isPricefix   | expected
    ${undefined}         | ${Currency.EURO}                | ${undefined}     | ${undefined} | ${''}
    ${[]}                | ${Currency.EURO}                | ${undefined}     | ${undefined} | ${''}
    ${[0]}               | ${Currency.EURO}                | ${true}          | ${undefined} | ${'Gratuit'}
    ${[0, 700]}          | ${Currency.EURO}                | ${false}         | ${undefined} | ${'Gratuit'}
    ${[100]}             | ${Currency.EURO}                | ${false}         | ${undefined} | ${'Dès 1,00\u00a0€'}
    ${[200]}             | ${Currency.EURO}                | ${true}          | ${undefined} | ${'Dès 2,00\u00a0€ - Duo'}
    ${[345]}             | ${Currency.EURO}                | ${false}         | ${undefined} | ${'Dès 3,45\u00a0€'}
    ${[350]}             | ${Currency.EURO}                | ${undefined}     | ${undefined} | ${'Dès 3,50\u00a0€'}
    ${[560, 300]}        | ${Currency.EURO}                | ${undefined}     | ${undefined} | ${'Dès 3,00\u00a0€'}
    ${[200, 1000, 3000]} | ${Currency.EURO}                | ${undefined}     | ${undefined} | ${'Dès 2,00\u00a0€'}
    ${[-300, 560]}       | ${Currency.EURO}                | ${undefined}     | ${undefined} | ${'Dès 5,60\u00a0€'}
    ${[800, 800]}        | ${Currency.EURO}                | ${undefined}     | ${undefined} | ${'Dès 8,00\u00a0€'}
    ${[100]}             | ${Currency.PACIFIC_FRANC_SHORT} | ${true}          | ${undefined} | ${'Dès 120\u00a0F - Duo'}
    ${[100]}             | ${Currency.PACIFIC_FRANC_SHORT} | ${undefined}     | ${true}      | ${'120\u00a0F'}
    ${[800]}             | ${Currency.EURO}                | ${undefined}     | ${true}      | ${'8,00\u00a0€'}
    ${[800]}             | ${Currency.EURO}                | ${true}          | ${true}      | ${'8,00\u00a0€ - Duo'}
    ${[560, 300]}        | ${Currency.EURO}                | ${undefined}     | ${true}      | ${'3,00\u00a0€'}
  `(
    'getDisplayedPrice($prices) \t= $expected with format price options',
    ({ prices, currency, isDuoDisplayable, isPricefix, expected }) => {
      expect(
        getDisplayedPrice(
          prices,
          currency,
          DEFAULT_PACIFIC_FRANC_TO_EURO_RATE,
          isDuoDisplayable,
          {
            fractionDigits: 2,
          },
          isPricefix
        )
      ).toBe(expected)
    }
  )
})
