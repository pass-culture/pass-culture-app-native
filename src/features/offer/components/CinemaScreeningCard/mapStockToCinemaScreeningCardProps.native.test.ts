import { StockResponse } from 'api/gen'
import { mockedBookingV2Api } from 'fixtures/booking'
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

  it('disables a related screening without hiding its information when the offer is already booked', () => {
    const onSelectScreening = jest.fn()
    const onPressOfferCTA = jest.fn()
    const result = mapStockToCinemaScreeningCardProps({
      screening,
      offerVenueId: mockedBookingV2Api.stock.offer.venue.id,
      onSelectScreening,
      currency: Currency.EURO,
      euroToPacificFrancRate: 119.33,
      onPressOfferCTA,
      movieScreeningUserData: { bookings: mockedBookingV2Api, hasBookedOffer: true },
    })

    expect(result).toEqual(
      expect.objectContaining({
        isDisabled: true,
        disabledReason: undefined,
        accessibility: screening.screeningFeatures?.accessibility,
        audio: ['Dolby Atmos'],
        price: '5,70\u00a0€',
        specialEvent: 'Avant-première avec équipe',
        video: ['IMAX'],
      })
    )

    result?.onPress()

    expect(onSelectScreening).not.toHaveBeenCalled()
    expect(onPressOfferCTA).not.toHaveBeenCalled()
  })
})
