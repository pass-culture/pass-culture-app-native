import { StockResponse } from 'api/gen'
import { CinemaScreeningCardDisabledReason } from 'features/offer/components/CinemaScreeningCard/types'
import {
  convertToMinutes,
  mapStockToCinemaScreeningCardProps,
} from 'features/offer/components/MovieScreeningCalendar/useSelectedDateScreenings'
import { Currency } from 'shared/currency/useGetCurrencyToDisplay'

const stock: StockResponse = {
  beginningDatetime: '2024-01-01T12:00:00',
  id: 1,
  isBookable: true,
  isExpired: false,
  isForbiddenToUnderage: false,
  isSoldOut: false,
  price: 570,
  screeningFeatures: {
    accessibility: { audio: ['CCAP'], mental: [], motor: [], visual: [] },
    audio: 'DOLBY_ATMOS',
    language: 'VO',
    specialEventType: 'PREVIEW_SCREENING_WITH_CREW',
    video: 'IMAX',
  },
}

describe('convertToMinutes', () => {
  it.each`
    time      | expected
    ${''}     | ${0}
    ${'123'}  | ${0}
    ${'abc'}  | ${0}
    ${'2h30'} | ${150}
    ${'0h45'} | ${45}
    ${'1h00'} | ${60}
  `('should convert "${time}" to ${expected}', ({ time, expected }) => {
    expect(convertToMinutes(time)).toBe(expected)
  })
})

describe('mapStockToCinemaScreeningCardProps', () => {
  it('maps enriched stock information', () => {
    const onPress = jest.fn()
    const result = mapStockToCinemaScreeningCardProps(
      stock,
      1,
      jest.fn(),
      Currency.EURO,
      119.33,
      onPress
    )

    expect(result).toEqual(
      expect.objectContaining({
        accessibility: stock.screeningFeatures?.accessibility,
        audio: ['DolbyAtmos'],
        languages: ['VO'],
        price: '5,70 €',
        specialEvent: 'Avant première',
        time: '12h00',
        video: ['IMAX'],
      })
    )
  })

  it('disables the card when the user has insufficient credit', () => {
    const result = mapStockToCinemaScreeningCardProps(
      stock,
      1,
      jest.fn(),
      Currency.EURO,
      119.33,
      undefined,
      { isUserLoggedIn: true, hasEnoughCredit: false }
    )

    expect(result?.disabledReason).toBe(CinemaScreeningCardDisabledReason.INSUFFICIENT_CREDIT)
  })
})
