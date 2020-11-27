import { renderHook, act, cleanup } from '@testing-library/react-hooks'

import { parseAlgoliaParameters } from 'libs/algolia/parseAlgoliaParameters'
import { FetchAlgoliaParameters } from 'libs/algolia/types'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'

import { Offers } from '../contentful'

import { useHomeAlgoliaModules } from './useHomeAlgoliaModules'

const mockFetchAlgolia = jest.fn().mockResolvedValue({ hits: ['data'], nbHits: 10 })

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

    expect(result.current['algoliaModuleShown']).toEqual({ hits: ['data'], nbHits: 10 })
  })
})
