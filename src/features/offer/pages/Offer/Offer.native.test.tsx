import { SubcategoriesResponseModelv2 } from 'api/gen'
import * as useSimilarOffers from 'features/offer/api/useSimilarOffers'
import { offerResponseSnap } from 'features/offer/fixtures/offerResponse'
import { renderOfferPage } from 'features/offer/helpers/renderOfferPageTestUtil'
import * as useArtistResults from 'features/offer/helpers/useArtistResults/useArtistResults'
import { mockedAlgoliaOffersWithSameArtistResponse } from 'libs/algolia/fixtures/algoliaFixtures'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/__tests__/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { PLACEHOLDER_DATA } from 'libs/subcategories/placeholderData'
import { mockAuthContextWithoutUser } from 'tests/AuthContextUtils'
import { screen, waitFor } from 'tests/utils'

jest.unmock('react-native/Libraries/Animated/createAnimatedComponent')

jest.mock('features/auth/context/AuthContext')

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

jest.mock('libs/firebase/analytics/analytics')
jest.useFakeTimers()

describe('<Offer />', () => {
  beforeEach(() => {
    mockAuthContextWithoutUser({ persist: true })
    setFeatureFlags()
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
