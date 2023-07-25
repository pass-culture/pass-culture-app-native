import { act } from 'react-test-renderer'

import { useVideoOffers } from 'features/home/api/useVideoOffers'
import { OffersModuleParameters } from 'features/home/types'
import { mockedAlgoliaResponse } from 'libs/algolia/__mocks__/mockedAlgoliaResponse'
import { fetchOffersByEan } from 'libs/algolia/fetchAlgolia/fetchOffersByEan'
import { fetchOffersByIds } from 'libs/algolia/fetchAlgolia/fetchOffersByIds'
import { offersFixture } from 'shared/offer/offer.fixture'
import { Offer } from 'shared/offer/types'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { renderHook } from 'tests/utils'

jest.mock('libs/algolia/fetchAlgolia/fetchOffersByIds', () => ({
  fetchOffersByIds: jest.fn(),
}))
const mockfetchOffersByIds = fetchOffersByIds as jest.MockedFunction<typeof fetchOffersByIds>

jest.mock('libs/algolia/fetchAlgolia/fetchOffersByEan', () => ({
  fetchOffersByEan: jest.fn(),
}))
const mockFetchOffersByEan = fetchOffersByEan as jest.MockedFunction<typeof fetchOffersByEan>

const mockOffers: Offer[] = mockedAlgoliaResponse.hits

describe('useVideoOffers', () => {
  it('should return offers when asking for specific ids', async () => {
    mockfetchOffersByIds.mockResolvedValueOnce([mockOffers[0], mockOffers[1]])

    const { result } = renderHook(
      () => useVideoOffers([{}] as OffersModuleParameters[], 'moduleId', ['offerId1', 'offerId2']),
      {
        // eslint-disable-next-line local-rules/no-react-query-provider-hoc
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
        useVideoOffers([{}] as OffersModuleParameters[], 'moduleId', undefined, ['ean1', 'ean2']),
      {
        // eslint-disable-next-line local-rules/no-react-query-provider-hoc
        wrapper: ({ children }) => reactQueryProviderHOC(children),
      }
    )

    await act(async () => {})
    expect(result.current.offers).toEqual([offersFixture[0], offersFixture[1]])
  })
})
