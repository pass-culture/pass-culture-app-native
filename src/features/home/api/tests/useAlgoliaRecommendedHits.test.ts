import { renderHook } from '@testing-library/react-hooks'

import { useAlgoliaRecommendedHits } from 'features/home/api/useAlgoliaRecommendedHits'
import * as fetchOfferHitsAPI from 'libs/algolia/fetchAlgolia/fetchOfferHits'
import * as filterOfferHitAPI from 'libs/algolia/fetchAlgolia/transformOfferHit'
import { mockedAlgoliaResponse } from 'libs/algolia/mockedResponses/mockedAlgoliaResponse'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'

jest.mock('features/profile/api', () => ({
  useUserProfileInfo: jest.fn(() => ({ data: { firstName: 'Christophe', lastName: 'Dupont' } })),
}))

jest.mock('features/auth/settings')

const ids = ['102280', '102272', '102249', '102310']
describe('useAlgoliaRecommendedHits', () => {
  const mockFetchAlgoliaHits = jest.fn().mockResolvedValue(mockedAlgoliaResponse.hits)
  const fetchAlgoliaHitsSpy = jest
    .spyOn(fetchOfferHitsAPI, 'fetchOfferHits')
    .mockImplementation(mockFetchAlgoliaHits)

  const filterAlgoliaHitSpy = jest
    .spyOn(filterOfferHitAPI, 'filterOfferHit')
    .mockImplementation(jest.fn())

  it('should fetch algolia when ids are provided', async () => {
    const { waitForNextUpdate } = renderHook(() => useAlgoliaRecommendedHits(ids, 'abcd'), {
      // eslint-disable-next-line local-rules/no-react-query-provider-hoc
      wrapper: ({ children }) => reactQueryProviderHOC(children),
    })
    await waitForNextUpdate()
    expect(fetchAlgoliaHitsSpy).toHaveBeenCalledWith({ objectIds: ids, isUserUnderage: false })
  })

  it('should filter algolia hits', async () => {
    const { waitForNextUpdate } = renderHook(() => useAlgoliaRecommendedHits(ids, 'abcd'), {
      // eslint-disable-next-line local-rules/no-react-query-provider-hoc
      wrapper: ({ children }) => reactQueryProviderHOC(children),
    })
    await waitForNextUpdate()
    expect(filterAlgoliaHitSpy).toHaveBeenCalledTimes(mockedAlgoliaResponse.hits.length)
  })

  it('should return undefined when algolia does not return any hit', async () => {
    jest.spyOn(fetchOfferHitsAPI, 'fetchOfferHits').mockResolvedValueOnce([])
    const { waitForNextUpdate, result } = renderHook(() => useAlgoliaRecommendedHits(ids, 'abcd'), {
      // eslint-disable-next-line local-rules/no-react-query-provider-hoc
      wrapper: ({ children }) => reactQueryProviderHOC(children),
    })
    await waitForNextUpdate()
    expect(result.current).toBeUndefined()
    expect(filterAlgoliaHitSpy).not.toHaveBeenCalled()
  })

  it('should return undefined when ids are not provided', async () => {
    const { result } = renderHook(() => useAlgoliaRecommendedHits([], 'abcd'), {
      // eslint-disable-next-line local-rules/no-react-query-provider-hoc
      wrapper: ({ children }) => reactQueryProviderHOC(children),
    })
    expect(result.current).toBeUndefined()
  })
})
