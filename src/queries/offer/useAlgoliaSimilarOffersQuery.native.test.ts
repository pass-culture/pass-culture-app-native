import * as fetchOffersByIdsAPI from 'libs/algolia/fetchAlgolia/fetchOffersByIds'
import * as filterOfferHitWithImageAPI from 'libs/algolia/fetchAlgolia/transformOfferHit'
import { mockedAlgoliaResponse } from 'libs/algolia/fixtures/algoliaFixtures'
import { useAlgoliaSimilarOffersQuery } from 'queries/offer/useAlgoliaSimilarOffersQuery'
import * as getSimilarOrRecoOffersInOrder from 'shared/offer/getSimilarOrRecoOffersInOrder'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { renderHook, waitFor } from 'tests/utils'

jest.mock('features/auth/context/AuthContext')

const getSimilarOffersInOrderSpy = jest.spyOn(
  getSimilarOrRecoOffersInOrder,
  'getSimilarOrRecoOffersInOrder'
)

const ids = ['102280', '102272', '102249', '102310']

jest.useFakeTimers()

describe('useAlgoliaSimilarOffersQuery', () => {
  const mockFetchAlgoliaHits = jest.fn().mockResolvedValue(mockedAlgoliaResponse.hits)
  const fetchAlgoliaHitsSpy = jest
    .spyOn(fetchOffersByIdsAPI, 'fetchOffersByIds')
    .mockImplementation(mockFetchAlgoliaHits)

  const filterAlgoliaHitSpy = jest
    .spyOn(filterOfferHitWithImageAPI, 'filterOfferHitWithImage')
    .mockImplementation(jest.fn())

  it('should fetch algolia when ids are provided', async () => {
    renderHook(() => useAlgoliaSimilarOffersQuery(ids), {
      wrapper: ({ children }) => reactQueryProviderHOC(children),
    })
    await waitFor(() => {
      expect(fetchAlgoliaHitsSpy).toHaveBeenCalledWith({ objectIds: ids, isUserUnderage: false })
    })
  })

  it('should filter algolia hits', async () => {
    renderHook(() => useAlgoliaSimilarOffersQuery(ids), {
      wrapper: ({ children }) => reactQueryProviderHOC(children),
    })
    await waitFor(() => {
      expect(filterAlgoliaHitSpy).toHaveBeenCalledTimes(mockedAlgoliaResponse.hits.length)
    })
  })

  it('should return undefined when algolia does not return any hit', async () => {
    jest.spyOn(fetchOffersByIdsAPI, 'fetchOffersByIds').mockResolvedValueOnce([])
    const { result } = renderHook(() => useAlgoliaSimilarOffersQuery(ids), {
      wrapper: ({ children }) => reactQueryProviderHOC(children),
    })
    await waitFor(() => {
      expect(result.current).toBeUndefined()
      expect(filterAlgoliaHitSpy).not.toHaveBeenCalled()
    })
  })

  it('should return undefined when ids are not provided', async () => {
    const { result } = renderHook(() => useAlgoliaSimilarOffersQuery([]), {
      wrapper: ({ children }) => reactQueryProviderHOC(children),
    })

    expect(result.current).toBeUndefined()
  })

  it('should call function to preserve ids offer order when shouldPreserveIdsOrder is true', async () => {
    renderHook(() => useAlgoliaSimilarOffersQuery(ids, true), {
      wrapper: ({ children }) => reactQueryProviderHOC(children),
    })
    await waitFor(async () => expect(getSimilarOffersInOrderSpy).toHaveBeenCalledTimes(1))
  })

  it('should not call function to preserve ids offer order when shouldPreserveIdsOrder is undefined', async () => {
    renderHook(() => useAlgoliaSimilarOffersQuery(ids), {
      wrapper: ({ children }) => reactQueryProviderHOC(children),
    })
    await waitFor(() => expect(getSimilarOffersInOrderSpy).not.toHaveBeenCalled())
  })

  it('should not call function to preserve ids offer order when shouldPreserveIdsOrder is false', async () => {
    renderHook(() => useAlgoliaSimilarOffersQuery(ids, false), {
      wrapper: ({ children }) => reactQueryProviderHOC(children),
    })

    await waitFor(() => expect(getSimilarOffersInOrderSpy).not.toHaveBeenCalled())
  })
})
