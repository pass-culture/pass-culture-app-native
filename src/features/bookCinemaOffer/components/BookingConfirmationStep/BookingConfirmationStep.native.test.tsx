import React from 'react'

import { RecommendationApiParams } from 'api/gen'
import { PlaylistType } from 'features/offer/enums'
import * as logOfferConversionAPI from 'libs/algolia/analytics/logOfferConversion'
import { analytics } from 'libs/analytics/provider'
import { act, render, screen, userEvent } from 'tests/utils'

import { BookingConfirmationStep } from './BookingConfirmationStep'

const mockMutate = jest.fn()
let mutationOnSuccess: ((result: { bookingId: number }) => void) | undefined
let mockIsPending = false

const mockOffer = {
  id: 1,
  name: 'Harry Potter',
  subcategoryId: 'SEANCE_CINE',
  isDuo: true,
  venue: { name: 'Cinéma', address: '1 rue du cinéma', postalCode: '75001', city: 'Paris' },
  address: null,
  stocks: [
    {
      id: 2,
      price: 1000,
      isForbiddenToUnderage: false,
      beginningDatetime: '2026-10-20T20:00:00Z',
      features: ['VO'],
    },
  ],
  extraData: { durationMinutes: 120 },
}

jest.mock('queries/offer/useOfferQuery', () => ({
  useOfferQuery: ({ select }: { select?: (data: typeof mockOffer) => unknown }) => ({
    data: select ? select(mockOffer) : mockOffer,
  }),
}))

jest.mock('queries/bookOffer/useBookOfferMutation', () => ({
  useBookOfferMutation: ({ onSuccess }: { onSuccess: (result: { bookingId: number }) => void }) => {
    mutationOnSuccess = onSuccess
    return { mutate: mockMutate, isPending: mockIsPending }
  },
}))

jest.mock('queries/settings/useSettings', () => ({
  usePacificFrancToEuroRate: () => ({ data: 1 }),
}))

const logOfferConversionSpy = jest.spyOn(logOfferConversionAPI, 'logOfferConversion')

const apiRecoParams: RecommendationApiParams = {
  callId: '1',
  filtered: true,
  geoLocated: false,
  modelEndpoint: 'default',
  modelName: 'similar_offers_default_prod',
  modelVersion: 'similar_offers_clicks_v2_1_prod_v_20230317T173445',
  recoOrigin: 'default',
}

const user = userEvent.setup()
jest.useFakeTimers()

const defaultProps = {
  offerId: 1,
  stockId: 2,
  quantity: 1 as const,
}

const confirmBooking = async () => {
  const cguCheckbox = await screen.findByRole('checkbox', {
    name: 'J’ai lu et j’accepte les conditions générales d’utilisation - obligatoire',
    checked: false,
  })
  await user.press(cguCheckbox)
  await user.press(screen.getByText('Confirmer la réservation'))
  act(() => {
    mutationOnSuccess?.({ bookingId: 99 })
  })
}

describe('<BookingConfirmationStep />', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mutationOnSuccess = undefined
    mockIsPending = false
  })

  it('should render booking informations', () => {
    render(<BookingConfirmationStep {...defaultProps} />)

    expect(screen.getByText('Harry Potter')).toBeOnTheScreen()
    expect(screen.getByText('Cinéma')).toBeOnTheScreen()
    expect(screen.getByText('Trouve ta séance')).toBeOnTheScreen()
    expect(screen.getByText(/Durée : 2h/)).toBeOnTheScreen()
    expect(
      screen.getByText(
        /destinés à un usage strictement personnel et ne peuvent faire l’objet de revente/
      )
    ).toBeOnTheScreen()
  })

  it('should replace the confirmation with the loading message while the booking is pending', () => {
    mockIsPending = true
    render(<BookingConfirmationStep {...defaultProps} />)

    expect(screen.getByText('En cours de confirmation...')).toBeOnTheScreen()
    expect(screen.queryByText('Confirmer la réservation')).not.toBeOnTheScreen()
  })

  it('should book the offer when confirming after accepting CGU', async () => {
    render(<BookingConfirmationStep {...defaultProps} />)

    const cguCheckbox = await screen.findByRole('checkbox', {
      name: 'J’ai lu et j’accepte les conditions générales d’utilisation - obligatoire',
      checked: false,
    })
    await user.press(cguCheckbox)
    await user.press(screen.getByText('Confirmer la réservation'))

    expect(mockMutate).toHaveBeenCalledWith({ quantity: 1, stockId: 2 })
  })

  it('should log booking confirmation with attribution params', async () => {
    render(
      <BookingConfirmationStep
        {...defaultProps}
        fromOfferId={10}
        fromMultivenueOfferId={20}
        apiRecoParams={JSON.stringify(apiRecoParams)}
        playlistType={PlaylistType.SAME_CATEGORY_SIMILAR_OFFERS}
      />
    )

    await confirmBooking()

    expect(analytics.logBookingConfirmation).toHaveBeenCalledWith({
      ...apiRecoParams,
      offerId: '1',
      bookingId: '99',
      fromOfferId: undefined,
      fromMultivenueOfferId: '20',
      playlistType: PlaylistType.SAME_CATEGORY_SIMILAR_OFFERS,
    })
  })

  it('should log offer conversion when the booking comes from search', async () => {
    render(<BookingConfirmationStep {...defaultProps} from="searchresults" />)

    await confirmBooking()

    expect(logOfferConversionSpy).toHaveBeenCalledWith({ objectID: '1', queryID: undefined })
  })

  it('should not log offer conversion when the booking does not come from search', async () => {
    render(<BookingConfirmationStep {...defaultProps} />)

    await confirmBooking()

    expect(logOfferConversionSpy).not.toHaveBeenCalled()
  })
})
