import { ReactTestInstance } from 'react-test-renderer'

import {
  BookingsResponse,
  GetRemindersResponse,
  PaginatedFavoritesResponse,
  SubcategoriesResponseModelv2,
} from 'api/gen'
import { bookingsSnap } from 'features/bookings/fixtures'
import { ALL_OPTIONAL_COOKIES, COOKIES_BY_CATEGORY } from 'features/cookies/CookiesPolicy'
import { ConsentState, CookieNameEnum } from 'features/cookies/enums'
import * as Cookies from 'features/cookies/helpers/useCookies'
import { ConsentStatus } from 'features/cookies/types'
import { offerResponseSnap } from 'features/offer/fixtures/offerResponse'
import * as useSimilarOffersAPI from 'features/offer/queries/useSimilarOffersQuery'
import { renderOfferPage } from 'features/offer/tests/renderOfferPageTestUtil'
import { mockedAlgoliaOffersWithSameArtistResponse } from 'libs/algolia/fixtures/algoliaFixtures'
import { analytics } from 'libs/analytics/provider'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { PLACEHOLDER_DATA } from 'libs/subcategories/placeholderData'
import * as useArtistResultsAPI from 'queries/offer/useArtistResultsQuery'
import { mockServer } from 'tests/mswServer'
import { screen, userEvent, waitFor } from 'tests/utils'
import * as useModal from 'ui/components/modals/useModal'

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

jest.mock('libs/jwt/jwt')

jest
  .spyOn(useSimilarOffersAPI, 'useSimilarOffersQuery')
  .mockImplementation()
  .mockReturnValue({ similarOffers: undefined, apiRecoParams: undefined })

jest
  .spyOn(useArtistResultsAPI, 'useArtistResultsQuery')
  .mockImplementation()
  .mockReturnValue({
    artistPlaylist: mockedAlgoliaOffersWithSameArtistResponse,
    artistTopOffers: mockedAlgoliaOffersWithSameArtistResponse.slice(0, 4),
  })

let mockData: SubcategoriesResponseModelv2 | undefined = PLACEHOLDER_DATA
jest.mock('queries/subcategories/useSubcategoriesQuery', () => ({
  useSubcategoriesQuery: () => ({
    data: mockData,
  }),
}))

const mockShowModal = jest.fn()
jest.spyOn(useModal, 'useModal').mockReturnValue({
  showModal: mockShowModal,
  hideModal: jest.fn(),
  toggleModal: jest.fn(),
  visible: false,
})

jest.mock('libs/firebase/analytics/analytics')
jest.useFakeTimers()

const mockUseAuthContext = jest.fn()
jest.mock('features/auth/context/AuthContext', () => ({
  useAuthContext: () => mockUseAuthContext(),
}))

const mockAuthContext = (isLoggedIn = true) => {
  mockUseAuthContext.mockReturnValue({
    user: undefined,
    isLoggedIn,
  })
}

const consentState: ConsentStatus = { state: ConsentState.LOADING }
const consentValue = {
  mandatory: COOKIES_BY_CATEGORY.essential,
  accepted: ALL_OPTIONAL_COOKIES,
  refused: [],
}

const defaultUseCookies = {
  cookiesConsent: consentState,
  setCookiesConsent: jest.fn(),
  setUserId: jest.fn(),
  loadCookiesConsent: jest.fn(),
}
const mockUseCookies = jest.spyOn(Cookies, 'useCookies').mockReturnValue(defaultUseCookies)

describe('<Offer />', () => {
  const user = userEvent.setup()

  beforeEach(() => {
    mockServer.getApi<BookingsResponse>('/v1/bookings', {})
    mockServer.getApi<PaginatedFavoritesResponse>('/v1/favorites', {})
    mockServer.getApi<PaginatedFavoritesResponse>('/v1/me/favorites', {})
    mockServer.getApi<GetRemindersResponse>('/v1/me/reminders', {})
    setFeatureFlags()
    mockAuthContext()
  })

  afterEach(() => {
    mockData = PLACEHOLDER_DATA
  })

  it('should not display offer container when offer is not found and subcategories loaded', async () => {
    renderOfferPage({ mockOffer: null })

    await waitFor(async () => {
      expect(screen.queryByTestId('offerv2-container')).not.toBeOnTheScreen()
    })
  })

  it('should not display offer container when subcategories not loaded and offer loaded', async () => {
    mockData = undefined
    renderOfferPage({ mockOffer: offerResponseSnap })

    await waitFor(async () => {
      expect(screen.queryByTestId('offerv2-container')).not.toBeOnTheScreen()
    })
  })

  it('should display reaction button in header if offer is in ended bookings', async () => {
    mockServer.getApi<BookingsResponse>('/v1/bookings', {
      ongoing_bookings: [],
      ended_bookings: [
        {
          ...bookingsSnap.ended_bookings[0],
          stock: {
            ...bookingsSnap.ended_bookings[0].stock,
            offer: { ...bookingsSnap.ended_bookings[0].stock.offer, id: offerResponseSnap.id },
          },
        },
      ],
      hasBookingsAfter18: false,
    })

    renderOfferPage({ mockOffer: offerResponseSnap })

    expect(await screen.findByLabelText('Réagir à cette offre')).toBeOnTheScreen()
  })

  it('should not display reaction button in header if booking has been cancelled', async () => {
    mockServer.getApi<BookingsResponse>('/v1/bookings', {
      ongoing_bookings: [],
      ended_bookings: [
        {
          ...bookingsSnap.ended_bookings[1],
          stock: {
            ...bookingsSnap.ended_bookings[1].stock,
            offer: { ...bookingsSnap.ended_bookings[1].stock.offer, id: offerResponseSnap.id },
          },
        },
      ],
      hasBookingsAfter18: false,
    })

    renderOfferPage({ mockOffer: offerResponseSnap })

    await screen.findByTestId('offerv2-container')

    await waitFor(() =>
      expect(screen.queryByLabelText('Réagir à cette offre')).not.toBeOnTheScreen()
    )
  })

  it('should not display reaction button in header when user is anonymous (not logged in)', async () => {
    mockAuthContext(false)

    renderOfferPage({ mockOffer: offerResponseSnap })

    await waitFor(() =>
      expect(screen.queryByLabelText('Réagir à cette offre')).not.toBeOnTheScreen()
    )
  })

  it('should open reaction modal when press on reaction button in header', async () => {
    mockServer.getApi<BookingsResponse>('/v1/bookings', {
      ongoing_bookings: [],
      ended_bookings: [
        {
          ...bookingsSnap.ended_bookings[0],
          stock: {
            ...bookingsSnap.ended_bookings[0].stock,
            offer: { ...bookingsSnap.ended_bookings[0].stock.offer, id: offerResponseSnap.id },
          },
        },
      ],
      hasBookingsAfter18: false,
    })

    renderOfferPage({ mockOffer: offerResponseSnap })

    await screen.findByTestId('offerv2-container')

    const reactionButton = await screen.findByLabelText('Réagir à cette offre')

    await user.press(reactionButton)

    expect(mockShowModal).toHaveBeenCalledTimes(1)
  })

  it('should not display offer container when subcategories and offer not loaded', async () => {
    mockData = undefined
    renderOfferPage({ mockOffer: null })

    await waitFor(async () => {
      expect(screen.queryByTestId('offerv2-container')).not.toBeOnTheScreen()
    })
  })

  it('should display offer container when subcategories and offer loaded', async () => {
    renderOfferPage({ mockOffer: offerResponseSnap })

    expect(await screen.findByTestId('offerv2-container')).toBeOnTheScreen()
  })

  it('should display subcategory tag', async () => {
    renderOfferPage({ mockOffer: offerResponseSnap })

    expect(await screen.findByText('Cinéma plein air')).toBeOnTheScreen()
  })

  it('should display chronicles section', async () => {
    renderOfferPage({ mockOffer: offerResponseSnap })

    expect(await screen.findByText('La reco du Ciné Club')).toBeOnTheScreen()
  })

  it('should open chronicles writers modal when pressing "C’est quoi le Ciné Club\u00a0?" button', async () => {
    renderOfferPage({ mockOffer: offerResponseSnap })

    await screen.findByText('La reco du Ciné Club')

    await user.press(screen.getByText('C’est quoi le Ciné Club\u00a0?'))

    expect(mockShowModal).toHaveBeenCalledTimes(1)
  })

  it('should trigger ClickWhatsClub log when pressing "C’est quoi le Ciné Club\u00a0?" button', async () => {
    renderOfferPage({ mockOffer: offerResponseSnap })

    await screen.findByText('La reco du Ciné Club')

    await user.press(screen.getByText('C’est quoi le Ciné Club\u00a0?'))

    expect(analytics.logClickWhatsClub).toHaveBeenNthCalledWith(1, {
      categoryName: 'CINEMA',
      from: 'offer',
      offerId: '116656',
    })
  })

  describe('video section', () => {
    beforeEach(() => {
      setFeatureFlags([RemoteStoreFeatureFlags.WIP_OFFER_VIDEO_SECTION])
    })

    afterEach(() => {
      mockUseCookies.mockReset().mockReturnValue(defaultUseCookies)
    })

    describe('cookies consented', () => {
      beforeEach(() => {
        mockUseCookies.mockImplementation(() => ({
          ...defaultUseCookies,
          cookiesConsent: {
            state: ConsentState.HAS_CONSENT,
            value: consentValue,
          },
        }))
      })

      it('should display video player when video cookies consented', async () => {
        setFeatureFlags([RemoteStoreFeatureFlags.WIP_OFFER_VIDEO_SECTION])
        renderOfferPage({ mockOffer: offerResponseSnap })

        expect(await screen.findByText('Vidéo')).toBeOnTheScreen()
        expect(await screen.findByRole('imagebutton')).toBeOnTheScreen()
      })
    })

    describe('cookies NOT consented', () => {
      const mockSetCookiesConsent = jest.fn()

      const acceptedWithoutVideo = [
        ...COOKIES_BY_CATEGORY.customization,
        ...COOKIES_BY_CATEGORY.performance,
        ...COOKIES_BY_CATEGORY.marketing,
      ]

      beforeEach(() => {
        setFeatureFlags([RemoteStoreFeatureFlags.WIP_OFFER_VIDEO_SECTION])

        mockUseCookies.mockImplementation(() => ({
          ...defaultUseCookies,
          cookiesConsent: {
            state: ConsentState.HAS_CONSENT,
            value: {
              mandatory: COOKIES_BY_CATEGORY.essential,
              accepted: acceptedWithoutVideo,
              refused: [],
            },
          },
          setCookiesConsent: mockSetCookiesConsent,
        }))
      })

      it('should display video player placeholder when cookies not consented', async () => {
        renderOfferPage({ mockOffer: offerResponseSnap })

        const placeholder = await screen.findByText(
          'En visionnant cette vidéo, tu t’engages à accepter les cookies liés à Youtube.'
        )

        expect(placeholder).toBeOnTheScreen()
        expect(screen.queryByRole('imagebutton')).not.toBeOnTheScreen()
      })

      it('should accept video cookies and display video player when pressing see video button below video player placeholder', async () => {
        renderOfferPage({ mockOffer: offerResponseSnap })

        await screen.findByText('Vidéo')

        await user.press(screen.getAllByText('Voir la vidéo')[1] as ReactTestInstance)

        expect(mockSetCookiesConsent).toHaveBeenCalledWith({
          mandatory: COOKIES_BY_CATEGORY.essential,
          accepted: [...acceptedWithoutVideo, CookieNameEnum.VIDEO_PLAYBACK],
          refused: [],
        })
      })
    })
  })
})
