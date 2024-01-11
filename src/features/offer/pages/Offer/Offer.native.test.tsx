import { SubcategoriesResponseModelv2 } from 'api/gen'
import { useAuthContext } from 'features/auth/context/AuthContext'
import * as useSimilarOffers from 'features/offer/api/useSimilarOffers'
import * as useSameArtistPlaylist from 'features/offer/components/OfferPlaylistOld/hook/useSameArtistPlaylist'
import { offerResponseSnap } from 'features/offer/fixtures/offerResponse'
import { renderOfferPage } from 'features/offer/helpers/renderOfferPageTestUtil'
import { mockedAlgoliaOffersWithSameArtistResponse } from 'libs/algolia/__mocks__/mockedAlgoliaResponse'
import * as useFeatureFlagAPI from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { placeholderData } from 'libs/subcategories/placeholderData'
import { act, screen } from 'tests/utils'

jest.mock('features/auth/context/AuthContext')
const mockUseAuthContext = useAuthContext as jest.MockedFunction<typeof useAuthContext>

jest
  .spyOn(useSimilarOffers, 'useSimilarOffers')
  .mockImplementation()
  .mockReturnValue({ similarOffers: undefined, apiRecoParams: undefined })

jest.spyOn(useSameArtistPlaylist, 'useSameArtistPlaylist').mockImplementation().mockReturnValue({
  sameArtistPlaylist: mockedAlgoliaOffersWithSameArtistResponse,
})

let mockData: SubcategoriesResponseModelv2 | undefined = placeholderData
jest.mock('libs/subcategories/useSubcategories', () => ({
  useSubcategories: () => ({
    data: mockData,
  }),
}))

const useFeatureFlagSpy = jest.spyOn(useFeatureFlagAPI, 'useFeatureFlag').mockReturnValue(false)

describe('<Offer />', () => {
  beforeEach(() => {
    mockUseAuthContext.mockReturnValue({
      isLoggedIn: false,
      setIsLoggedIn: jest.fn(),
      refetchUser: jest.fn(),
      isUserLoading: false,
    })
  })

  afterEach(() => {
    mockData = placeholderData
  })

  it('should not display offer container when offer is not found and subcategories loaded', async () => {
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

  it('should not display offer container when subcategories not loaded and offer loaded', async () => {
    mockUseAuthContext.mockImplementationOnce(() => ({
      isLoggedIn: false,
      setIsLoggedIn: jest.fn(),
      refetchUser: jest.fn(),
      isUserLoading: false,
    }))
    mockData = undefined
    renderOfferPage({ mockOffer: offerResponseSnap })

    await act(async () => {})

    expect(screen.queryByTestId('offer-container')).not.toBeOnTheScreen()
  })

  it('should not display offer container when subcategories and offer not loaded', async () => {
    mockUseAuthContext.mockImplementationOnce(() => ({
      isLoggedIn: false,
      setIsLoggedIn: jest.fn(),
      refetchUser: jest.fn(),
      isUserLoading: false,
    }))
    mockData = undefined
    renderOfferPage({ mockOffer: null })

    await act(async () => {})

    expect(screen.queryByTestId('offer-container')).not.toBeOnTheScreen()
  })

  it('should display offer container when subcategories and offer loaded', async () => {
    mockUseAuthContext.mockImplementationOnce(() => ({
      isLoggedIn: false,
      setIsLoggedIn: jest.fn(),
      refetchUser: jest.fn(),
      isUserLoading: false,
    }))
    renderOfferPage({ mockOffer: offerResponseSnap })

    await act(async () => {})

    expect(screen.queryByTestId('offer-container')).toBeOnTheScreen()
  })

  describe('When offer V2 feature flag enabled', () => {
    beforeEach(() => {
      useFeatureFlagSpy.mockReturnValueOnce(true)
    })

    it('should display offer v2 page', () => {
      renderOfferPage({ mockOffer: offerResponseSnap })

      expect(screen.getByTestId('offerv2-container')).toBeOnTheScreen()
    })

    it('should display subcategory tag', () => {
      renderOfferPage({ mockOffer: offerResponseSnap })

      expect(screen.getByText('Cinéma plein air')).toBeOnTheScreen()
    })
  })

  it('should display offer v1 page when feature flag is disabled', async () => {
    renderOfferPage({ mockOffer: offerResponseSnap })

    await act(async () => {})

    expect(screen.queryByTestId('offerv2-container')).toBe(null)
  })
})
