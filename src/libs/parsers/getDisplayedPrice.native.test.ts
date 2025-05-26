import { SubcategoryIdEnum } from 'api/gen'
import { Currency } from 'shared/currency/useGetCurrencyToDisplay'
import { DEFAULT_PACIFIC_FRANC_TO_EURO_RATE } from 'shared/exchangeRates/defaultRateValues'

import {
  formatDuoPrice,
  formatPrice,
  formatStartPrice,
  getDisplayedPrice,
  getIfPricesShouldBeFixed,
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
    ${[560, 300]}        | ${Currency.EURO}                | ${'3\u00a0€'}
    ${[200, 1000, 3000]} | ${Currency.EURO}                | ${'2\u00a0€'}
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
    prices               | currency                        | isDuoDisplayable | subcategoryId                      | expected
    ${undefined}         | ${Currency.EURO}                | ${undefined}     | ${SubcategoryIdEnum.FESTIVAL_CINE} | ${''}
    ${[]}                | ${Currency.EURO}                | ${undefined}     | ${SubcategoryIdEnum.FESTIVAL_CINE} | ${''}
    ${[0]}               | ${Currency.EURO}                | ${true}          | ${SubcategoryIdEnum.FESTIVAL_CINE} | ${'Gratuit'}
    ${[0, 700]}          | ${Currency.EURO}                | ${false}         | ${SubcategoryIdEnum.FESTIVAL_CINE} | ${'Gratuit'}
    ${[100]}             | ${Currency.EURO}                | ${false}         | ${SubcategoryIdEnum.FESTIVAL_CINE} | ${'Dès 1,00\u00a0€'}
    ${[200]}             | ${Currency.EURO}                | ${true}          | ${SubcategoryIdEnum.FESTIVAL_CINE} | ${'Dès 2,00\u00a0€ • Duo'}
    ${[345]}             | ${Currency.EURO}                | ${false}         | ${SubcategoryIdEnum.FESTIVAL_CINE} | ${'Dès 3,45\u00a0€'}
    ${[350]}             | ${Currency.EURO}                | ${undefined}     | ${SubcategoryIdEnum.FESTIVAL_CINE} | ${'Dès 3,50\u00a0€'}
    ${[560, 300]}        | ${Currency.EURO}                | ${undefined}     | ${SubcategoryIdEnum.FESTIVAL_CINE} | ${'Dès 3,00\u00a0€'}
    ${[200, 1000, 3000]} | ${Currency.EURO}                | ${undefined}     | ${SubcategoryIdEnum.FESTIVAL_CINE} | ${'Dès 2,00\u00a0€'}
    ${[-300, 560]}       | ${Currency.EURO}                | ${undefined}     | ${SubcategoryIdEnum.FESTIVAL_CINE} | ${'Dès 5,60\u00a0€'}
    ${[800, 800]}        | ${Currency.EURO}                | ${undefined}     | ${SubcategoryIdEnum.FESTIVAL_CINE} | ${'Dès 8,00\u00a0€'}
    ${[100]}             | ${Currency.PACIFIC_FRANC_SHORT} | ${true}          | ${SubcategoryIdEnum.FESTIVAL_CINE} | ${'Dès 120\u00a0F • Duo'}
    ${[100]}             | ${Currency.PACIFIC_FRANC_SHORT} | ${undefined}     | ${SubcategoryIdEnum.LIVRE_PAPIER}  | ${'120\u00a0F'}
    ${[800]}             | ${Currency.EURO}                | ${undefined}     | ${SubcategoryIdEnum.LIVRE_PAPIER}  | ${'8,00\u00a0€'}
    ${[800]}             | ${Currency.EURO}                | ${true}          | ${SubcategoryIdEnum.LIVRE_PAPIER}  | ${'8,00\u00a0€ • Duo'}
    ${[560, 300]}        | ${Currency.EURO}                | ${undefined}     | ${SubcategoryIdEnum.LIVRE_PAPIER}  | ${'3,00\u00a0€'}
  `(
    'getDisplayedPrice($prices) \t= $expected with format price options',
    ({ prices, currency, isDuoDisplayable, subcategoryId, expected }) => {
      expect(
        getDisplayedPrice(
          prices,
          currency,
          DEFAULT_PACIFIC_FRANC_TO_EURO_RATE,
          formatPrice({
            isFixed: getIfPricesShouldBeFixed(subcategoryId),
            isDuo: isDuoDisplayable,
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
    isFixed  | isDuo    | expected
    ${true}  | ${true}  | ${`${price} • Duo`}
    ${true}  | ${false} | ${price}
    ${false} | ${true}  | ${`Dès ${price} • Duo`}
    ${false} | ${false} | ${`Dès ${price}`}
  `('$should render \t= $expected', ({ isFixed, isDuo, expected }) => {
    const formatDisplayedPrice = formatPrice({ isFixed, isDuo })

    expect(formatDisplayedPrice(price)).toBe(expected)
  })
})

describe('getIfPricesShouldBeFixed', () => {
  it.each`
    subcategoryId                             | expected
    ${SubcategoryIdEnum.LIVRE_PAPIER}         | ${true}
    ${undefined}                              | ${false}
    ${SubcategoryIdEnum.MATERIEL_ART_CREATIF} | ${false}
  `('getIfPricesShouldBeFixed($subcategoryId) \t= $expected', ({ subcategoryId, expected }) => {
    expect(getIfPricesShouldBeFixed(subcategoryId)).toBe(expected)
  })
})
