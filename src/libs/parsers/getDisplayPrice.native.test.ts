import { DEFAULT_PACIFIC_FRANC_TO_EURO_RATE } from 'libs/firebase/firestore/exchangeRates/useGetPacificFrancToEuroRate'
import { Currency } from 'shared/currency/useGetCurrencyToDisplay'

import { getDisplayPrice } from './getDisplayPrice'

describe('getDisplayPrice', () => {
  it.each`
    prices               | currency                        | expected
    ${undefined}         | ${Currency.EURO}                | ${''}
    ${[]}                | ${Currency.EURO}                | ${''}
    ${[0]}               | ${Currency.EURO}                | ${'Gratuit'}
    ${[0, 700]}          | ${Currency.EURO}                | ${'Gratuit'}
    ${[100]}             | ${Currency.EURO}                | ${'1\u00a0€'}
    ${[200]}             | ${Currency.EURO}                | ${'2\u00a0€'}
    ${[345]}             | ${Currency.EURO}                | ${'3,45\u00a0€'}
    ${[350]}             | ${Currency.EURO}                | ${'3,50\u00a0€'}
    ${[560, 300]}        | ${Currency.EURO}                | ${'Dès 3\u00a0€'}
    ${[200, 1000, 3000]} | ${Currency.EURO}                | ${'Dès 2\u00a0€'}
    ${[-300, 560]}       | ${Currency.EURO}                | ${'5,60\u00a0€'}
    ${[800, 800]}        | ${Currency.EURO}                | ${'8\u00a0€'}
    ${[100]}             | ${Currency.PACIFIC_FRANC_SHORT} | ${'120\u00a0F'}
  `(
    'getDisplayPrice($prices) \t= $expected without format price options',
    ({ prices, currency, expected }) => {
      expect(getDisplayPrice(prices, currency, DEFAULT_PACIFIC_FRANC_TO_EURO_RATE)).toBe(expected)
    }
  )

  it.each`
    prices               | currency                        | expected
    ${undefined}         | ${Currency.EURO}                | ${''}
    ${[]}                | ${Currency.EURO}                | ${''}
    ${[0]}               | ${Currency.EURO}                | ${'Gratuit'}
    ${[0, 700]}          | ${Currency.EURO}                | ${'Gratuit'}
    ${[100]}             | ${Currency.EURO}                | ${'1,00\u00a0€'}
    ${[200]}             | ${Currency.EURO}                | ${'2,00\u00a0€'}
    ${[345]}             | ${Currency.EURO}                | ${'3,45\u00a0€'}
    ${[350]}             | ${Currency.EURO}                | ${'3,50\u00a0€'}
    ${[560, 300]}        | ${Currency.EURO}                | ${'Dès 3,00\u00a0€'}
    ${[200, 1000, 3000]} | ${Currency.EURO}                | ${'Dès 2,00\u00a0€'}
    ${[-300, 560]}       | ${Currency.EURO}                | ${'5,60\u00a0€'}
    ${[800, 800]}        | ${Currency.EURO}                | ${'8,00\u00a0€'}
    ${[100]}             | ${Currency.PACIFIC_FRANC_SHORT} | ${'120\u00a0F'}
  `(
    'getDisplayPrice($prices) \t= $expected with format price options',
    ({ prices, currency, expected }) => {
      expect(
        getDisplayPrice(prices, currency, DEFAULT_PACIFIC_FRANC_TO_EURO_RATE, {
          fractionDigits: 2,
        })
      ).toBe(expected)
    }
  )
})
