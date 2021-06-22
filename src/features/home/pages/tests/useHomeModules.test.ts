import { MultipleQueriesResponse } from '@algolia/client-search'
import { renderHook, act, cleanup } from '@testing-library/react-hooks'

import * as SearchModule from 'libs/search'
import { SearchHit, parseAlgoliaParameters } from 'libs/search'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'

import { Offers } from '../../contentful'
import { useHomeModules } from '../useHomeModules'

jest.mock('features/auth/settings', () => ({
  useAppSettings: jest.fn(() => ({})),
}))

const fetchMultipleHits = jest.spyOn(SearchModule, 'fetchMultipleHits').mockResolvedValue({
  results: [
    {
      hits: [
        { objectID: '1', offer: { thumbUrl: 'http://to-image-one' } },
        { objectID: '2', offer: { thumbUrl: 'http://to-image-two' } },
        { objectID: '3', offer: { thumbUrl: undefined } },
      ],
      nbHits: 10,
    },
  ],
} as MultipleQueriesResponse<SearchHit>)

const offerModules = [
  new Offers({
    algolia: [{ title: 'tile', hitsPerPage: 4 }],
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
      { wrapper: ({ children }) => reactQueryProviderHOC(children) }
    )

    expect(fetchMultipleHits).toHaveBeenCalledWith([
      {
        ...parseAlgoliaParameters({
          geolocation: null,
          parameters: { title: 'tile', hitsPerPage: 4 },
        }),
      },
    ])

    await act(async () => {
      await waitForNextUpdate()
    })

    const { hits, nbHits } = result.current['homeModuleShown']
    expect(nbHits).toEqual(10)
    expect(hits).toEqual([
      { objectID: '1', offer: { thumbUrl: 'http://to-image-one' } },
      { objectID: '2', offer: { thumbUrl: 'http://to-image-two' } },
    ])
    // All offer have an image to be displayed on the homepage
    expect(hits.find((hit) => !hit.offer.thumbUrl)).toBeUndefined()
  })
})
