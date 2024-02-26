import algoliasearch from 'algoliasearch'

import { Region } from 'libs/maps/maps'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { renderHook, waitFor } from 'tests/utils'

import { useGetAllVenues } from './useGetAllVenues'

jest.mock('algoliasearch')

const mockInitIndex = algoliasearch('', '').initIndex
const search = mockInitIndex('').search as jest.Mock
jest.mock('libs/algolia/fetchAlgolia/AlgoliaError', () => ({
  captureAlgoliaError: jest.fn(),
}))

const region: Region = {
  latitude: 48.866667,
  latitudeDelta: 0.08157178378529253,
  longitude: 2.333333,
  longitudeDelta: 0.04760990854064799,
}

describe('useGetAllVenues', () => {
  it('should fetch all venues', async () => {
    renderHook(() => useGetAllVenues({ region, radius: 10 }), {
      wrapper: ({ children }) => reactQueryProviderHOC(children),
    })

    await waitFor(() => {
      expect(search).toHaveBeenCalledWith('', {
        aroundLatLng: '48.866667, 2.333333',
        aroundRadius: 10000,
        attributesToHighlight: [],
        facetFilters: [['has_at_least_one_bookable_offer:true']],
        hitsPerPage: 1000,
      })
    })
  })
})
