import { SubcategoriesResponseModelv2 } from 'api/gen'
import { useAuthContext } from 'features/auth/context/AuthContext'
import * as useSimilarOffers from 'features/offer/api/useSimilarOffers'
import * as useSameArtistPlaylist from 'features/offer/components/OfferPlaylist/hook/useSameArtistPlaylist'
import { offerResponseSnap } from 'features/offer/fixtures/offerResponse'
import { renderOfferPage } from 'features/offer/helpers/renderOfferPageTestUtil'
import { mockedAlgoliaOffersWithSameArtistResponse } from 'libs/algolia/__mocks__/mockedAlgoliaResponse'
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
  refetch: jest.fn(),
})

let mockData: SubcategoriesResponseModelv2 | undefined = placeholderData
jest.mock('libs/subcategories/useSubcategories', () => ({
  useSubcategories: () => ({
    data: mockData,
  }),
}))

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
})
