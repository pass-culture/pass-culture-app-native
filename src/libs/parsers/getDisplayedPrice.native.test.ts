import { Currency } from 'shared/currency/useGetCurrencyToDisplay'
import { DEFAULT_PACIFIC_FRANC_TO_EURO_RATE } from 'shared/exchangeRates/defaultRateValues'

import {
  formatDuoPrice,
  formatPrice,
  formatStartPrice,
  getDisplayedPrice,
  identityPrice,
} from './getDisplayedPrice'

describe('getDisplayedPrice', () => {
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
    'getDisplayedPrice($prices) \t= $expected without format price options',
    ({ prices, currency, expected }) => {
      expect(getDisplayedPrice(prices, currency, DEFAULT_PACIFIC_FRANC_TO_EURO_RATE)).toBe(expected)
    }
  )

  it.each`
    prices               | currency                        | isDuo        | expected
    ${undefined}         | ${Currency.EURO}                | ${undefined} | ${''}
    ${[]}                | ${Currency.EURO}                | ${undefined} | ${''}
    ${[0]}               | ${Currency.EURO}                | ${true}      | ${'Gratuit'}
    ${[0, 700]}          | ${Currency.EURO}                | ${false}     | ${'Gratuit'}
    ${[100]}             | ${Currency.EURO}                | ${false}     | ${'1,00\u00a0€'}
    ${[200]}             | ${Currency.EURO}                | ${true}      | ${'2,00\u00a0€ • Duo'}
    ${[345]}             | ${Currency.EURO}                | ${false}     | ${'3,45\u00a0€'}
    ${[350]}             | ${Currency.EURO}                | ${undefined} | ${'3,50\u00a0€'}
    ${[560, 300]}        | ${Currency.EURO}                | ${undefined} | ${'Dès 3,00\u00a0€'}
    ${[200, 1000, 3000]} | ${Currency.EURO}                | ${undefined} | ${'Dès 2,00\u00a0€'}
    ${[-300, 560]}       | ${Currency.EURO}                | ${undefined} | ${'5,60\u00a0€'}
    ${[800, 800]}        | ${Currency.EURO}                | ${undefined} | ${'8,00\u00a0€'}
    ${[100]}             | ${Currency.PACIFIC_FRANC_SHORT} | ${true}      | ${'120\u00a0F • Duo'}
    ${[800]}             | ${Currency.EURO}                | ${undefined} | ${'8,00\u00a0€'}
    ${[800]}             | ${Currency.EURO}                | ${true}      | ${'8,00\u00a0€ • Duo'}
    ${[560, 300]}        | ${Currency.EURO}                | ${true}      | ${'Dès 3,00\u00a0€ • Duo'}
  `(
    'getDisplayedPrice($prices) \t= $expected with format price options',
    ({ prices, currency, isDuo, expected }) => {
      expect(
        getDisplayedPrice(
          prices,
          currency,
          DEFAULT_PACIFIC_FRANC_TO_EURO_RATE,
          formatPrice({
            isDuo,
          }),
          {
            fractionDigits: 2,
          }
        )
      ).toBe(expected)
    }
  )
})

describe('identityPrice', () => {
  it('should render the same price as given', () => {
    const price = '5,00'

    expect(identityPrice(price)).toBe(price)
  })
})

describe('formatDuoPrice', () => {
  it('should render price with sufix " • Duo"', () => {
    const price = '6,00'

    expect(formatDuoPrice(price)).toBe(`${price} • Duo`)
  })
})

describe('formatStartPrice', () => {
  it('should render price with sufix "Dès "', () => {
    const price = '7,00'

    expect(formatStartPrice(price)).toBe(`Dès ${price}`)
  })
})

describe('formatPrice', () => {
  const price = '8,00'

  it.each`
    isDuo    | expected
    ${true}  | ${`${price} • Duo`}
    ${false} | ${price}
  `('$should render \t= $expected', ({ isDuo, expected }) => {
    const formatDisplayedPrice = formatPrice({ isDuo })

    expect(formatDisplayedPrice(price)).toBe(expected)
  })
})
