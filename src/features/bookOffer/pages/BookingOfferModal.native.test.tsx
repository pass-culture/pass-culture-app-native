import React from 'react'

import { navigate, useRoute } from '__mocks__/@react-navigation/native'
import { ApiError } from 'api/ApiError'
import { RecommendationApiParams, SubcategoryIdEnum } from 'api/gen'
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
import * as useFeatureFlag from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { storage } from 'libs/storage'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, fireEvent, render, screen, waitFor } from 'tests/utils'
import { SnackBarHelperSettings } from 'ui/components/snackBar/types'

import { BookingOfferModalComponent } from './BookingOfferModal'

jest.mock('libs/campaign')

const mockDismissModal = jest.fn()
const mockDispatch = jest.fn()

const mockFeatureFlag = jest.spyOn(useFeatureFlag, 'useFeatureFlag').mockReturnValue(false)

const mockOffer = baseOffer

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

jest.mock('libs/firebase/analytics/analytics')

jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter')

jest.mock('react-native-safe-area-context', () => ({
  ...(jest.requireActual('react-native-safe-area-context') as Record<string, unknown>),
  useSafeAreaInsets: () => ({ bottom: 16, right: 16, left: 16, top: 16 }),
}))

jest.mock('@batch.com/react-native-plugin', () =>
  jest.requireActual('__mocks__/libs/react-native-batch')
)

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

describe('<BookingOfferModalComponent />', () => {
  it('should dismiss modal when click on rightIconButton and reset state', async () => {
    render(reactQueryProviderHOC(<BookingOfferModalComponent visible offerId={mockOffer.id} />))

    const dismissModalButton = screen.getByTestId('Fermer la modale')

    await act(() => {
      fireEvent.press(dismissModalButton)
    })

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith({ type: 'RESET' })
    })
    await waitFor(() => {
      expect(mockDispatch).toHaveBeenNthCalledWith(1, {
        type: 'SET_OFFER_ID',
        payload: mockOffer.id,
      })
    })
    await waitFor(() => {
      expect(mockDismissModal).toHaveBeenCalledTimes(1)
    })
  })

  it('should set offer consulted when dismiss modal and an other venue has been selected', async () => {
    render(reactQueryProviderHOC(<BookingOfferModalComponent visible offerId={20} />))

    const dismissModalButton = screen.getByTestId('Fermer la modale')

    await act(() => {
      fireEvent.press(dismissModalButton)
    })

    expect(mockDispatch).toHaveBeenNthCalledWith(2, { type: 'SET_OFFER_ID', payload: 20 })
  })

  it('should not log event ClickBookOffer when modal is not visible', () => {
    render(reactQueryProviderHOC(<BookingOfferModalComponent visible={false} offerId={20} />))

    expect(analytics.logClickBookOffer).not.toHaveBeenCalled()
  })

  it('should log event ClickBookOffer when modal opens', () => {
    const offerId = 30
    render(reactQueryProviderHOC(<BookingOfferModalComponent visible offerId={offerId} />))

    expect(analytics.logClickBookOffer).toHaveBeenCalledWith({ offerId })
  })

  it('should show AlreadyBooked when isEndedUsedBooking is true', () => {
    const offerId = 30
    render(
      reactQueryProviderHOC(
        <BookingOfferModalComponent visible offerId={offerId} isEndedUsedBooking />
      )
    )

    expect(screen.getByText('Tu as déjà réservé :')).toBeOnTheScreen()
    expect(
      screen.getByTestId(`Nouvelle fenêtre : Pourquoi limiter les réservations\u00a0?`)
    ).toBeOnTheScreen()
  })

  it('should log booking funnel cancellation event when closing the modal', async () => {
    render(reactQueryProviderHOC(<BookingOfferModalComponent visible offerId={20} />))
    const dismissModalButton = screen.getByTestId('Fermer la modale')

    await act(() => {
      fireEvent.press(dismissModalButton)
    })

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
          stockId: mockOffer.stocks[0].id,
        } as BookingState,
        dismissModal: mockDismissModal,
        dispatch: mockDispatch,
      })
      mockUseMutationSuccess()
    })

    describe('when booking validated', () => {
      it('should dismiss the modal on success', async () => {
        render(<BookingOfferModalComponent visible offerId={20} />)

        fireEvent.press(
          await screen.findByRole('checkbox', {
            name: 'J’ai lu et j’accepte les conditions générales d’utilisation',
          })
        )

        fireEvent.press(screen.getByText('Confirmer la réservation'))

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
        render(<BookingOfferModalComponent visible offerId={20} />)

        fireEvent.press(
          await screen.findByRole('checkbox', {
            name: 'J’ai lu et j’accepte les conditions générales d’utilisation',
          })
        )

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

      it('should log confirmation booking when offer not booked from a similar offer', async () => {
        render(<BookingOfferModalComponent visible offerId={20} />)

        fireEvent.press(
          await screen.findByRole('checkbox', {
            name: 'J’ai lu et j’accepte les conditions générales d’utilisation',
          })
        )

        fireEvent.press(screen.getByText('Confirmer la réservation'))

        expect(analytics.logBookingConfirmation).toHaveBeenCalledWith({ bookingId: 1, offerId: 20 })
      })

      it('should log conversion booking when is from search', async () => {
        useRoute.mockReturnValueOnce({
          params: { from: 'searchresults' },
        })
        render(<BookingOfferModalComponent visible offerId={20} />)

        fireEvent.press(
          await screen.findByRole('checkbox', {
            name: 'J’ai lu et j’accepte les conditions générales d’utilisation',
          })
        )

        fireEvent.press(screen.getByText('Confirmer la réservation'))

        expect(logOfferConversionSpy).toHaveBeenCalledWith('20')
      })

      it('should not log conversion booking when is not from search', async () => {
        render(<BookingOfferModalComponent visible offerId={20} />)

        fireEvent.press(
          await screen.findByRole('checkbox', {
            name: 'J’ai lu et j’accepte les conditions générales d’utilisation',
          })
        )

        fireEvent.press(screen.getByText('Confirmer la réservation'))

        expect(logOfferConversionSpy).not.toHaveBeenCalled()
      })

      it('should log campaign tracker when booking is complete', async () => {
        render(<BookingOfferModalComponent visible offerId={mockOffer.id} />)

        fireEvent.press(
          await screen.findByRole('checkbox', {
            name: 'J’ai lu et j’accepte les conditions générales d’utilisation',
          })
        )

        fireEvent.press(screen.getByText('Confirmer la réservation'))

        expect(campaignTracker.logEvent).toHaveBeenCalledWith(CampaignEvents.COMPLETE_BOOK_OFFER, {
          af_offer_id: mockOffer.id,
          af_booking_id: mockOffer.stocks[0].id,
          af_price: mockOffer.stocks[0].price,
          af_category: mockOffer.subcategoryId,
        })
      })

      it('should navigate to booking confirmation when booking is complete', async () => {
        render(<BookingOfferModalComponent visible offerId={20} />)

        fireEvent.press(
          await screen.findByRole('checkbox', {
            name: 'J’ai lu et j’accepte les conditions générales d’utilisation',
          })
        )

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
        render(<BookingOfferModalComponent visible offerId={20} />)

        fireEvent.press(
          await screen.findByRole('checkbox', {
            name: 'J’ai lu et j’accepte les conditions générales d’utilisation',
          })
        )

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

        fireEvent.press(
          await screen.findByRole('checkbox', {
            name: 'J’ai lu et j’accepte les conditions générales d’utilisation',
          })
        )

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

        fireEvent.press(
          await screen.findByRole('checkbox', {
            name: 'J’ai lu et j’accepte les conditions générales d’utilisation',
          })
        )

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
        async ({ code, message }: { code: string | undefined; message: string }) => {
          mockUseMutationError({
            content: { code },
            name: 'ApiError',
            statusCode: 400,
            message: 'erreur',
          })
          render(<BookingOfferModalComponent visible offerId={20} />)

          fireEvent.press(
            await screen.findByRole('checkbox', {
              name: 'J’ai lu et j’accepte les conditions générales d’utilisation',
            })
          )

          fireEvent.press(screen.getByText('Confirmer la réservation'))

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
        render(
          reactQueryProviderHOC(
            <BookingOfferModalComponent
              visible
              offerId={20}
              bookingDataMovieScreening={bookingDataMovieScreening}
            />
          )
        )

        expect(mockDispatch).toHaveBeenNthCalledWith(2, {
          type: 'SELECT_DATE',
          payload: bookingDataMovieScreening.date,
        })
      })
    })
  })

  describe('when booking comes from music live', () => {
    beforeEach(() => {
      mockUseOffer.mockReturnValue({
        data: {
          ...mockOffer,
          stocks: mockStocks,
          subcategoryId: SubcategoryIdEnum.FESTIVAL_MUSIQUE,
        },
      })
      mockFeatureFlag.mockReturnValue(true)
      storageResetDisplayedModal()
    })

    it('should open SurveyModal if FF surveyMusicLive is on', async () => {
      render(reactQueryProviderHOC(<BookingOfferModalComponent visible offerId={20} />))
      const dismissModalButton = screen.getByTestId('Fermer la modale')

      await act(() => fireEvent.press(dismissModalButton))

      expect(screen.getByText('Cette offre ne t’intéresse plus ?')).toBeOnTheScreen()
    })

    it("should'nt open SurveyModal if FF surveyMusicLive is off", async () => {
      mockFeatureFlag.mockReturnValueOnce(false).mockReturnValueOnce(false)
      render(reactQueryProviderHOC(<BookingOfferModalComponent visible offerId={20} />))
      const dismissModalButton = screen.getByTestId('Fermer la modale')

      await act(() => {
        fireEvent.press(dismissModalButton)
      })

      expect(screen.queryByText('Cette offre ne t’intéresse plus ?')).not.toBeOnTheScreen()
    })

    it("should'nt open SurveyModal if offer is not music live", async () => {
      mockUseOffer.mockReturnValueOnce({
        ...baseOffer,
        subcategoryId: SubcategoryIdEnum.LIVRE_NUMERIQUE,
      })
      render(reactQueryProviderHOC(<BookingOfferModalComponent visible offerId={20} />))
      const dismissModalButton = screen.getByTestId('Fermer la modale')

      await act(() => {
        fireEvent.press(dismissModalButton)
      })

      expect(screen.queryByText("Cette offre ne t'intéresse plus ?")).not.toBeOnTheScreen()
    })

    it("shouldn't show SurveyModal more than once", async () => {
      storeDisplayedModal()
      render(reactQueryProviderHOC(<BookingOfferModalComponent visible offerId={20} />))
      const dismissModalButton = screen.getByTestId('Fermer la modale')

      await act(() => {
        fireEvent.press(dismissModalButton)
      })

      expect(screen.queryByText("Cette offre ne t'intéresse plus ?")).not.toBeOnTheScreen()
    })
  })
})

const storageResetDisplayedModal = async () => {
  await storage.saveString('times_music_live_booking_survey_has_been_displayed', '0')
}

const storeDisplayedModal = async () => {
  await storage.saveString('times_music_live_booking_survey_has_been_displayed', String('1'))
}
