import { useHighlightOffer } from 'features/home/api/useHighlightOffer'
import { mockedAlgoliaResponse } from 'libs/algolia/__mocks__/mockedAlgoliaResponse'
import { fetchOffersByEan } from 'libs/algolia/fetchAlgolia/fetchOffersByEan'
import { fetchOffersByIds } from 'libs/algolia/fetchAlgolia/fetchOffersByIds'
import { fetchOffersByTags } from 'libs/algolia/fetchAlgolia/fetchOffersByTags'
import { useLocation } from 'libs/location'
import { ILocationContext } from 'libs/location/types'
import { offersFixture } from 'shared/offer/offer.fixture'
import { Offer } from 'shared/offer/types'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { renderHook, waitFor } from 'tests/utils'

jest.mock('libs/algolia/fetchAlgolia/fetchOffersByIds', () => ({
  fetchOffersByIds: jest.fn(),
}))
const mockFetchOffersByIds = fetchOffersByIds as jest.MockedFunction<typeof fetchOffersByIds>

jest.mock('libs/algolia/fetchAlgolia/fetchOffersByTags', () => ({
  fetchOffersByTags: jest.fn(),
}))
const mockFetchOffersByTags = fetchOffersByTags as jest.MockedFunction<typeof fetchOffersByTags>

jest.mock('libs/algolia/fetchAlgolia/fetchOffersByEan', () => ({
  fetchOffersByEan: jest.fn(),
}))
const mockFetchOffersByEan = fetchOffersByEan as jest.MockedFunction<typeof fetchOffersByEan>

const mockOffers: Offer[] = mockedAlgoliaResponse.hits

jest.mock('libs/location')
const mockUseGeolocation = jest.mocked(useLocation)

describe('useHighlightOffer', () => {
  it('should return offer when offerId is provided', async () => {
    mockFetchOffersByIds.mockResolvedValueOnce([mockOffers[0]])

    const { result } = renderUseHighlightOfferHook({ offerId: 'offerId1' })

    await waitFor(() => expect(result.current).toEqual(offersFixture[0]))
  })

  it('should return offer when offerTag is provided', async () => {
    mockFetchOffersByTags.mockResolvedValueOnce([mockOffers[0]])

    const { result } = renderUseHighlightOfferHook({ offerTag: 'test-tag' })

    await waitFor(() => expect(result.current).toEqual(offersFixture[0]))
  })

  it('should return offer when offerEan is provided', async () => {
    mockFetchOffersByEan.mockResolvedValueOnce([mockOffers[0]])

    const { result } = renderUseHighlightOfferHook({ offerEan: '1234567891234' })

    await waitFor(() => expect(result.current).toEqual(offersFixture[0]))
  })

  it('should return undefined when no offer id or tag or ean is provided', async () => {
    const { result } = renderUseHighlightOfferHook({})

    await waitFor(() => expect(result.current).toBe(undefined))
  })

  describe('geolocation', () => {
    it('should return offer when isGeolocated is true and the distance to the offer is within the radius', async () => {
      const mockOffer = mockOffers[0]
      // eslint-disable-next-line local-rules/independent-mocks
      mockUseGeolocation.mockReturnValue({
        geolocPosition: { latitude: mockOffer._geoloc.lat, longitude: mockOffer._geoloc.lng },
      } as ILocationContext)

      mockFetchOffersByIds.mockResolvedValueOnce([mockOffer])
      const { result } = renderUseHighlightOfferHook({
        offerId: '102280',
        isGeolocated: true,
        aroundRadius: 100,
      })

      await waitFor(() => expect(result.current).toEqual(offersFixture[0]))
    })

    it('should not return offer when isGeolocated is true and the distance to the offer is beyond radius', async () => {
      const mockOffer = mockOffers[0]
      // eslint-disable-next-line local-rules/independent-mocks
      mockUseGeolocation.mockReturnValue({
        geolocPosition: { latitude: 1, longitude: 1 },
      } as ILocationContext)

      mockFetchOffersByIds.mockResolvedValueOnce([mockOffer])
      const { result } = renderUseHighlightOfferHook({
        offerId: '102280',
        isGeolocated: true,
        aroundRadius: 100,
      })

      await waitFor(() => expect(result.current).toBe(undefined))
    })

    it('should not return offer when isGeolocated is true and the user position is not defined', async () => {
      const mockOffer = mockOffers[0]
      // eslint-disable-next-line local-rules/independent-mocks
      mockUseGeolocation.mockReturnValue({
        geolocPosition: undefined,
      } as ILocationContext)

      mockFetchOffersByIds.mockResolvedValueOnce([mockOffer])
      const { result } = renderUseHighlightOfferHook({
        offerId: '102280',
        isGeolocated: true,
        aroundRadius: 100,
      })

      await waitFor(() => expect(result.current).toBe(undefined))
    })

    it('should return offer when isGeolocated is true and around radius is not defined', async () => {
      const mockOffer = mockOffers[0]
      // eslint-disable-next-line local-rules/independent-mocks
      mockUseGeolocation.mockReturnValue({
        geolocPosition: { latitude: mockOffer._geoloc.lat, longitude: mockOffer._geoloc.lng },
      } as ILocationContext)

      mockFetchOffersByIds.mockResolvedValueOnce([mockOffer])
      const { result } = renderUseHighlightOfferHook({
        offerId: '102280',
        isGeolocated: true,
      })

      await waitFor(() => expect(result.current).toEqual(offersFixture[0]))
    })
  })
})

type Params = {
  offerId?: string
  offerEan?: string
  offerTag?: string
  isGeolocated?: boolean
  aroundRadius?: number
}

function renderUseHighlightOfferHook(params: Params) {
  return renderHook(() => useHighlightOffer({ id: 'moduleId', ...params }), {
    wrapper: ({ children }) => reactQueryProviderHOC(children),
  })
}
