import React from 'react'

import { navigate, useRoute } from '__mocks__/@react-navigation/native'
import { ApiError } from 'api/ApiError'
import { OfferResponse } from 'api/gen'
import * as Auth from 'features/auth/context/AuthContext'
import * as useBookOfferMutation from 'features/bookOffer/api/useBookOfferMutation'
import { BookingState, Step } from 'features/bookOffer/context/reducer'
import { mockOffer as baseOffer } from 'features/bookOffer/fixtures/offer'
import { mockStocks } from 'features/bookOffer/fixtures/stocks'
import { IBookingContext } from 'features/bookOffer/types'
import { VenueListItem } from 'features/offer/components/VenueSelectionList/VenueSelectionList'
import { PlaylistType } from 'features/offer/enums'
import { beneficiaryUser } from 'fixtures/user'
import * as logOfferConversionAPI from 'libs/algolia/analytics/logOfferConversion'
import { analytics } from 'libs/analytics'
import { CampaignEvents, campaignTracker } from 'libs/campaign'
import { placeholderData as mockSubcategoriesData } from 'libs/subcategories/placeholderData'
import { RecommendationApiParams } from 'shared/offer/types'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { fireEvent, render, screen } from 'tests/utils'
import { SnackBarHelperSettings } from 'ui/components/snackBar/types'

import { BookingOfferModalComponent } from './BookingOfferModal'

const mockDismissModal = jest.fn()
const mockDispatch = jest.fn()

const mockOffer: OfferResponse | undefined = baseOffer

const mockUseBookingContext: jest.Mock<IBookingContext> = jest.fn(() => ({
  bookingState: { offerId: mockOffer.id, step: Step.DATE } as BookingState,
  dismissModal: mockDismissModal,
  dispatch: mockDispatch,
}))
jest.mock('features/bookOffer/context/useBookingContext', () => ({
  useBookingContext: () => mockUseBookingContext(),
}))

const mockUseOffer = jest.fn()
mockUseOffer.mockReturnValue({
  data: mockOffer,
})
jest.mock('features/offer/api/useOffer', () => ({
  useOffer: () => mockUseOffer(),
}))

jest.mock('features/bookOffer/helpers/useBookingOffer', () => ({
  useBookingOffer: jest.fn(() => mockOffer),
}))

jest.mock('libs/subcategories/useSubcategories', () => ({
  useSubcategories: () => ({
    data: mockSubcategoriesData,
  }),
}))

jest.spyOn(Auth, 'useAuthContext').mockReturnValue({
  isLoggedIn: true,
  user: beneficiaryUser,
  isUserLoading: false,
  refetchUser: jest.fn(),
  setIsLoggedIn: jest.fn(),
}) as jest.Mock

const useBookOfferMutationSpy = jest.spyOn(useBookOfferMutation, 'useBookOfferMutation')

const mockUseMutationSuccess = () => {
  // @ts-ignore we don't use the other properties of UseMutationResult (such as failureCount)
  useBookOfferMutationSpy.mockImplementation(({ onSuccess }) => ({
    mutate: jest.fn(() => onSuccess({ bookingId: 1 })),
  }))
}

const mockUseMutationError = (error?: ApiError) => {
  // @ts-ignore we don't use the other properties of UseMutationResult (such as failureCount)
  useBookOfferMutationSpy.mockImplementation(({ onError }) => ({
    // @ts-ignore it's a mock
    mutate: jest.fn(() => onError(error)),
  }))
}

const logOfferConversionSpy = jest.fn()
jest
  .spyOn(logOfferConversionAPI, 'useLogOfferConversion')
  .mockReturnValue({ logOfferConversion: logOfferConversionSpy })

const mockShowErrorSnackBar = jest.fn()
jest.mock('ui/components/snackBar/SnackBarContext', () => ({
  useSnackBarContext: () => ({
    showErrorSnackBar: jest.fn((props: SnackBarHelperSettings) => mockShowErrorSnackBar(props)),
  }),
  SNACK_BAR_TIME_OUT: 5000,
}))

const mockHasNextPage = true
const mockFetchNextPage = jest.fn()
const mockData = {
  pages: [
    {
      nbHits: 0,
      hits: [],
      page: 0,
    },
  ],
}
const mockOfferVenues: VenueListItem[] = []
const mockNbOfferVenues = 0
jest.mock('api/useSearchVenuesOffer/useSearchVenueOffers', () => ({
  useSearchVenueOffers: () => ({
    hasNextPage: mockHasNextPage,
    fetchNextPage: mockFetchNextPage,
    data: mockData,
    offerVenues: mockOfferVenues,
    nbOfferVenues: mockNbOfferVenues,
    isFetching: false,
  }),
}))

const apiRecoParams: RecommendationApiParams = {
  call_id: '1',
  filtered: true,
  geo_located: false,
  model_endpoint: 'default',
  model_name: 'similar_offers_default_prod',
  model_version: 'similar_offers_clicks_v2_1_prod_v_20230317T173445',
  reco_origin: 'default',
}

describe('<BookingOfferModalComponent />', () => {
  it('should dismiss modal when click on rightIconButton and reset state', () => {
    render(reactQueryProviderHOC(<BookingOfferModalComponent visible offerId={mockOffer.id} />))

    const dismissModalButton = screen.getByTestId('Fermer la modale')

    fireEvent.press(dismissModalButton)

    expect(mockDispatch).toHaveBeenCalledWith({ type: 'RESET' })
    expect(mockDispatch).toHaveBeenNthCalledWith(1, { type: 'SET_OFFER_ID', payload: mockOffer.id })
    expect(mockDismissModal).toHaveBeenCalledTimes(1)
  })

  it('should set offer consulted when dismiss modal and an other venue has been selected', () => {
    render(reactQueryProviderHOC(<BookingOfferModalComponent visible offerId={20} />))

    const dismissModalButton = screen.getByTestId('Fermer la modale')

    fireEvent.press(dismissModalButton)

    expect(mockDispatch).toHaveBeenNthCalledWith(2, { type: 'SET_OFFER_ID', payload: 20 })
  })

  it('should not log event BookingProcessStart when modal is not visible', () => {
    render(reactQueryProviderHOC(<BookingOfferModalComponent visible={false} offerId={20} />))

    expect(analytics.logBookingProcessStart).not.toHaveBeenCalled()
  })

  it('should log event BookingProcessStart when modal opens', () => {
    const offerId = 30
    render(reactQueryProviderHOC(<BookingOfferModalComponent visible offerId={offerId} />))

    expect(analytics.logBookingProcessStart).toHaveBeenCalledWith(offerId)
  })

  it('should show AlreadyBooked when isEndedUsedBooking is true', () => {
    const offerId = 30
    render(
      reactQueryProviderHOC(
        <BookingOfferModalComponent visible offerId={offerId} isEndedUsedBooking />
      )
    )

    expect(screen.queryByText('Tu as déjà réservé :')).toBeOnTheScreen()
    expect(
      screen.queryByTestId(`Nouvelle fenêtre : Pourquoi limiter les réservations\u00a0?`)
    ).toBeOnTheScreen()
  })

  it('should log booking funnel cancellation event when closing the modal', () => {
    render(reactQueryProviderHOC(<BookingOfferModalComponent visible offerId={20} />))
    const dismissModalButton = screen.getByTestId('Fermer la modale')

    fireEvent.press(dismissModalButton)

    expect(analytics.logCancelBookingFunnel).toHaveBeenNthCalledWith(1, Step.DATE, 20)
  })

  it('should display modal with prices by categories', () => {
    mockUseOffer.mockReturnValueOnce({ data: { ...mockOffer, stocks: mockStocks } })
    render(reactQueryProviderHOC(<BookingOfferModalComponent visible offerId={20} />))

    expect(screen.getByTestId('modalWithPricesByCategories')).toBeOnTheScreen()
  })

  describe('when booking step is confirmation', () => {
    beforeEach(() => {
      mockUseBookingContext.mockReturnValue({
        bookingState: {
          offerId: mockOffer.id,
          step: Step.CONFIRMATION,
          quantity: 1,
          // @ts-expect-error: because of noUncheckedIndexedAccess
          stockId: mockOffer.stocks[0].id,
        } as BookingState,
        dismissModal: mockDismissModal,
        dispatch: mockDispatch,
      })
      mockUseMutationSuccess()
    })

    describe('when booking validated', () => {
      it('should dismiss the modal on success', () => {
        render(<BookingOfferModalComponent visible offerId={20} />)
        fireEvent.press(screen.getByText('Confirmer la réservation'))

        expect(mockDismissModal).toHaveBeenCalledTimes(1)
      })

      it('should log confirmation booking when offer booked from a similar offer', () => {
        useRoute.mockReturnValueOnce({
          params: {
            fromOfferId: 1,
            fromMultivenueOfferId: 1,
            apiRecoParams: JSON.stringify(apiRecoParams),
            playlistType: PlaylistType.SAME_CATEGORY_SIMILAR_OFFERS,
          },
        })
        render(<BookingOfferModalComponent visible offerId={20} />)
        fireEvent.press(screen.getByText('Confirmer la réservation'))

        expect(analytics.logBookingConfirmation).toHaveBeenCalledWith({
          ...apiRecoParams,
          bookingId: 1,
          fromMultivenueOfferId: 1,
          fromOfferId: undefined,
          offerId: 20,
          playlistType: PlaylistType.SAME_CATEGORY_SIMILAR_OFFERS,
        })
      })

      it('should log confirmation booking when offer not booked from a similar offer', () => {
        render(<BookingOfferModalComponent visible offerId={20} />)
        fireEvent.press(screen.getByText('Confirmer la réservation'))

        expect(analytics.logBookingConfirmation).toHaveBeenCalledWith({ bookingId: 1, offerId: 20 })
      })

      it('should log conversion booking when is from search', () => {
        useRoute.mockReturnValueOnce({
          params: { from: 'search' },
        })
        render(<BookingOfferModalComponent visible offerId={20} />)

        fireEvent.press(screen.getByText('Confirmer la réservation'))

        expect(logOfferConversionSpy).toHaveBeenCalledWith('20')
      })

      it('should not log conversion booking when is not from search', async () => {
        render(<BookingOfferModalComponent visible offerId={20} />)

        fireEvent.press(screen.getByText('Confirmer la réservation'))

        expect(logOfferConversionSpy).not.toHaveBeenCalled()
      })

      it('should log campaign tracker when booking is complete', () => {
        render(<BookingOfferModalComponent visible offerId={mockOffer.id} />)
        fireEvent.press(screen.getByText('Confirmer la réservation'))

        expect(campaignTracker.logEvent).toHaveBeenCalledWith(CampaignEvents.COMPLETE_BOOK_OFFER, {
          af_offer_id: mockOffer.id,
          // @ts-expect-error: because of noUncheckedIndexedAccess
          af_booking_id: mockOffer.stocks[0].id,
          // @ts-expect-error: because of noUncheckedIndexedAccess
          af_price: mockOffer.stocks[0].price,
          af_category: mockOffer.subcategoryId,
        })
      })

      it('should navigate to booking confirmation when booking is complete', () => {
        render(<BookingOfferModalComponent visible offerId={20} />)
        fireEvent.press(screen.getByText('Confirmer la réservation'))

        expect(navigate).toHaveBeenCalledWith('BookingConfirmation', { offerId: 20, bookingId: 1 })
      })
    })

    describe('when booking failed', () => {
      beforeEach(() => {
        mockUseBookingContext.mockReturnValue({
          bookingState: {
            offerId: mockOffer.id,
            step: Step.CONFIRMATION,
            quantity: 1,
            // @ts-expect-error: because of noUncheckedIndexedAccess
            stockId: mockOffer.stocks[0].id,
          } as BookingState,
          dismissModal: mockDismissModal,
          dispatch: mockDispatch,
        })
      })

      it('should dismiss the modal on error', () => {
        mockUseMutationError({
          content: {},
          name: 'ApiError',
          statusCode: 400,
          message: 'erreur',
        })
        render(<BookingOfferModalComponent visible offerId={20} />)
        fireEvent.press(screen.getByText('Confirmer la réservation'))

        expect(mockDismissModal).toHaveBeenCalledTimes(1)
      })

      it('should log booking error when error is known', async () => {
        mockUseMutationError({
          content: { code: 'INSUFFICIENT_CREDIT' },
          name: 'ApiError',
          statusCode: 400,
          message: 'erreur',
        })
        render(<BookingOfferModalComponent visible offerId={20} />)

        fireEvent.press(screen.getByText('Confirmer la réservation'))

        expect(analytics.logBookingError).toHaveBeenNthCalledWith(1, 20, 'INSUFFICIENT_CREDIT')
      })

      it('should log booking error when error is unknown', async () => {
        mockUseMutationError({
          content: {},
          name: 'ApiError',
          statusCode: 400,
          message: 'erreur',
        })
        render(<BookingOfferModalComponent visible offerId={20} />)

        fireEvent.press(screen.getByText('Confirmer la réservation'))

        expect(analytics.logBookingError).not.toHaveBeenCalled()
      })

      it.each`
        code                         | message
        ${undefined}                 | ${'En raison d’une erreur technique, l’offre n’a pas pu être réservée'}
        ${'INSUFFICIENT_CREDIT'}     | ${'Attention, ton crédit est insuffisant pour pouvoir réserver cette offre\u00a0!'}
        ${'ALREADY_BOOKED'}          | ${'Attention, il est impossible de réserver plusieurs fois la même offre\u00a0!'}
        ${'STOCK_NOT_BOOKABLE'}      | ${'Oups, cette offre n’est plus disponible\u00a0!'}
        ${'PROVIDER_STOCK_SOLD_OUT'} | ${'Oups, cette offre n’est plus disponible\u00a0!'}
      `(
        'should show the error snackbar with message="$message" for errorCode="code" if booking an offer fails',
        ({ code, message }: { code: string | undefined; message: string }) => {
          mockUseMutationError({
            content: { code },
            name: 'ApiError',
            statusCode: 400,
            message: 'erreur',
          })
          render(<BookingOfferModalComponent visible offerId={20} />)

          fireEvent.press(screen.getByText('Confirmer la réservation'))

          expect(mockShowErrorSnackBar).toHaveBeenNthCalledWith(1, { timeout: 5000, message })
        }
      )
    })
  })
})
