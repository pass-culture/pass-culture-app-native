import {
  BookingsResponse,
  GetRemindersResponse,
  PaginatedFavoritesResponse,
  SubcategoriesResponseModelv2,
} from 'api/gen'
import { bookingsSnap } from 'features/bookings/fixtures/index'
import { offerResponseSnap } from 'features/offer/fixtures/offerResponse'
import * as useArtistResultsAPI from 'features/offer/queries/useArtistResultsQuery'
import * as useSimilarOffersAPI from 'features/offer/queries/useSimilarOffersQuery'
import { renderOfferPage } from 'features/offer/tests/renderOfferPageTestUtil'
import { mockedAlgoliaOffersWithSameArtistResponse } from 'libs/algolia/fixtures/algoliaFixtures'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { PLACEHOLDER_DATA } from 'libs/subcategories/placeholderData'
import { mockServer } from 'tests/mswServer'
import { screen, userEvent, waitFor } from 'tests/utils'
import * as useModal from 'ui/components/modals/useModal'

jest.unmock('react-native/Libraries/Animated/createAnimatedComponent')

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
jest.mock('libs/subcategories/useSubcategories', () => ({
  useSubcategories: () => ({
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

  it('should not display reaction button in header if offer is in ended bookings and FF is inactive', async () => {
    renderOfferPage({ mockOffer: offerResponseSnap })

    await screen.findByTestId('offerv2-container')

    await waitFor(() => expect(screen.queryByTestId('animated-icon-like')).not.toBeOnTheScreen())
  })

  it('should display reaction button in header if offer is in ended bookings and FF is active', async () => {
    setFeatureFlags([RemoteStoreFeatureFlags.WIP_REACTION_FEATURE])
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

    await waitFor(() => expect(screen.getByTestId('animated-icon-like')).toBeOnTheScreen())
  })

  it('should not display reaction button in header if booking has been cancelled and FF is active', async () => {
    setFeatureFlags([RemoteStoreFeatureFlags.WIP_REACTION_FEATURE])
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

    await waitFor(() => expect(screen.queryByTestId('animated-icon-like')).not.toBeOnTheScreen())
  })

  it('should not display reaction button in header when user is anonymous (not logged in)', async () => {
    setFeatureFlags([RemoteStoreFeatureFlags.WIP_REACTION_FEATURE])
    mockAuthContext(false)

    renderOfferPage({ mockOffer: offerResponseSnap })

    await waitFor(() => expect(screen.queryByTestId('animated-icon-like')).not.toBeOnTheScreen())
  })

  it('should open reaction modal when press on reaction button in header', async () => {
    setFeatureFlags([RemoteStoreFeatureFlags.WIP_REACTION_FEATURE])
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

    const reactionButton = await screen.findByTestId('animated-icon-like')

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

  it('should display chronicles section when FF activated', async () => {
    setFeatureFlags([RemoteStoreFeatureFlags.WIP_OFFER_CHRONICLE_SECTION])

    renderOfferPage({ mockOffer: offerResponseSnap })

    expect(await screen.findByText('La reco du Book Club')).toBeOnTheScreen()
  })

  it('should display offer placeholder on init', async () => {
    renderOfferPage({ mockOffer: offerResponseSnap, mockIsLoading: true })

    expect(await screen.findByTestId('OfferContentPlaceholder')).toBeOnTheScreen()
  })
})
