import { api } from 'api/api'
import { SubcategoriesResponseModelv2 } from 'api/gen'
import { bookingsSnap } from 'features/bookings/fixtures/bookingsSnap'
import * as useSimilarOffers from 'features/offer/api/useSimilarOffers'
import { offerResponseSnap } from 'features/offer/fixtures/offerResponse'
import { renderOfferPage } from 'features/offer/helpers/renderOfferPageTestUtil'
import * as useArtistResults from 'features/offer/helpers/useArtistResults/useArtistResults'
import { mockedAlgoliaOffersWithSameArtistResponse } from 'libs/algolia/fixtures/algoliaFixtures'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/__tests__/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { PLACEHOLDER_DATA } from 'libs/subcategories/placeholderData'
import { screen, userEvent, waitFor } from 'tests/utils'
import * as useModal from 'ui/components/modals/useModal'

jest.unmock('react-native/Libraries/Animated/createAnimatedComponent')

jest
  .spyOn(useSimilarOffers, 'useSimilarOffers')
  .mockImplementation()
  .mockReturnValue({ similarOffers: undefined, apiRecoParams: undefined })

jest
  .spyOn(useArtistResults, 'useArtistResults')
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

  it('should display reaction button in header if offer is in ended bookings and FF is active', async () => {
    setFeatureFlags([RemoteStoreFeatureFlags.WIP_REACTION_FEATURE])
    jest.spyOn(api, 'getNativeV1Bookings').mockResolvedValueOnce({
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

    expect(await screen.findByTestId('animated-icon-like')).toBeOnTheScreen()
  })

  it('should not display reaction button in header if offer is in ended bookings and FF is inactive', async () => {
    jest.spyOn(api, 'getNativeV1Bookings').mockResolvedValueOnce({
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
    jest.spyOn(api, 'getNativeV1Bookings').mockResolvedValueOnce({
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
