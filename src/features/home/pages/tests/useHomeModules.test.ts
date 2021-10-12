import { MultipleQueriesResponse } from '@algolia/client-search'
import { renderHook, act, cleanup } from '@testing-library/react-hooks'

import { SubcategoryIdEnum } from 'api/gen'
import { SearchHit, parseSearchParameters } from 'libs/search'
import * as SearchModule from 'libs/search/fetch/search'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'

import { Offers } from '../../contentful'
import { useHomeModules } from '../useHomeModules'

jest.mock('features/auth/settings')
jest.mock('features/home/api', () => ({
  useUserProfileInfo: jest.fn(() => ({ data: { firstName: 'Christophe', lastName: 'Dupont' } })),
}))

jest.mock('libs/search/useSendAdditionalRequestToAppSearch', () => ({
  useSendAdditionalRequestToAppSearch: jest.fn(() => () => null),
}))

const subcategoryId = SubcategoryIdEnum.ABOCONCERT
const mockMultipleHits = {
  results: [
    {
      hits: [
        { objectID: '1', offer: { thumbUrl: 'http://to-image-one', subcategoryId } },
        { objectID: '2', offer: { thumbUrl: 'http://to-image-two', subcategoryId } },
        { objectID: '3', offer: { thumbUrl: undefined, subcategoryId } },
      ],
      nbHits: 10,
    },
  ],
} as MultipleQueriesResponse<SearchHit>

const fetchMultipleHits = jest.fn().mockResolvedValue(mockMultipleHits)
jest.spyOn(SearchModule, 'fetchMultipleHits').mockImplementation(fetchMultipleHits)
jest.mock('libs/algolia/fetchAlgolia', () => ({
  useTransformAlgoliaHits: jest.fn(() => (hit: SearchHit) => hit),
}))

const offerModules = [
  new Offers({
    search: [{ title: 'tile', hitsPerPage: 4 }],
    display: { minOffers: 1, title: 'title', layout: 'one-item-medium' },
    moduleId: 'homeModuleShown',
  }),
]

let mockPositionReceived = false
jest.mock('libs/geolocation', () => ({
  useGeolocation: jest.fn(() => ({ position: null, positionReceived: mockPositionReceived })),
}))

describe('useHomeModules', () => {
  afterEach(async () => {
    jest.clearAllMocks()
    await cleanup()
  })

  it('calls fetchMultipleHits with params and returns data', async () => {
    mockPositionReceived = true
    const { result, waitForNextUpdate } = renderHook(
      () => useHomeModules(offerModules),
      // eslint-disable-next-line react/display-name
      // eslint-disable-next-line local-rules/no-react-query-provider-hoc
      { wrapper: ({ children }) => reactQueryProviderHOC(children) }
    )

    expect(fetchMultipleHits).toHaveBeenCalledWith(
      [
        {
          ...parseSearchParameters({ title: 'tile', hitsPerPage: 4 }, null),
        },
      ],
      null,
      false
    )

    await act(async () => {
      await waitForNextUpdate()
    })

    const { hits, nbHits } = result.current['homeModuleShown']
    expect(nbHits).toEqual(10)
    expect(hits).toEqual([
      { objectID: '1', offer: { thumbUrl: 'http://to-image-one', subcategoryId } },
      { objectID: '2', offer: { thumbUrl: 'http://to-image-two', subcategoryId } },
    ])
    // All offer have an image to be displayed on the homepage
    expect(hits.find((hit) => !hit.offer.thumbUrl)).toBeUndefined()
  })
})
