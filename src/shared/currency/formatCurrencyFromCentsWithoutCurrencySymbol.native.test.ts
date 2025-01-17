import { Currency } from 'shared/currency/useGetCurrencyToDisplay'
import { DEFAULT_PACIFIC_FRANC_TO_EURO_RATE } from 'shared/exchangeRates/defaultRateValues'

import { formatCurrencyFromCentsWithoutCurrencySymbol } from './formatCurrencyFromCentsWithoutCurrencySymbol'

describe('formatCurrencyFromCentsWithoutCurrencySymbol()', () => {
  it.each`
    priceInCents | currency                        | expected
    ${0}         | ${Currency.EURO}                | ${0}
    ${100}       | ${Currency.EURO}                | ${1}
    ${500}       | ${Currency.EURO}                | ${5}
    ${-500}      | ${Currency.EURO}                | ${-5}
    ${1050}      | ${Currency.EURO}                | ${10.5}
    ${-1050}     | ${Currency.EURO}                | ${-10.5}
    ${1110}      | ${Currency.EURO}                | ${11.1}
    ${-1110}     | ${Currency.EURO}                | ${-11.1}
    ${1190}      | ${Currency.EURO}                | ${11.9}
    ${-1190}     | ${Currency.EURO}                | ${-11.9}
    ${1199}      | ${Currency.EURO}                | ${11.99}
    ${-1199}     | ${Currency.EURO}                | ${-11.99}
    ${100}       | ${Currency.PACIFIC_FRANC_SHORT} | ${120}
  `(
    'formatCurrencyFromCentsWithoutCurrencySymbol($priceInCents) = $expected without format price options',
    ({ priceInCents, currency, expected }) => {
      expect(
        formatCurrencyFromCentsWithoutCurrencySymbol(
          priceInCents,
          currency,
          DEFAULT_PACIFIC_FRANC_TO_EURO_RATE
        )
      ).toBe(expected)
    }
  )
})
