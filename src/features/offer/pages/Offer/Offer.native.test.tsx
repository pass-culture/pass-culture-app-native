import { rest } from 'msw'

import { mockedBookingApi } from '__mocks__/fixtures/booking'
import { BookingsResponse, SearchGroupNameEnumv2 } from 'api/gen'
import { useAuthContext } from 'features/auth/context/AuthContext'
import * as useSimilarOffers from 'features/offer/api/useSimilarOffers'
import { PlaylistType } from 'features/offer/enums'
import { offerResponseSnap } from 'features/offer/fixtures/offerResponse'
import { offerId, renderOfferPage } from 'features/offer/helpers/renderOfferPageTestUtil'
import { beneficiaryUser } from 'fixtures/user'
import { mockedAlgoliaResponse } from 'libs/algolia/__mocks__/mockedAlgoliaResponse'
import { env } from 'libs/environment'
import { analytics } from 'libs/firebase/analytics'
import * as useFeatureFlagAPI from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { server } from 'tests/server'
import { act, fireEvent, screen, waitFor } from 'tests/utils'

/* TODO(LucasBeneston): Remove this mock when update to Jest 28
  In jest version 28, I don't bring that error :
  TypeError: requestAnimationFrame is not a function */
jest.mock('react-native/Libraries/Animated/animations/TimingAnimation')

jest.mock('features/auth/context/AuthContext')
const mockUseAuthContext = useAuthContext as jest.MockedFunction<typeof useAuthContext>

const useSimilarOffersSpy = jest.spyOn(useSimilarOffers, 'useSimilarOffers').mockImplementation()

let mockShouldUseAlgoliaRecommend = false
jest.mock('libs/firebase/remoteConfig/RemoteConfigProvider', () => ({
  useRemoteConfigContext: () => ({
    shouldUseAlgoliaRecommend: mockShouldUseAlgoliaRecommend,
  }),
}))

jest.spyOn(useFeatureFlagAPI, 'useFeatureFlag').mockReturnValue(true)

describe('<Offer />', () => {
  beforeEach(() => {
    jest.useFakeTimers('legacy')
    mockUseAuthContext.mockReturnValue({
      isLoggedIn: false,
      setIsLoggedIn: jest.fn(),
      refetchUser: jest.fn(),
      isUserLoading: false,
    })
  })

  it('animates on scroll', async () => {
    renderOfferPage()
    expect(screen.getByTestId('offerHeaderName').props.style.opacity).toBe(0)

    await act(async () => {
      const scrollContainer = screen.getByTestId('offer-container')
      fireEvent.scroll(scrollContainer, scrollEvent)
    })

    expect(screen.getByTestId('offerHeaderName').props.style.opacity).toBe(1)
  })

  it('should display authentication modal when clicking on "Réserver l’offre"', async () => {
    mockUseAuthContext.mockReturnValueOnce({
      isLoggedIn: false,
      setIsLoggedIn: jest.fn(),
      isUserLoading: false,
      refetchUser: jest.fn(),
      user: undefined,
    })

    renderOfferPage()

    const bookingOfferButton = await screen.findByText('Réserver l’offre')
    fireEvent.press(bookingOfferButton)

    expect(screen.queryByText('Identifie-toi pour réserver l’offre')).toBeTruthy()
  })

  it('should log analytics when display authentication modal', async () => {
    mockUseAuthContext.mockImplementationOnce(() => ({
      isLoggedIn: false,
      setIsLoggedIn: jest.fn(),
      refetchUser: jest.fn(),
      isUserLoading: false,
    }))

    renderOfferPage()

    const bookingOfferButton = await screen.findByText('Réserver l’offre')
    fireEvent.press(bookingOfferButton)

    expect(analytics.logConsultAuthenticationModal).toHaveBeenNthCalledWith(1, offerId)
  })

  describe('with similar offers', () => {
    it('should pass offer venue position to `useSimilarOffers`', async () => {
      renderOfferPage()

      await waitFor(() => {
        expect(useSimilarOffersSpy).toHaveBeenNthCalledWith(1, {
          categoryIncluded: SearchGroupNameEnumv2.FILMS_SERIES_CINEMA,
          offerId: offerResponseSnap.id,
          position: offerResponseSnap.venue.coordinates,
          shouldUseAlgoliaRecommend: false,
        })
        expect(useSimilarOffersSpy).toHaveBeenNthCalledWith(2, {
          categoryExcluded: SearchGroupNameEnumv2.FILMS_SERIES_CINEMA,
          offerId: offerResponseSnap.id,
          position: offerResponseSnap.venue.coordinates,
          shouldUseAlgoliaRecommend: false,
        })
      })
    })

    it('should log two logPlaylistVerticalScroll events when scrolling vertical and reaching the bottom when there are 2 playlists', async () => {
      useSimilarOffersSpy.mockReturnValueOnce(mockedAlgoliaResponse.hits)
      useSimilarOffersSpy.mockReturnValueOnce(mockedAlgoliaResponse.hits)

      const { getByTestId } = renderOfferPage()
      const scrollView = getByTestId('offer-container')

      fireEvent.scroll(scrollView, nativeEventBottom)

      await waitFor(() => {
        expect(analytics.logPlaylistVerticalScroll).toHaveBeenNthCalledWith(1, {
          fromOfferId: undefined,
          offerId: 116656,
          playlistType: PlaylistType.SAME_CATEGORY_SIMILAR_OFFERS,
          shouldUseAlgoliaRecommend: false,
        })
        expect(analytics.logPlaylistVerticalScroll).toHaveBeenNthCalledWith(2, {
          fromOfferId: undefined,
          offerId: 116656,
          playlistType: PlaylistType.OTHER_CATEGORIES_SIMILAR_OFFERS,
          shouldUseAlgoliaRecommend: false,
        })
      })
    })

    it('should not log two logPlaylistVerticalScroll events when scrolling vertical and reaching the bottom when playlist are empty', async () => {
      useSimilarOffersSpy.mockReturnValueOnce([])
      useSimilarOffersSpy.mockReturnValueOnce([])
      const { getByTestId } = renderOfferPage()
      const scrollView = getByTestId('offer-container')

      fireEvent.scroll(scrollView, nativeEventBottom)

      await waitFor(() => {
        expect(analytics.logPlaylistVerticalScroll).not.toHaveBeenNthCalledWith(1, {
          fromOfferId: undefined,
          offerId: 116656,
          playlistType: PlaylistType.SAME_CATEGORY_SIMILAR_OFFERS,
          shouldUseAlgoliaRecommend: false,
        })
        expect(analytics.logPlaylistVerticalScroll).not.toHaveBeenNthCalledWith(2, {
          fromOfferId: undefined,
          offerId: 116656,
          playlistType: PlaylistType.OTHER_CATEGORIES_SIMILAR_OFFERS,
          shouldUseAlgoliaRecommend: false,
        })
      })
    })

    describe('When there is only same category similar offers playlist', () => {
      beforeAll(() => {
        useSimilarOffersSpy.mockReturnValueOnce(mockedAlgoliaResponse.hits)
        useSimilarOffersSpy.mockReturnValueOnce([])
      })

      it('should log logPlaylistVerticalScroll event with same category similar offers playlist param when scrolling vertical and reaching the bottom ', async () => {
        const { getByTestId } = renderOfferPage()
        const scrollView = getByTestId('offer-container')

        fireEvent.scroll(scrollView, nativeEventBottom)

        await waitFor(() => {
          expect(analytics.logPlaylistVerticalScroll).toHaveBeenNthCalledWith(1, {
            fromOfferId: undefined,
            offerId: 116656,
            playlistType: PlaylistType.SAME_CATEGORY_SIMILAR_OFFERS,
            shouldUseAlgoliaRecommend: false,
          })
        })
      })

      it('should not log logPlaylistVerticalScroll event with other categories similar offers playlist param when scrolling vertical and reaching the bottom', async () => {
        const { getByTestId } = renderOfferPage()
        const scrollView = getByTestId('offer-container')

        fireEvent.scroll(scrollView, nativeEventBottom)

        await waitFor(() => {
          expect(analytics.logPlaylistVerticalScroll).not.toHaveBeenCalledWith({
            fromOfferId: undefined,
            offerId: 116656,
            playlistType: PlaylistType.OTHER_CATEGORIES_SIMILAR_OFFERS,
            shouldUseAlgoliaRecommend: false,
          })
        })
      })
    })

    describe('When there is only other categories similar offers playlist', () => {
      beforeAll(() => {
        useSimilarOffersSpy.mockReturnValueOnce([])
        useSimilarOffersSpy.mockReturnValueOnce(mockedAlgoliaResponse.hits)
      })

      it('should log logPlaylistVerticalScroll event with other categories similar offers playlist param when scrolling vertical and reaching the bottom', async () => {
        const { getByTestId } = renderOfferPage()
        const scrollView = getByTestId('offer-container')

        fireEvent.scroll(scrollView, nativeEventBottom)

        await waitFor(() => {
          expect(analytics.logPlaylistVerticalScroll).toHaveBeenNthCalledWith(1, {
            fromOfferId: undefined,
            offerId: 116656,
            playlistType: PlaylistType.OTHER_CATEGORIES_SIMILAR_OFFERS,
            shouldUseAlgoliaRecommend: false,
          })
        })
      })

      it('should not log logPlaylistVerticalScroll event with same category similar offers playlist param when scrolling vertical and reaching the bottom', async () => {
        const { getByTestId } = renderOfferPage()
        const scrollView = getByTestId('offer-container')

        fireEvent.scroll(scrollView, nativeEventBottom)

        await waitFor(() => {
          expect(analytics.logPlaylistVerticalScroll).not.toHaveBeenCalledWith({
            fromOfferId: undefined,
            offerId: 116656,
            playlistType: PlaylistType.SAME_CATEGORY_SIMILAR_OFFERS,
            shouldUseAlgoliaRecommend: false,
          })
        })
      })
    })

    it('should not log logPlaylistVerticalScroll event when scrolling vertical and not reaching the bottom', async () => {
      useSimilarOffersSpy.mockReturnValueOnce(mockedAlgoliaResponse.hits)
      useSimilarOffersSpy.mockReturnValueOnce(mockedAlgoliaResponse.hits)
      renderOfferPage()
      const scrollView = screen.getByTestId('offer-container')

      fireEvent.scroll(scrollView, nativeEventTop)

      await waitFor(() => {
        expect(analytics.logPlaylistVerticalScroll).not.toHaveBeenNthCalledWith(1, {
          fromOfferId: undefined,
          offerId: 116656,
          playlistType: PlaylistType.SAME_CATEGORY_SIMILAR_OFFERS,
          shouldUseAlgoliaRecommend: false,
        })
        expect(analytics.logPlaylistVerticalScroll).not.toHaveBeenNthCalledWith(2, {
          fromOfferId: undefined,
          offerId: 116656,
          playlistType: PlaylistType.OTHER_CATEGORIES_SIMILAR_OFFERS,
          shouldUseAlgoliaRecommend: false,
        })
      })
    })

    it('should log logPlaylistVerticalScroll with the event param fromOfferId & offerId', async () => {
      useSimilarOffersSpy.mockReturnValueOnce(mockedAlgoliaResponse.hits)
      useSimilarOffersSpy.mockReturnValueOnce(mockedAlgoliaResponse.hits)
      const fromOfferId = 1
      const offerId = 116656
      renderOfferPage(fromOfferId)
      const scrollView = screen.getByTestId('offer-container')

      fireEvent.scroll(scrollView, nativeEventBottom)

      await waitFor(() => {
        expect(analytics.logPlaylistVerticalScroll).toHaveBeenNthCalledWith(1, {
          fromOfferId,
          offerId,
          playlistType: PlaylistType.SAME_CATEGORY_SIMILAR_OFFERS,
          shouldUseAlgoliaRecommend: false,
        })
        expect(analytics.logPlaylistVerticalScroll).toHaveBeenNthCalledWith(2, {
          fromOfferId,
          offerId,
          playlistType: PlaylistType.OTHER_CATEGORIES_SIMILAR_OFFERS,
          shouldUseAlgoliaRecommend: false,
        })
      })
    })

    describe('When A/B Testing activated', () => {
      beforeEach(() => {
        mockShouldUseAlgoliaRecommend = true
      })
      it('should log two logPlaylistVerticalScroll events when scrolling vertical and reaching the bottom when there are 2 playlists when A/B Testing activated', async () => {
        useSimilarOffersSpy.mockReturnValueOnce(mockedAlgoliaResponse.hits)
        useSimilarOffersSpy.mockReturnValueOnce(mockedAlgoliaResponse.hits)
        const { getByTestId } = renderOfferPage()
        const scrollView = getByTestId('offer-container')

        fireEvent.scroll(scrollView, nativeEventBottom)

        await waitFor(() => {
          expect(analytics.logPlaylistVerticalScroll).toHaveBeenNthCalledWith(1, {
            fromOfferId: undefined,
            offerId: 116656,
            playlistType: PlaylistType.SAME_CATEGORY_SIMILAR_OFFERS,
            shouldUseAlgoliaRecommend: true,
          })
          expect(analytics.logPlaylistVerticalScroll).toHaveBeenNthCalledWith(2, {
            fromOfferId: undefined,
            offerId: 116656,
            playlistType: PlaylistType.OTHER_CATEGORIES_SIMILAR_OFFERS,
            shouldUseAlgoliaRecommend: true,
          })
        })
      })
    })
  })

  it('should open booking modale when login after booking attempt', async () => {
    const newLocal = {
      isLoggedIn: true,
      setIsLoggedIn: jest.fn(),
      isUserLoading: false,
      refetchUser: jest.fn(),
      user: beneficiaryUser,
    }
    // Multiple renders force us to mock auth context as loggedIn user in this test
    // eslint-disable-next-line local-rules/independent-mocks
    mockUseAuthContext.mockReturnValue(newLocal)
    const fromOfferId = 1
    renderOfferPage(fromOfferId, undefined, true)

    expect(await screen.findByText('Valider la date')).toBeTruthy()
  })

  it('should display reservation impossible when user has already booked the offer', async () => {
    const newLocal = {
      isLoggedIn: true,
      setIsLoggedIn: jest.fn(),
      isUserLoading: false,
      refetchUser: jest.fn(),
      user: beneficiaryUser,
    }
    // Multiple renders force us to mock auth context as loggedIn user in this test
    // eslint-disable-next-line local-rules/independent-mocks
    mockUseAuthContext.mockReturnValue(newLocal)

    const expectedResponse: BookingsResponse = {
      ended_bookings: [
        {
          ...mockedBookingApi,
          stock: {
            ...mockedBookingApi.stock,
            offer: { ...mockedBookingApi.stock.offer, id: offerId },
          },
          dateUsed: '2023-02-14T10:10:08.800599Z',
        },
      ],
      hasBookingsAfter18: false,
      ongoing_bookings: [],
    }

    server.use(
      rest.get(env.API_BASE_URL + '/native/v1/bookings', async (_, res, ctx) =>
        res(ctx.status(200), ctx.json(expectedResponse))
      )
    )

    renderOfferPage(mockedBookingApi.id)

    fireEvent.press(screen.getByText('Voir les disponibilités'))

    expect(await screen.findByText('Réservation impossible')).toBeTruthy()
  })
})

const scrollEvent = {
  nativeEvent: {
    contentOffset: { y: 200 },
    layoutMeasurement: { height: 1000 },
    contentSize: { height: 1900 },
  },
}

const nativeEventBottom = {
  nativeEvent: {
    layoutMeasurement: { height: 1000 },
    contentOffset: { y: 900 },
    contentSize: { height: 1900 },
  },
}

const nativeEventTop = {
  nativeEvent: {
    layoutMeasurement: { height: 1000 },
    contentOffset: { y: 100 },
    contentSize: { height: 1900 },
  },
}
