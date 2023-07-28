import { useAlgoliaRecommendedHits } from 'features/home/api/useAlgoliaRecommendedHits'
import { mockedAlgoliaResponse } from 'libs/algolia/__mocks__/mockedAlgoliaResponse'
import * as fetchOffersByIdsAPI from 'libs/algolia/fetchAlgolia/fetchOffersByIds'
import * as filterOfferHitAPI from 'libs/algolia/fetchAlgolia/transformOfferHit'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { renderHook, waitFor } from 'tests/utils'

const ids = ['102280', '102272', '102249', '102310']
describe('useAlgoliaRecommendedHits', () => {
  const mockFetchAlgoliaHits = jest.fn().mockResolvedValue(mockedAlgoliaResponse.hits)
  const fetchAlgoliaHitsSpy = jest
    .spyOn(fetchOffersByIdsAPI, 'fetchOffersByIds')
    .mockImplementation(mockFetchAlgoliaHits)

  const filterAlgoliaHitSpy = jest
    .spyOn(filterOfferHitAPI, 'filterOfferHit')
    .mockImplementation(jest.fn())

  it('should fetch algolia when ids are provided', async () => {
    renderHook(() => useAlgoliaRecommendedHits(ids, 'abcd'), {
      // eslint-disable-next-line local-rules/no-react-query-provider-hoc
      wrapper: ({ children }) => reactQueryProviderHOC(children),
    })
    await waitFor(() => {
      expect(fetchAlgoliaHitsSpy).toHaveBeenCalledWith({ objectIds: ids, isUserUnderage: false })
    })
  })

  it('should filter algolia hits', async () => {
    renderHook(() => useAlgoliaRecommendedHits(ids, 'abcd'), {
      // eslint-disable-next-line local-rules/no-react-query-provider-hoc
      wrapper: ({ children }) => reactQueryProviderHOC(children),
    })
    await waitFor(() => {
      expect(filterAlgoliaHitSpy).toHaveBeenCalledTimes(mockedAlgoliaResponse.hits.length)
    })
  })

  it('should return undefined when algolia does not return any hit', async () => {
    jest.spyOn(fetchOffersByIdsAPI, 'fetchOffersByIds').mockResolvedValueOnce([])
    const { result } = renderHook(() => useAlgoliaRecommendedHits(ids, 'abcd'), {
      // eslint-disable-next-line local-rules/no-react-query-provider-hoc
      wrapper: ({ children }) => reactQueryProviderHOC(children),
    })
    await waitFor(() => {
      expect(result.current).toBeUndefined()
      expect(filterAlgoliaHitSpy).not.toHaveBeenCalled()
    })
  })

  it('should return undefined when ids are not provided', async () => {
    const { result } = renderHook(() => useAlgoliaRecommendedHits([], 'abcd'), {
      // eslint-disable-next-line local-rules/no-react-query-provider-hoc
      wrapper: ({ children }) => reactQueryProviderHOC(children),
    })
    expect(result.current).toBeUndefined()
  })
})
