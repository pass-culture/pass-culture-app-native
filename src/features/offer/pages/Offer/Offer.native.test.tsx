import { rest } from 'msw'

import { mockedBookingApi } from '__mocks__/fixtures/booking'
import { BookingsResponse, SearchGroupNameEnumv2 } from 'api/gen'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { openUrl } from 'features/navigation/helpers/openUrl'
import * as useSimilarOffers from 'features/offer/api/useSimilarOffers'
import * as useSameArtistPlaylist from 'features/offer/components/SameArtistPlaylist/hook/useSameArtistPlaylist'
import { PlaylistType } from 'features/offer/enums'
import { offerResponseSnap } from 'features/offer/fixtures/offerResponse'
import { offerId, renderOfferPage } from 'features/offer/helpers/renderOfferPageTestUtil'
import { beneficiaryUser } from 'fixtures/user'
import {
  mockedAlgoliaOffersWithSameArtistResponse,
  mockedAlgoliaResponse,
} from 'libs/algolia/__mocks__/mockedAlgoliaResponse'
import { analytics } from 'libs/analytics'
import { env } from 'libs/environment'
import * as useFeatureFlagAPI from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RecommendationApiParams } from 'shared/offer/types'
import { server } from 'tests/server'
import { act, fireEvent, screen, waitFor } from 'tests/utils'
import { SNACK_BAR_TIME_OUT } from 'ui/components/snackBar/SnackBarContext'

jest.mock('features/auth/context/AuthContext')
const mockUseAuthContext = useAuthContext as jest.MockedFunction<typeof useAuthContext>

const useSimilarOffersSpy = jest
  .spyOn(useSimilarOffers, 'useSimilarOffers')
  .mockImplementation()
  .mockReturnValue({ similarOffers: undefined, apiRecoParams: undefined })

const useSameArtistPlaylistSpy = jest
  .spyOn(useSameArtistPlaylist, 'useSameArtistPlaylist')
  .mockImplementation()
  .mockReturnValue({
    sameArtistPlaylist: mockedAlgoliaOffersWithSameArtistResponse,
    refetch: jest.fn(),
  })

const mockShowErrorSnackBar = jest.fn()
jest.mock('ui/components/snackBar/SnackBarContext', () => ({
  useSnackBarContext: () => ({
    showErrorSnackBar: mockShowErrorSnackBar,
  }),
}))

jest.mock('features/navigation/helpers/openUrl')
const mockedOpenUrl = openUrl as jest.MockedFunction<typeof openUrl>

jest.spyOn(useFeatureFlagAPI, 'useFeatureFlag').mockReturnValue(true)

const apiRecoParams: RecommendationApiParams = {
  call_id: '1',
  filtered: true,
  geo_located: false,
  model_endpoint: 'default',
  model_name: 'similar_offers_default_prod',
  model_version: 'similar_offers_clicks_v2_1_prod_v_20230317T173445',
  reco_origin: 'default',
}

const offerDigitalAndFree = {
  isDigital: true,
  stocks: [
    {
      id: 118929,
      beginningDatetime: '2021-01-04T13:30:00',
      price: 0,
      isBookable: true,
      isExpired: false,
      isForbiddenToUnderage: false,
      isSoldOut: false,
      features: [],
    },
  ],
}

jest.useFakeTimers({ legacyFakeTimers: true })

describe('<Offer />', () => {
  beforeEach(() => {
    mockUseAuthContext.mockReturnValue({
      isLoggedIn: false,
      setIsLoggedIn: jest.fn(),
      refetchUser: jest.fn(),
      isUserLoading: false,
    })
  })

  it('animates on scroll', async () => {
    renderOfferPage({})

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

    renderOfferPage({})

    const bookingOfferButton = await screen.findByText('Réserver l’offre')
    await act(async () => {
      fireEvent.press(bookingOfferButton)
    })

    expect(screen.queryByText('Identifie-toi pour réserver l’offre')).toBeOnTheScreen()
  })

  it('should log analytics when display authentication modal', async () => {
    mockUseAuthContext.mockImplementationOnce(() => ({
      isLoggedIn: false,
      setIsLoggedIn: jest.fn(),
      refetchUser: jest.fn(),
      isUserLoading: false,
    }))

    renderOfferPage({})

    const bookingOfferButton = await screen.findByText('Réserver l’offre')
    await act(async () => {
      fireEvent.press(bookingOfferButton)
    })

    expect(analytics.logConsultAuthenticationModal).toHaveBeenNthCalledWith(1, offerId)
  })

  it('should not display offer container when offer is not found', async () => {
    mockUseAuthContext.mockImplementationOnce(() => ({
      isLoggedIn: false,
      setIsLoggedIn: jest.fn(),
      refetchUser: jest.fn(),
      isUserLoading: false,
    }))

    renderOfferPage({ mockOffer: null })

    await act(async () => {})

    expect(screen.queryByTestId('offer-container')).not.toBeOnTheScreen()
  })

  describe('with similar offers', () => {
    it('should pass user position to `useSimilarOffers`', async () => {
      renderOfferPage({})

      await act(async () => {})

      expect(useSimilarOffersSpy).toHaveBeenCalledWith(
        // allows you to check that the call was made at least once with these parameters
        expect.objectContaining({
          categoryIncluded: SearchGroupNameEnumv2.FILMS_SERIES_CINEMA,
          offerId: offerResponseSnap.id,
          position: { longitude: 90, latitude: 90 },
        })
      )
      expect(useSimilarOffersSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          categoryExcluded: SearchGroupNameEnumv2.FILMS_SERIES_CINEMA,
          offerId: offerResponseSnap.id,
          position: { longitude: 90, latitude: 90 },
        })
      )
    })

    it('should log two logPlaylistVerticalScroll events when scrolling vertical and reaching the bottom when there are 2 playlists', async () => {
      useSimilarOffersSpy.mockReturnValueOnce({
        similarOffers: mockedAlgoliaResponse.hits,
        apiRecoParams,
      })
      useSimilarOffersSpy.mockReturnValueOnce({
        similarOffers: mockedAlgoliaResponse.hits,
        apiRecoParams,
      })

      renderOfferPage({})
      const scrollView = screen.getByTestId('offer-container')

      await act(async () => {
        fireEvent.scroll(scrollView, nativeEventBottom)
      })

      expect(analytics.logPlaylistVerticalScroll).toHaveBeenNthCalledWith(1, {
        ...apiRecoParams,
        fromOfferId: undefined,
        offerId: 116656,
        playlistType: PlaylistType.SAME_CATEGORY_SIMILAR_OFFERS,
      })
      expect(analytics.logPlaylistVerticalScroll).toHaveBeenNthCalledWith(2, {
        ...apiRecoParams,
        fromOfferId: undefined,
        offerId: 116656,
        playlistType: PlaylistType.OTHER_CATEGORIES_SIMILAR_OFFERS,
      })
    })

    it('should not log two logPlaylistVerticalScroll events when scrolling vertical and reaching the bottom when playlist are empty', async () => {
      useSimilarOffersSpy.mockReturnValueOnce({ similarOffers: [], apiRecoParams })
      useSimilarOffersSpy.mockReturnValueOnce({ similarOffers: [], apiRecoParams })
      renderOfferPage({})
      const scrollView = screen.getByTestId('offer-container')

      await act(async () => {
        fireEvent.scroll(scrollView, nativeEventBottom)
      })

      await waitFor(() => {
        expect(analytics.logPlaylistVerticalScroll).not.toHaveBeenNthCalledWith(1, {
          ...apiRecoParams,
          fromOfferId: undefined,
          offerId: 116656,
          playlistType: PlaylistType.SAME_CATEGORY_SIMILAR_OFFERS,
        })
        expect(analytics.logPlaylistVerticalScroll).not.toHaveBeenNthCalledWith(2, {
          ...apiRecoParams,
          fromOfferId: undefined,
          offerId: 116656,
          playlistType: PlaylistType.OTHER_CATEGORIES_SIMILAR_OFFERS,
        })
      })
    })

    it('should trigger logConsultWholeOffer only once when scrolling to the bottom of the component', async () => {
      renderOfferPage({})
      const scrollView = screen.getByTestId('offer-container')

      await act(async () => {
        fireEvent.scroll(scrollView, nativeEventBottom)
      })

      expect(analytics.logConsultWholeOffer).toHaveBeenNthCalledWith(1, offerId)

      await act(async () => {
        fireEvent.scroll(scrollView, nativeEventBottom)
      })

      expect(analytics.logConsultWholeOffer).toHaveBeenNthCalledWith(1, offerId)
    })

    describe('When there is only same category similar offers playlist', () => {
      beforeAll(() => {
        useSimilarOffersSpy.mockReturnValueOnce({
          similarOffers: mockedAlgoliaResponse.hits,
          apiRecoParams,
        })
        useSimilarOffersSpy.mockReturnValueOnce({ similarOffers: [], apiRecoParams })
      })

      it('should log logPlaylistVerticalScroll event with same category similar offers playlist param when scrolling vertical and reaching the bottom', async () => {
        renderOfferPage({})
        const scrollView = screen.getByTestId('offer-container')

        await act(async () => {
          fireEvent.scroll(scrollView, nativeEventBottom)
        })

        expect(analytics.logPlaylistVerticalScroll).toHaveBeenNthCalledWith(1, {
          ...apiRecoParams,
          fromOfferId: undefined,
          offerId: 116656,
          playlistType: PlaylistType.SAME_CATEGORY_SIMILAR_OFFERS,
        })
      })

      it('should not log logPlaylistVerticalScroll event with other categories similar offers playlist param when scrolling vertical and reaching the bottom', async () => {
        renderOfferPage({})
        const scrollView = screen.getByTestId('offer-container')

        await act(async () => {
          fireEvent.scroll(scrollView, nativeEventBottom)
        })

        expect(analytics.logPlaylistVerticalScroll).not.toHaveBeenCalledWith({
          fromOfferId: undefined,
          offerId: 116656,
          playlistType: PlaylistType.OTHER_CATEGORIES_SIMILAR_OFFERS,
        })
      })
    })

    describe('When there is only other categories similar offers playlist', () => {
      beforeAll(() => {
        useSimilarOffersSpy.mockReturnValueOnce({ similarOffers: [], apiRecoParams })
        useSimilarOffersSpy.mockReturnValueOnce({
          similarOffers: mockedAlgoliaResponse.hits,
          apiRecoParams,
        })
      })

      it('should log logPlaylistVerticalScroll event with other categories similar offers playlist param when scrolling vertical and reaching the bottom', async () => {
        renderOfferPage({})
        const scrollView = screen.getByTestId('offer-container')

        await act(async () => {
          fireEvent.scroll(scrollView, nativeEventBottom)
        })

        expect(analytics.logPlaylistVerticalScroll).toHaveBeenNthCalledWith(1, {
          ...apiRecoParams,
          fromOfferId: undefined,
          offerId: 116656,
          playlistType: PlaylistType.OTHER_CATEGORIES_SIMILAR_OFFERS,
        })
      })

      it('should not log logPlaylistVerticalScroll event with same category similar offers playlist param when scrolling vertical and reaching the bottom', async () => {
        renderOfferPage({})
        const scrollView = screen.getByTestId('offer-container')

        await act(async () => {
          fireEvent.scroll(scrollView, nativeEventBottom)
        })

        expect(analytics.logPlaylistVerticalScroll).not.toHaveBeenCalledWith({
          fromOfferId: undefined,
          offerId: 116656,
          playlistType: PlaylistType.SAME_CATEGORY_SIMILAR_OFFERS,
        })
      })
    })

    it('should not log logPlaylistVerticalScroll event when scrolling vertical and not reaching the bottom', async () => {
      useSimilarOffersSpy.mockReturnValueOnce({
        similarOffers: mockedAlgoliaResponse.hits,
        apiRecoParams,
      })
      useSimilarOffersSpy.mockReturnValueOnce({
        similarOffers: mockedAlgoliaResponse.hits,
        apiRecoParams,
      })
      renderOfferPage({})
      const scrollView = screen.getByTestId('offer-container')

      await act(async () => {
        fireEvent.scroll(scrollView, nativeEventTop)
      })

      expect(analytics.logPlaylistVerticalScroll).not.toHaveBeenNthCalledWith(1, {
        ...apiRecoParams,
        fromOfferId: undefined,
        offerId: 116656,
        playlistType: PlaylistType.SAME_CATEGORY_SIMILAR_OFFERS,
      })
      expect(analytics.logPlaylistVerticalScroll).not.toHaveBeenNthCalledWith(2, {
        ...apiRecoParams,
        fromOfferId: undefined,
        offerId: 116656,
        playlistType: PlaylistType.OTHER_CATEGORIES_SIMILAR_OFFERS,
      })
    })

    it('should log logPlaylistVerticalScroll with the event param fromOfferId & offerId', async () => {
      useSimilarOffersSpy.mockReturnValueOnce({
        similarOffers: mockedAlgoliaResponse.hits,
        apiRecoParams,
      })
      useSimilarOffersSpy.mockReturnValueOnce({
        similarOffers: mockedAlgoliaResponse.hits,
        apiRecoParams,
      })
      const fromOfferId = 1
      const offerId = 116656
      renderOfferPage({ fromOfferId })
      const scrollView = screen.getByTestId('offer-container')

      await act(async () => {
        fireEvent.scroll(scrollView, nativeEventBottom)
      })

      expect(analytics.logPlaylistVerticalScroll).toHaveBeenNthCalledWith(1, {
        ...apiRecoParams,
        fromOfferId,
        offerId,
        playlistType: PlaylistType.SAME_CATEGORY_SIMILAR_OFFERS,
      })
      expect(analytics.logPlaylistVerticalScroll).toHaveBeenNthCalledWith(2, {
        ...apiRecoParams,
        fromOfferId,
        offerId,
        playlistType: PlaylistType.OTHER_CATEGORIES_SIMILAR_OFFERS,
      })
    })
  })

  describe('same artist playlist', () => {
    const offerWithArtistAndEan = {
      extraData: {
        author: 'Eiichiro Oda',
        ean: '9782723492607',
      },
    }

    it('should handle provided artist and EAN', async () => {
      renderOfferPage({ extraOffer: offerWithArtistAndEan })

      await act(async () => {})

      expect(useSameArtistPlaylistSpy).toHaveBeenNthCalledWith(1, {
        artists: 'Eiichiro Oda',
        ean: '9782723492607',
        searchGroupName: SearchGroupNameEnumv2.FILMS_SERIES_CINEMA,
      })
    })

    it('should handle missing artist and EAN', async () => {
      renderOfferPage({})

      await act(async () => {})

      expect(useSameArtistPlaylistSpy).toHaveBeenNthCalledWith(1, {
        artists: undefined,
        ean: undefined,
        searchGroupName: SearchGroupNameEnumv2.FILMS_SERIES_CINEMA,
      })
    })

    it('should call refetch when artist and EAN are provided', async () => {
      renderOfferPage({ extraOffer: offerWithArtistAndEan })

      await act(async () => {})

      expect(useSameArtistPlaylistSpy.mock.results[0].value.refetch).toHaveBeenCalledTimes(1)
    })

    it('should not call refetch when artist and EAN are not provided', async () => {
      renderOfferPage({})

      await act(async () => {})

      expect(useSameArtistPlaylistSpy.mock.results[0].value.refetch).not.toHaveBeenCalled()
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
    renderOfferPage({ fromOfferId, openModalOnNavigation: true })

    await act(async () => {})

    expect(await screen.findByText('Valider la date')).toBeOnTheScreen()
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

    renderOfferPage({ fromOfferId: mockedBookingApi.id })

    fireEvent.press(screen.getByText('Voir les disponibilités'))

    await waitFor(() => {
      expect(screen.queryByText('Réservation impossible')).toBeOnTheScreen()
    })
  })

  describe('When offer is digital and free and not already booked', () => {
    const expectedResponse: BookingsResponse = {
      ended_bookings: [],
      hasBookingsAfter18: false,
      ongoing_bookings: [
        {
          ...mockedBookingApi,
          stock: {
            ...mockedBookingApi.stock,
            offer: { ...mockedBookingApi.stock.offer, ...offerDigitalAndFree },
          },
          dateUsed: '2023-02-14T10:10:08.800599Z',
          completedUrl: 'https://www.google.fr/',
        },
      ],
    }

    describe('When booking API response is success', () => {
      it('should directly book and redirect to the offer when pressing button to book the offer', async () => {
        server.use(
          rest.get(env.API_BASE_URL + '/native/v1/bookings', async (_, res, ctx) =>
            res(ctx.status(200), ctx.json(expectedResponse))
          )
        )

        server.use(
          rest.post(env.API_BASE_URL + '/native/v1/bookings', (req, res, ctx) =>
            res(ctx.status(200), ctx.json({ bookingId: 123 }))
          )
        )

        // Multiple renders force us to mock auth context as loggedIn user in this test
        // eslint-disable-next-line local-rules/independent-mocks
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

        renderOfferPage({ extraOffer: offerDigitalAndFree })

        await act(async () => {
          fireEvent.press(screen.getByText('Accéder à l’offre en ligne'))
        })

        expect(mockedOpenUrl).toHaveBeenNthCalledWith(1, 'https://www.google.fr/')
      })

      it('should log BookingConfirmation when pressing button to book the offer', async () => {
        server.use(
          rest.get(env.API_BASE_URL + '/native/v1/bookings', async (_, res, ctx) =>
            res(ctx.status(200), ctx.json(expectedResponse))
          )
        )

        server.use(
          rest.post(env.API_BASE_URL + '/native/v1/bookings', (req, res, ctx) =>
            res(ctx.status(200), ctx.json({ bookingId: 123 }))
          )
        )
        // Multiple renders force us to mock auth context as loggedIn user in this test
        // eslint-disable-next-line local-rules/independent-mocks
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

        renderOfferPage({ extraOffer: offerDigitalAndFree })

        await act(async () => {
          fireEvent.press(screen.getByText('Accéder à l’offre en ligne'))
        })

        expect(analytics.logBookingConfirmation).toHaveBeenNthCalledWith(1, {
          bookingId: 123,
          offerId: 116656,
        })
      })

      it('should not display an error message when pressing button to book the offer', async () => {
        // Multiple renders force us to mock auth context as loggedIn user in this test
        // eslint-disable-next-line local-rules/independent-mocks
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

        renderOfferPage({ extraOffer: offerDigitalAndFree })

        await act(async () => {
          fireEvent.press(screen.getByText('Accéder à l’offre en ligne'))
        })

        expect(mockShowErrorSnackBar).not.toHaveBeenCalled()
      })
    })

    describe('When booking API response is error', () => {
      it('should not direclty redirect to the offer when pressing button to book the offer', async () => {
        server.use(
          rest.get(env.API_BASE_URL + '/native/v1/bookings', async (_, res, ctx) =>
            res(ctx.status(200), ctx.json(expectedResponse))
          )
        )

        server.use(
          rest.post(env.API_BASE_URL + '/native/v1/bookings', (req, res, ctx) =>
            res(ctx.status(400))
          )
        )

        // Multiple renders force us to mock auth context as loggedIn user in this test
        // eslint-disable-next-line local-rules/independent-mocks
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

        renderOfferPage({ extraOffer: offerDigitalAndFree })

        await act(async () => {
          fireEvent.press(screen.getByText('Accéder à l’offre en ligne'))
        })

        expect(mockedOpenUrl).not.toHaveBeenCalled()
      })

      it('should not log BookingConfirmation when pressing button to book the offer', async () => {
        server.use(
          rest.get(env.API_BASE_URL + '/native/v1/bookings', async (_, res, ctx) =>
            res(ctx.status(200), ctx.json(expectedResponse))
          )
        )

        server.use(
          rest.post(env.API_BASE_URL + '/native/v1/bookings', (req, res, ctx) =>
            res(ctx.status(400))
          )
        )

        // Multiple renders force us to mock auth context as loggedIn user in this test
        // eslint-disable-next-line local-rules/independent-mocks
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

        renderOfferPage({ extraOffer: offerDigitalAndFree })

        await act(async () => {
          fireEvent.press(screen.getByText('Accéder à l’offre en ligne'))
        })

        expect(analytics.logBookingConfirmation).not.toHaveBeenCalled()
      })
    })

    it('should display an error message when pressing button to book the offer', async () => {
      server.use(
        rest.get(env.API_BASE_URL + '/native/v1/bookings', async (_, res, ctx) =>
          res(ctx.status(200), ctx.json(expectedResponse))
        )
      )

      server.use(
        rest.post(env.API_BASE_URL + '/native/v1/bookings', (req, res, ctx) => res(ctx.status(400)))
      )

      // Multiple renders force us to mock auth context as loggedIn user in this test
      // eslint-disable-next-line local-rules/independent-mocks
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

      renderOfferPage({ extraOffer: offerDigitalAndFree })

      await act(async () => {
        fireEvent.press(screen.getByText('Accéder à l’offre en ligne'))
      })

      expect(mockShowErrorSnackBar).toHaveBeenNthCalledWith(1, {
        message: 'Désolé, il est impossible d’ouvrir le lien. Réessaie plus tard.',
        timeout: SNACK_BAR_TIME_OUT,
      })
    })
  })
})

describe('When offer is digital and free and already booked', () => {
  const expectedResponse: BookingsResponse = {
    ended_bookings: [],
    hasBookingsAfter18: false,
    ongoing_bookings: [
      {
        ...mockedBookingApi,
        stock: {
          ...mockedBookingApi.stock,
          offer: { ...mockedBookingApi.stock.offer, ...offerDigitalAndFree },
        },
        dateUsed: '2023-02-14T10:10:08.800599Z',
        completedUrl: 'https://www.google.fr/',
      },
    ],
  }

  it('should directly redirect to the offer when pressing offer access button', async () => {
    server.use(
      rest.get(env.API_BASE_URL + '/native/v1/bookings', async (_, res, ctx) =>
        res(ctx.status(200), ctx.json(expectedResponse))
      )
    )

    // Multiple renders force us to mock auth context as loggedIn user in this test
    // eslint-disable-next-line local-rules/independent-mocks
    const newLocal = {
      isLoggedIn: true,
      setIsLoggedIn: jest.fn(),
      isUserLoading: false,
      refetchUser: jest.fn(),
      user: { ...beneficiaryUser, bookedOffers: { 116656: 123 } },
    }
    // Multiple renders force us to mock auth context as loggedIn user in this test
    // eslint-disable-next-line local-rules/independent-mocks
    mockUseAuthContext.mockReturnValue(newLocal)

    renderOfferPage({ extraOffer: offerDigitalAndFree })

    await act(async () => {
      fireEvent.press(screen.getByText('Accéder à l’offre en ligne'))
    })

    expect(mockedOpenUrl).toHaveBeenCalledTimes(1)
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
