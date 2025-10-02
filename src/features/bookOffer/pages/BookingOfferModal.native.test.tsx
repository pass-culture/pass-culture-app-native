import React from 'react'

import { navigate, useRoute } from '__mocks__/@react-navigation/native'
import { ApiError } from 'api/ApiError'
import { RecommendationApiParams, SubcategoryIdEnum } from 'api/gen'
import * as Auth from 'features/auth/context/AuthContext'
import { BookingState, Step } from 'features/bookOffer/context/reducer'
import { mockOffer as baseOffer } from 'features/bookOffer/fixtures/offer'
import { mockStocks } from 'features/bookOffer/fixtures/stocks'
import { IBookingContext } from 'features/bookOffer/types'
import { VenueListItem } from 'features/offer/components/VenueSelectionList/VenueSelectionList'
import { PlaylistType } from 'features/offer/enums'
import { beneficiaryUser } from 'fixtures/user'
import * as logOfferConversionAPI from 'libs/algolia/analytics/logOfferConversion'
import { analytics } from 'libs/analytics/provider'
import { CampaignEvents, campaignTracker } from 'libs/campaign/campaign'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import * as useBookOfferMutation from 'queries/bookOffer/useBookOfferMutation'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen, userEvent } from 'tests/utils'
import { SnackBarHelperSettings } from 'ui/components/snackBar/types'

import { BookingOfferModalComponent } from './BookingOfferModal'

jest.mock('libs/firebase/analytics/analytics')

jest.mock('libs/campaign/campaign')

const mockDismissModal = jest.fn()
const mockDispatch = jest.fn()

const mockOffer = { ...baseOffer, subcategoryId: SubcategoryIdEnum.SEANCE_CINE }

const mockUseBookingContext: jest.Mock<IBookingContext> = jest.fn(() => ({
  bookingState: { offerId: mockOffer.id, step: Step.DATE } as BookingState,
  dismissModal: mockDismissModal,
  dispatch: mockDispatch,
}))
jest.mock('features/bookOffer/context/useBookingContext', () => ({
  useBookingContext: () => mockUseBookingContext(),
}))

const mockUseOfferQuery = jest.fn()
mockUseOfferQuery.mockReturnValue({
  data: mockOffer,
})
jest.mock('queries/offer/useOfferQuery', () => ({
  useOfferQuery: () => mockUseOfferQuery(),
}))

jest.mock('queries/offer/useBookingOfferQuery', () => ({
  useBookingOfferQuery: jest.fn(() => mockOffer),
}))

jest.mock('libs/subcategories/useSubcategories')

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
jest.mock('queries/searchVenuesOffer/useSearchVenueOffersInfiniteQuery', () => ({
  useSearchVenueOffersInfiniteQuery: () => ({
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

jest.mock('libs/firebase/analytics/analytics')

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

const user = userEvent.setup()
jest.useFakeTimers()

describe('<BookingOfferModalComponent />', () => {
  beforeEach(() => {
    setFeatureFlags()
  })

  it('should dismiss modal when click on rightIconButton and reset state', async () => {
    renderBookingOfferModal({ offerId: mockOffer.id })

    const dismissModalButton = screen.getByTestId('Fermer la modale')

    await user.press(dismissModalButton)

    expect(mockDispatch).toHaveBeenCalledWith({ type: 'RESET' })
    expect(mockDispatch).toHaveBeenNthCalledWith(1, {
      type: 'SET_OFFER_ID',
      payload: mockOffer.id,
    })
    expect(mockDismissModal).toHaveBeenCalledTimes(1)
  })

  it('should set offer consulted when dismiss modal and an other venue has been selected', async () => {
    renderBookingOfferModal({})

    const dismissModalButton = screen.getByTestId('Fermer la modale')

    await user.press(dismissModalButton)

    expect(mockDispatch).toHaveBeenNthCalledWith(2, { type: 'SET_OFFER_ID', payload: 20 })
  })

  it('should not log event ClickBookOffer when modal is not visible', () => {
    renderBookingOfferModal({ visible: false })

    expect(analytics.logClickBookOffer).not.toHaveBeenCalled()
  })

  it('should log event ClickBookOffer when modal opens', () => {
    const offerId = 30
    renderBookingOfferModal({ offerId })

    expect(analytics.logClickBookOffer).toHaveBeenCalledWith({ offerId })
  })

  it('should show AlreadyBooked when isEndedUsedBooking is true', () => {
    const offerId = 30
    renderBookingOfferModal({ offerId, isEndedUsedBooking: true })

    expect(screen.getByText('Tu as déjà réservé :')).toBeOnTheScreen()
    expect(
      screen.getByTestId(`Nouvelle fenêtre : Pourquoi limiter les réservations\u00a0?`)
    ).toBeOnTheScreen()
  })

  it('should log booking funnel cancellation event when closing the modal', async () => {
    renderBookingOfferModal({})
    const dismissModalButton = screen.getByTestId('Fermer la modale')

    await user.press(dismissModalButton)

    expect(analytics.logCancelBookingFunnel).toHaveBeenNthCalledWith(1, Step.DATE, 20)
  })

  it('should display modal with prices by categories', () => {
    mockUseOfferQuery.mockReturnValueOnce({ data: { ...mockOffer, stocks: mockStocks } })
    renderBookingOfferModal({})

    expect(screen.getByTestId('modalWithPricesByCategories')).toBeOnTheScreen()
  })

  describe('when booking step is confirmation', () => {
    beforeEach(() => {
      mockUseBookingContext.mockReturnValue({
        bookingState: {
          offerId: mockOffer.id,
          step: Step.CONFIRMATION,
          quantity: 1,
          stockId: mockOffer.stocks[0].id,
        } as BookingState,
        dismissModal: mockDismissModal,
        dispatch: mockDispatch,
      })
      mockUseMutationSuccess()
    })

    describe('when booking validated', () => {
      it('should dismiss the modal on success', async () => {
        renderBookingOfferModal({})

        await user.press(
          await screen.findByRole('checkbox', {
            name: 'J’ai lu et j’accepte les conditions générales d’utilisation - obligatoire',
          })
        )

        await user.press(screen.getByText('Confirmer la réservation'))

        expect(mockDismissModal).toHaveBeenCalledTimes(1)
      })

      it('should log confirmation booking when offer booked from a similar offer', async () => {
        useRoute.mockReturnValueOnce({
          params: {
            fromOfferId: 1,
            fromMultivenueOfferId: 1,
            apiRecoParams: JSON.stringify(apiRecoParams),
            playlistType: PlaylistType.SAME_CATEGORY_SIMILAR_OFFERS,
          },
        })
        renderBookingOfferModal({})

        await user.press(
          await screen.findByRole('checkbox', {
            name: 'J’ai lu et j’accepte les conditions générales d’utilisation - obligatoire',
          })
        )

        await user.press(screen.getByText('Confirmer la réservation'))

        expect(analytics.logBookingConfirmation).toHaveBeenCalledWith({
          ...apiRecoParams,
          bookingId: '1',
          fromMultivenueOfferId: '1',
          fromOfferId: undefined,
          offerId: '20',
          playlistType: PlaylistType.SAME_CATEGORY_SIMILAR_OFFERS,
        })
      })

      it('should log confirmation booking when offer not booked from a similar offer', async () => {
        renderBookingOfferModal({})

        await user.press(
          await screen.findByRole('checkbox', {
            name: 'J’ai lu et j’accepte les conditions générales d’utilisation - obligatoire',
          })
        )

        await user.press(screen.getByText('Confirmer la réservation'))

        expect(analytics.logBookingConfirmation).toHaveBeenCalledWith({
          bookingId: '1',
          offerId: '20',
        })
      })

      it('should log conversion booking when is from search', async () => {
        useRoute.mockReturnValueOnce({
          params: { from: 'searchresults' },
        })
        renderBookingOfferModal({})

        await user.press(
          await screen.findByRole('checkbox', {
            name: 'J’ai lu et j’accepte les conditions générales d’utilisation - obligatoire',
          })
        )

        await user.press(screen.getByText('Confirmer la réservation'))

        expect(logOfferConversionSpy).toHaveBeenCalledWith('20')
      })

      it('should not log conversion booking when is not from search', async () => {
        renderBookingOfferModal({})

        await user.press(
          await screen.findByRole('checkbox', {
            name: 'J’ai lu et j’accepte les conditions générales d’utilisation - obligatoire',
          })
        )

        await user.press(screen.getByText('Confirmer la réservation'))

        expect(logOfferConversionSpy).not.toHaveBeenCalled()
      })

      it('should log campaign tracker when booking is complete', async () => {
        renderBookingOfferModal({ offerId: mockOffer.id })
        await user.press(
          await screen.findByRole('checkbox', {
            name: 'J’ai lu et j’accepte les conditions générales d’utilisation - obligatoire',
          })
        )

        await user.press(screen.getByText('Confirmer la réservation'))

        expect(campaignTracker.logEvent).toHaveBeenCalledWith(CampaignEvents.COMPLETE_BOOK_OFFER, {
          af_offer_id: mockOffer.id,
          af_booking_id: mockOffer.stocks[0].id,
          af_price: mockOffer.stocks[0].price,
          af_category: mockOffer.subcategoryId,
        })
      })

      it('should navigate to booking confirmation when booking is complete', async () => {
        renderBookingOfferModal({})

        await user.press(
          await screen.findByRole('checkbox', {
            name: 'J’ai lu et j’accepte les conditions générales d’utilisation - obligatoire',
          })
        )

        await user.press(screen.getByText('Confirmer la réservation'))

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
            stockId: mockOffer.stocks[0].id,
          } as BookingState,
          dismissModal: mockDismissModal,
          dispatch: mockDispatch,
        })
      })

      it('should dismiss the modal on error', async () => {
        mockUseMutationError({
          content: {},
          name: 'ApiError',
          statusCode: 400,
          message: 'erreur',
        })
        renderBookingOfferModal({})

        await user.press(
          await screen.findByRole('checkbox', {
            name: 'J’ai lu et j’accepte les conditions générales d’utilisation - obligatoire',
          })
        )

        await user.press(screen.getByText('Confirmer la réservation'))

        expect(mockDismissModal).toHaveBeenCalledTimes(1)
      })

      it('should log booking error when error is known', async () => {
        mockUseMutationError({
          content: { code: 'INSUFFICIENT_CREDIT' },
          name: 'ApiError',
          statusCode: 400,
          message: 'erreur',
        })
        renderBookingOfferModal({})

        await user.press(
          await screen.findByRole('checkbox', {
            name: 'J’ai lu et j’accepte les conditions générales d’utilisation - obligatoire',
          })
        )

        await user.press(screen.getByText('Confirmer la réservation'))

        expect(analytics.logBookingError).toHaveBeenNthCalledWith(1, 20, 'INSUFFICIENT_CREDIT')
      })

      it('should log booking error when error is unknown', async () => {
        mockUseMutationError({
          content: {},
          name: 'ApiError',
          statusCode: 400,
          message: 'erreur',
        })
        renderBookingOfferModal({})

        await user.press(
          await screen.findByRole('checkbox', {
            name: 'J’ai lu et j’accepte les conditions générales d’utilisation - obligatoire',
          })
        )

        await user.press(screen.getByText('Confirmer la réservation'))

        expect(analytics.logBookingError).not.toHaveBeenCalled()
      })

      it.each`
        code                                 | message
        ${undefined}                         | ${'En raison d’une erreur technique, l’offre n’a pas pu être réservée'}
        ${'INSUFFICIENT_CREDIT'}             | ${'Attention, ton crédit est insuffisant pour pouvoir réserver cette offre\u00a0!'}
        ${'ALREADY_BOOKED'}                  | ${'Attention, il est impossible de réserver plusieurs fois la même offre\u00a0!'}
        ${'STOCK_NOT_BOOKABLE'}              | ${'Oups, cette offre n’est plus disponible\u00a0!'}
        ${'PROVIDER_STOCK_NOT_ENOUGH_SEATS'} | ${'Désolé, il n’y a plus de place pour cette séance\u00a0!'}
        ${'PROVIDER_BOOKING_TIMEOUT'}        | ${'Nous t’invitons à réessayer un peu plus tard'}
        ${'PROVIDER_SHOW_DOES_NOT_EXIST'}    | ${'Oups, cette offre n’est plus disponible\u00a0!'}
      `(
        'should show the error snackbar with message="$message" for errorCode="$code" if booking an offer fails',
        async ({ code, message }: { code: string | undefined; message: string }) => {
          mockUseMutationError({
            content: { code },
            name: 'ApiError',
            statusCode: 400,
            message: 'erreur',
          })
          renderBookingOfferModal({})

          await user.press(
            await screen.findByRole('checkbox', {
              name: 'J’ai lu et j’accepte les conditions générales d’utilisation - obligatoire',
            })
          )

          await user.press(screen.getByText('Confirmer la réservation'))

          expect(mockShowErrorSnackBar).toHaveBeenNthCalledWith(1, { timeout: 5000, message })
        }
      )
    })

    describe('when booking comes from a movie screening', () => {
      const bookingDataMovieScreening = {
        date: new Date('2024-03-14T14:00:00.000Z'),
        hour: 15,
        stockId: 6177,
      }

      it('should update bookingState when bookingDataMovieScreening props is received', async () => {
        renderBookingOfferModal({ bookingDataMovieScreening })

        expect(mockDispatch).toHaveBeenNthCalledWith(2, {
          type: 'SELECT_DATE',
          payload: bookingDataMovieScreening.date,
        })
      })

      it('should log HAS_BOOKED_CINE_SCREENING_OFFER', async () => {
        renderBookingOfferModal({ bookingDataMovieScreening })

        await user.press(
          await screen.findByRole('checkbox', {
            name: 'J’ai lu et j’accepte les conditions générales d’utilisation - obligatoire',
          })
        )

        await user.press(screen.getByText('Confirmer la réservation'))

        expect(analytics.logHasBookedCineScreeningOffer).toHaveBeenCalledTimes(1)
      })
    })
  })
})

const renderBookingOfferModal = ({
  offerId = 20,
  bookingDataMovieScreening,
  visible = true,
  isEndedUsedBooking,
}: {
  isEndedUsedBooking?: boolean
  visible?: boolean
  offerId?: number
  bookingDataMovieScreening?: {
    date: Date
    hour: number
    stockId: number
  }
}) => {
  render(
    reactQueryProviderHOC(
      <BookingOfferModalComponent
        isEndedUsedBooking={isEndedUsedBooking}
        visible={visible}
        offerId={offerId}
        bookingDataMovieScreening={bookingDataMovieScreening}
      />
    )
  )
}
