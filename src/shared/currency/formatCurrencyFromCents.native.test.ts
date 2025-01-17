import { Currency } from 'shared/currency/useGetCurrencyToDisplay'
import { DEFAULT_PACIFIC_FRANC_TO_EURO_RATE } from 'shared/exchangeRates/defaultRateValues'

import { formatCurrencyFromCents } from './formatCurrencyFromCents'

describe('formatCurrencyFromCents()', () => {
  it.each`
    priceInCents | currency                        | expected
    ${0}         | ${Currency.EURO}                | ${'0\u00a0€'}
    ${100}       | ${Currency.EURO}                | ${'1\u00a0€'}
    ${500}       | ${Currency.EURO}                | ${'5\u00a0€'}
    ${-500}      | ${Currency.EURO}                | ${'-5\u00a0€'}
    ${1050}      | ${Currency.EURO}                | ${'10,50\u00a0€'}
    ${-1050}     | ${Currency.EURO}                | ${'-10,50\u00a0€'}
    ${1110}      | ${Currency.EURO}                | ${'11,10\u00a0€'}
    ${-1110}     | ${Currency.EURO}                | ${'-11,10\u00a0€'}
    ${1190}      | ${Currency.EURO}                | ${'11,90\u00a0€'}
    ${-1190}     | ${Currency.EURO}                | ${'-11,90\u00a0€'}
    ${1199}      | ${Currency.EURO}                | ${'11,99\u00a0€'}
    ${-1199}     | ${Currency.EURO}                | ${'-11,99\u00a0€'}
    ${100}       | ${Currency.PACIFIC_FRANC_SHORT} | ${'120\u00a0F'}
  `(
    'formatCurrencyFromCents($priceInCents) \t= $expected without format price options',
    ({ priceInCents, currency, expected }) => {
      expect(
        formatCurrencyFromCents(priceInCents, currency, DEFAULT_PACIFIC_FRANC_TO_EURO_RATE)
      ).toBe(expected)
    }
  )

  it.each`
    priceInCents | currency                        | expected
    ${0}         | ${Currency.EURO}                | ${'0,00\u00a0€'}
    ${100}       | ${Currency.EURO}                | ${'1,00\u00a0€'}
    ${500}       | ${Currency.EURO}                | ${'5,00\u00a0€'}
    ${-500}      | ${Currency.EURO}                | ${'-5,00\u00a0€'}
    ${1050}      | ${Currency.EURO}                | ${'10,50\u00a0€'}
    ${-1050}     | ${Currency.EURO}                | ${'-10,50\u00a0€'}
    ${1110}      | ${Currency.EURO}                | ${'11,10\u00a0€'}
    ${-1110}     | ${Currency.EURO}                | ${'-11,10\u00a0€'}
    ${1190}      | ${Currency.EURO}                | ${'11,90\u00a0€'}
    ${-1190}     | ${Currency.EURO}                | ${'-11,90\u00a0€'}
    ${1199}      | ${Currency.EURO}                | ${'11,99\u00a0€'}
    ${-1199}     | ${Currency.EURO}                | ${'-11,99\u00a0€'}
    ${100}       | ${Currency.PACIFIC_FRANC_SHORT} | ${'120\u00a0F'}
  `(
    'formatCurrencyFromCents($priceInCents) \t= $expected with format price options',
    ({ priceInCents, currency, expected }) => {
      expect(
        formatCurrencyFromCents(priceInCents, currency, DEFAULT_PACIFIC_FRANC_TO_EURO_RATE, {
          fractionDigits: 2,
        })
      ).toBe(expected)
    }
  )
})
