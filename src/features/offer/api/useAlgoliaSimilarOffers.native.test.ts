import { useAlgoliaSimilarOffers } from 'features/offer/api/useAlgoliaSimilarOffers'
import { mockedAlgoliaResponse } from 'libs/algolia/__mocks__/mockedAlgoliaResponse'
import * as fetchOffersByIdsAPI from 'libs/algolia/fetchAlgolia/fetchOffersByIds'
import * as filterOfferHitAPI from 'libs/algolia/fetchAlgolia/transformOfferHit'
import * as getSimilarOrRecoOffersInOrder from 'shared/offer/getSimilarOrRecoOffersInOrder'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, renderHook, waitFor } from 'tests/utils'

jest.mock('features/auth/context/AuthContext')

const getSimilarOffersInOrderSpy = jest.spyOn(
  getSimilarOrRecoOffersInOrder,
  'getSimilarOrRecoOffersInOrder'
)

const ids = ['102280', '102272', '102249', '102310']

describe('useAlgoliaSimilarOffers', () => {
  const mockFetchAlgoliaHits = jest.fn().mockResolvedValue(mockedAlgoliaResponse.hits)
  const fetchAlgoliaHitsSpy = jest
    .spyOn(fetchOffersByIdsAPI, 'fetchOffersByIds')
    .mockImplementation(mockFetchAlgoliaHits)

  const filterAlgoliaHitSpy = jest
    .spyOn(filterOfferHitAPI, 'filterOfferHit')
    .mockImplementation(jest.fn())

  it('should fetch algolia when ids are provided', async () => {
    renderHook(() => useAlgoliaSimilarOffers(ids), {
      wrapper: ({ children }) => reactQueryProviderHOC(children),
    })
    await waitFor(() => {
      expect(fetchAlgoliaHitsSpy).toHaveBeenCalledWith({ objectIds: ids, isUserUnderage: false })
    })
  })

  it('should filter algolia hits', async () => {
    renderHook(() => useAlgoliaSimilarOffers(ids), {
      wrapper: ({ children }) => reactQueryProviderHOC(children),
    })
    await waitFor(() => {
      expect(filterAlgoliaHitSpy).toHaveBeenCalledTimes(mockedAlgoliaResponse.hits.length)
    })
  })

  it('should return undefined when algolia does not return any hit', async () => {
    jest.spyOn(fetchOffersByIdsAPI, 'fetchOffersByIds').mockResolvedValueOnce([])
    const { result } = renderHook(() => useAlgoliaSimilarOffers(ids), {
      wrapper: ({ children }) => reactQueryProviderHOC(children),
    })
    await waitFor(() => {
      expect(result.current).toBeUndefined()
      expect(filterAlgoliaHitSpy).not.toHaveBeenCalled()
    })
  })

  it('should return undefined when ids are not provided', async () => {
    const { result } = renderHook(() => useAlgoliaSimilarOffers([]), {
      wrapper: ({ children }) => reactQueryProviderHOC(children),
    })

    expect(result.current).toBeUndefined()
  })

  it('should call function to preserve ids offer order when shouldPreserveIdsOrder is true', async () => {
    renderHook(() => useAlgoliaSimilarOffers(ids, true), {
      wrapper: ({ children }) => reactQueryProviderHOC(children),
    })
    await act(async () => {})

    expect(getSimilarOffersInOrderSpy).toHaveBeenCalledTimes(1)
  })

  it('should not call function to preserve ids offer order when shouldPreserveIdsOrder is undefined', async () => {
    renderHook(() => useAlgoliaSimilarOffers(ids), {
      wrapper: ({ children }) => reactQueryProviderHOC(children),
    })
    await act(async () => {})

    expect(getSimilarOffersInOrderSpy).not.toHaveBeenCalled()
  })

  it('should not call function to preserve ids offer order when shouldPreserveIdsOrder is false', async () => {
    renderHook(() => useAlgoliaSimilarOffers(ids, false), {
      wrapper: ({ children }) => reactQueryProviderHOC(children),
    })
    await act(async () => {})

    expect(getSimilarOffersInOrderSpy).not.toHaveBeenCalled()
  })
})
