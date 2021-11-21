import { renderHook, act, cleanup } from '@testing-library/react-hooks'

import { SubcategoryIdEnum } from 'api/gen'
import * as AlgoliaModule from 'libs/algolia/fetchAlgolia/fetchAlgolia'
import { parseSearchParameters } from 'libs/search'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'

import { Offers } from '../../contentful'
import { useHomeModules } from '../useHomeModules'

jest.mock('features/auth/settings')
jest.mock('features/home/api', () => ({
  useUserProfileInfo: jest.fn(() => ({ data: { firstName: 'Christophe', lastName: 'Dupont' } })),
}))

const _geoloc = { lat: 20, lng: 23 }
const subcategoryId = SubcategoryIdEnum.ABOCONCERT
const mockMultipleHits = {
  hits: [
    { objectID: '1', _geoloc, offer: { thumbUrl: '/thumbs/to-image-one', subcategoryId } },
    { objectID: '2', _geoloc, offer: { thumbUrl: '/thumbs/to-image-two', subcategoryId } },
    { objectID: '3', _geoloc, offer: { thumbUrl: undefined, subcategoryId } },
  ],
  nbHits: 10,
}

const fetchMultipleHits = jest.fn().mockResolvedValue(mockMultipleHits)
jest.spyOn(AlgoliaModule, 'fetchMultipleAlgolia').mockImplementation(fetchMultipleHits)

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
      [{ ...parseSearchParameters({ title: 'tile', hitsPerPage: 4 }, null) }],
      null,
      false
    )

    await act(async () => {
      await waitForNextUpdate()
    })

    const { hits, nbHits } = result.current['homeModuleShown']
    expect(nbHits).toEqual(10)
    expect(hits).toEqual([
      {
        objectID: '1',
        _geoloc,
        offer: {
          thumbUrl: 'http://localhost-storage/thumbs/to-image-one',
          subcategoryId,
          prices: undefined,
        },
      },
      {
        objectID: '2',
        _geoloc,
        offer: {
          thumbUrl: 'http://localhost-storage/thumbs/to-image-two',
          subcategoryId,
          prices: undefined,
        },
      },
    ])
    // All offer have an image to be displayed on the homepage
    expect(hits.find((hit) => !hit.offer.thumbUrl)).toBeUndefined()
  })
})
