import { OfferStockResponse } from 'api/gen'
import { stock1, stock2, stock3, stock4 } from 'features/bookOffer/fixtures/stocks'
import { getHourChoiceForMultiplePrices } from 'features/bookOffer/helpers/getHourChoiceForMultiplePrices'
import { Currency } from 'shared/currency/useGetCurrencyToDisplay'

const selectedDate = '2023-04-01'
const euroToPacificFrancRate = 1

describe('getHourChoiceForMultiplePrices', () => {
  it('should return one option per distinct hour sorted by hour', () => {
    const options = getHourChoiceForMultiplePrices(
      [stock1, stock2, stock3, stock4],
      selectedDate,
      50000,
      Currency.EURO,
      euroToPacificFrancRate
    )

    expect(options).toEqual([
      {
        key: '2023-04-01T18:00:00Z',
        label: '18h00',
        description: 'dès 100\u00a0€',
        disabled: false,
      },
      {
        key: '2023-04-01T20:00:00Z',
        label: '20h00',
        description: '210\u00a0€',
        disabled: false,
      },
    ])
  })

  it('should use minimum bookable price when an hour has several prices', () => {
    const options = getHourChoiceForMultiplePrices(
      [stock1, stock2, { ...stock3, isBookable: false }, stock4],
      selectedDate,
      50000,
      Currency.EURO,
      euroToPacificFrancRate
    )

    expect(options[0]?.description).toBe('dès 190\u00a0€')
  })

  it('should include features in option description', () => {
    const options = getHourChoiceForMultiplePrices(
      [stock1, stock2, { ...stock3, features: ['3D', 'VF'] }, stock4],
      selectedDate,
      50000,
      Currency.EURO,
      euroToPacificFrancRate
    )

    expect(options[0]?.description).toBe('3D VF - dès 100\u00a0€')
  })

  it('should disable option when all stocks for an hour are not bookable', () => {
    const soldOutStocks: OfferStockResponse[] = [
      { ...stock2, isBookable: false, isSoldOut: true },
      { ...stock3, isBookable: false, isSoldOut: true },
    ]

    const options = getHourChoiceForMultiplePrices(
      soldOutStocks,
      selectedDate,
      50000,
      Currency.EURO,
      euroToPacificFrancRate
    )

    expect(options[0]).toMatchObject({ description: 'épuisé', disabled: true })
  })

  it('should disable option when user has not enough credit', () => {
    const options = getHourChoiceForMultiplePrices(
      [stock1],
      selectedDate,
      0,
      Currency.EURO,
      euroToPacificFrancRate
    )

    expect(options[0]).toMatchObject({ description: 'crédit insuffisant', disabled: true })
  })
})
