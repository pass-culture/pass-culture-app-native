import { StockResponse } from 'api/gen'
import { Currency } from 'shared/currency/useGetCurrencyToDisplay'

import { mapStockToCinemaScreeningCardProps } from './mapStockToCinemaScreeningCardProps'
import { CinemaScreeningCardDisabledReason } from './types'

const screening: StockResponse = {
  beginningDatetime: '2024-01-01T12:00:00',
  id: 1,
  isBookable: true,
  isExpired: false,
  isForbiddenToUnderage: false,
  isSoldOut: false,
  price: 570,
  screeningFeatures: {
    accessibility: { audio: ['SUBTITLE_CCAP'], mental: [], motor: [], visual: [] },
    audio: 'ATMOS',
    language: 'VO',
    specialEventType: 'AVANT_PREMIERE_EQUIPE',
    video: 'IMAX',
  },
}

describe('mapStockToCinemaScreeningCardProps', () => {
  it('maps enriched stock information', () => {
    const result = mapStockToCinemaScreeningCardProps({
      screening,
      offerVenueId: 1,
      onSelectScreening: jest.fn(),
      currency: Currency.EURO,
      euroToPacificFrancRate: 119.33,
    })

    expect(result).toEqual(
      expect.objectContaining({
        accessibility: screening.screeningFeatures?.accessibility,
        audio: ['Dolby Atmos'],
        languages: ['VO'],
        price: '5,70 €',
        specialEvent: 'Avant-première avec équipe',
        time: '12h00',
        video: ['IMAX'],
      })
    )
  })

  it('does not select a screening when it is disabled', () => {
    const onSelectScreening = jest.fn()
    const onPressOfferCTA = jest.fn()
    const result = mapStockToCinemaScreeningCardProps({
      screening: { ...screening, isBookable: false },
      offerVenueId: 1,
      onSelectScreening,
      currency: Currency.EURO,
      euroToPacificFrancRate: 119.33,
      onPressOfferCTA,
    })

    expect(result?.disabledReason).toBe(CinemaScreeningCardDisabledReason.UNAVAILABLE)

    result?.onPress()

    expect(onSelectScreening).not.toHaveBeenCalled()
    expect(onPressOfferCTA).not.toHaveBeenCalled()
  })
})
