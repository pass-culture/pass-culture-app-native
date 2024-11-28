import { getPriceDescription } from 'features/search/helpers/getPriceDescription/getPriceDescription'
import { DEFAULT_PACIFIC_FRANC_TO_EURO_RATE } from 'libs/firebase/firestore/exchangeRates/useGetPacificFrancToEuroRate'
import { Currency } from 'shared/currency/useGetCurrencyToDisplay'

describe('getPriceDescription', () => {
  it('should return an empty string when minimum price is 0 and maximum price undefined', () => {
    const label = getPriceDescription(Currency.EURO, DEFAULT_PACIFIC_FRANC_TO_EURO_RATE, 0)

    expect(label).toStrictEqual('')
  })

  it('should return "Gratuit" when minimum price undefined and maximum price is 0', () => {
    const label = getPriceDescription(
      Currency.EURO,
      DEFAULT_PACIFIC_FRANC_TO_EURO_RATE,
      undefined,
      0
    )

    expect(label).toStrictEqual('Gratuit')
  })

  it('should return "Gratuit" when minimum price is 0 and maximum price is 0', () => {
    const label = getPriceDescription(Currency.EURO, DEFAULT_PACIFIC_FRANC_TO_EURO_RATE, 0, 0)

    expect(label).toStrictEqual('Gratuit')
  })

  it('should return "de 5\u00a0€ à 20\u00a0€" when minimum price is 5 and maximum price is 20', () => {
    const label = getPriceDescription(Currency.EURO, DEFAULT_PACIFIC_FRANC_TO_EURO_RATE, 5, 20)

    expect(label).toStrictEqual('de 5\u00a0€ à 20\u00a0€')
  })

  it('should return "plus de 5\u00a0€" when minimum price is 5 and maximum price is undefined', () => {
    const label = getPriceDescription(Currency.EURO, DEFAULT_PACIFIC_FRANC_TO_EURO_RATE, 5)

    expect(label).toStrictEqual('5\u00a0€ et plus')
  })

  it('should return "moins de 5\u00a0€" when minimum price is undefined and maximum price is 5', () => {
    const label = getPriceDescription(
      Currency.EURO,
      DEFAULT_PACIFIC_FRANC_TO_EURO_RATE,
      undefined,
      5
    )

    expect(label).toStrictEqual('5\u00a0€ et moins')
  })
})
