import { renderHook, act, cleanup } from '@testing-library/react-hooks'

import { parseAlgoliaParameters } from 'libs/algolia/parseAlgoliaParameters'
import { FetchAlgoliaParameters } from 'libs/algolia/types'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'

import { Offers } from '../contentful'

import { useHomeAlgoliaModules } from './useHomeAlgoliaModules'

const mockFetchAlgolia = jest.fn().mockResolvedValue({
  hits: [
    { objectID: '1', offer: { thumbUrl: 'http://to-image-one' } },
    { objectID: '2', offer: { thumbUrl: 'http://to-image-two' } },
    { objectID: '3', offer: { thumbUrl: undefined } },
  ],
  nbHits: 10,
})

jest.mock('libs/algolia/fetchAlgolia', () => ({
  fetchAlgolia: (arg: FetchAlgoliaParameters) => mockFetchAlgolia(arg),
}))

const offerModules = [
  new Offers({
    algolia: { title: 'tile', hitsPerPage: 4 },
    display: { minOffers: 1, title: 'title', layout: 'one-item-medium' },
    moduleId: 'algoliaModuleShown',
  }),
]

describe('useHomeAlgoliaModules', () => {
  afterEach(async () => {
    jest.clearAllMocks()
    await cleanup()
  })

  it('calls fetchAlgolia with params and returns data', async () => {
    const { result, waitForNextUpdate } = renderHook(
      () => useHomeAlgoliaModules(offerModules),
      // eslint-disable-next-line react/display-name
      { wrapper: ({ children }) => reactQueryProviderHOC(children) }
    )

    expect(mockFetchAlgolia).toHaveBeenCalledWith({
      ...parseAlgoliaParameters({
        geolocation: null,
        parameters: { title: 'tile', hitsPerPage: 4 },
      }),
    })

    await act(async () => {
      await waitForNextUpdate()
    })

    const { hits, nbHits } = result.current['algoliaModuleShown']
    expect(nbHits).toEqual(10)
    expect(hits).toEqual([
      { objectID: '1', offer: { thumbUrl: 'http://to-image-one' } },
      { objectID: '2', offer: { thumbUrl: 'http://to-image-two' } },
    ])
    // All offer have an image to be displayed on the homepage
    expect(hits.find((hit) => !hit.offer.thumbUrl)).toBeUndefined()
  })
})
