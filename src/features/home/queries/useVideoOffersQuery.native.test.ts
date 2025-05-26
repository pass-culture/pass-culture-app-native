import { SubcategoriesResponseModelv2 } from 'api/gen'
import { OffersModuleParameters } from 'features/home/types'
import { fetchMultipleOffers } from 'libs/algolia/fetchAlgolia/fetchMultipleOffers/fetchMultipleOffers'
import { fetchOffersByEan } from 'libs/algolia/fetchAlgolia/fetchOffersByEan'
import { fetchOffersByIds } from 'libs/algolia/fetchAlgolia/fetchOffersByIds'
import { mockedAlgoliaResponse } from 'libs/algolia/fixtures/algoliaFixtures'
import { subcategoriesDataTest } from 'libs/subcategories/fixtures/subcategoriesResponse'
import { offersFixture } from 'shared/offer/offer.fixture'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { renderHook, act } from 'tests/utils'

import { useVideoOffersQuery } from './useVideoOffersQuery'

jest.mock('libs/algolia/fetchAlgolia/fetchOffersByIds', () => ({
  fetchOffersByIds: jest.fn(),
}))
const mockfetchOffersByIds = fetchOffersByIds as jest.MockedFunction<typeof fetchOffersByIds>

jest.mock('libs/algolia/fetchAlgolia/fetchOffersByEan', () => ({
  fetchOffersByEan: jest.fn(),
}))
const mockFetchOffersByEan = fetchOffersByEan as jest.MockedFunction<typeof fetchOffersByEan>

jest.mock('libs/algolia/fetchAlgolia/fetchMultipleOffers/fetchMultipleOffers', () => ({
  fetchMultipleOffers: jest.fn(),
}))
const mockFetchMultipleOffers = fetchMultipleOffers as jest.MockedFunction<
  typeof fetchMultipleOffers
>

const mockOffers = mockedAlgoliaResponse.hits

jest.mock('libs/firebase/analytics/analytics')

describe('useVideoOffersQuery', () => {
  beforeEach(() => {
    mockServer.getApi<SubcategoriesResponseModelv2>('/v1/subcategories/v2', subcategoriesDataTest)
  })

  it('should return offers when asking for specific ids', async () => {
    mockfetchOffersByIds.mockResolvedValueOnce([mockOffers[0], mockOffers[1]])

    const { result } = renderHook(
      () =>
        useVideoOffersQuery([{}] as OffersModuleParameters[], 'moduleId', ['offerId1', 'offerId2']),
      {
        wrapper: ({ children }) => reactQueryProviderHOC(children),
      }
    )

    await act(async () => {})

    expect(result.current.offers).toEqual([offersFixture[0], offersFixture[1]])
  })

  it('should return offers when asking for specific EANs', async () => {
    mockFetchOffersByEan.mockResolvedValueOnce([mockOffers[0], mockOffers[1]])

    const { result } = renderHook(
      () =>
        useVideoOffersQuery([{}] as OffersModuleParameters[], 'moduleId', undefined, [
          'ean1',
          'ean2',
        ]),
      {
        wrapper: ({ children }) => reactQueryProviderHOC(children),
      }
    )

    await act(async () => {})
    await act(async () => {})

    expect(result.current.offers).toEqual([offersFixture[0], offersFixture[1]])
  })

  it('should return offers when only OffersModuleParameters are provided', async () => {
    mockFetchMultipleOffers.mockResolvedValueOnce([{ hits: mockOffers, nbHits: 6 }])

    const { result } = renderHook(
      () => useVideoOffersQuery([{}] as OffersModuleParameters[], 'moduleId', undefined, undefined),
      {
        wrapper: ({ children }) => reactQueryProviderHOC(children),
      }
    )

    await act(async () => {})

    expect(result.current.offers).toEqual(offersFixture)
  })
})
