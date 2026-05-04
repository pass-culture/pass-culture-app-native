import { stock1, stock2 } from 'features/bookOffer/fixtures/stocks'
import { getHourChoiceForSingleStock } from 'features/bookOffer/helpers/getHourChoiceForSingleStock'
import { Currency } from 'shared/currency/useGetCurrencyToDisplay'

const selectedDate = '2023-04-01'
const euroToPacificFrancRate = 1

describe('getHourChoiceForSingleStock', () => {
  it('should return one option per stock sorted by hour', () => {
    const options = getHourChoiceForSingleStock(
      [stock1, stock2],
      selectedDate,
      50000,
      Currency.EURO,
      euroToPacificFrancRate
    )

    expect(options).toEqual([
      {
        key: stock2.id.toString(),
        label: '18h00',
        description: '220\u00a0€',
        disabled: false,
      },
      {
        key: stock1.id.toString(),
        label: '20h00',
        description: '210\u00a0€',
        disabled: false,
      },
    ])
  })

  it('should only return options matching selected date', () => {
    const options = getHourChoiceForSingleStock(
      [stock1, { ...stock2, beginningDatetime: '2023-04-02T18:00:00Z' }],
      selectedDate,
      50000,
      Currency.EURO,
      euroToPacificFrancRate
    )

    expect(options).toHaveLength(1)
    expect(options[0]?.label).toBe('20h00')
  })

  it('should include features in option description', () => {
    const options = getHourChoiceForSingleStock(
      [{ ...stock1, features: ['3D', 'VOST'] }],
      selectedDate,
      50000,
      Currency.EURO,
      euroToPacificFrancRate
    )

    expect(options[0]?.description).toBe('3D VOST - 210\u00a0€')
  })

  it('should disable option when stock is not bookable', () => {
    const options = getHourChoiceForSingleStock(
      [{ ...stock1, isBookable: false, isSoldOut: true }],
      selectedDate,
      50000,
      Currency.EURO,
      euroToPacificFrancRate
    )

    expect(options[0]).toMatchObject({ description: 'épuisé', disabled: true })
  })

  it('should disable option when user has not enough credit', () => {
    const options = getHourChoiceForSingleStock(
      [stock1],
      selectedDate,
      0,
      Currency.EURO,
      euroToPacificFrancRate
    )

    expect(options[0]).toMatchObject({ description: 'crédit insuffisant', disabled: true })
  })
})
