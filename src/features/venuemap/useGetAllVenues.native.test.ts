import algoliasearch from 'algoliasearch'

import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { renderHook, waitFor } from 'tests/utils'

import { useGetAllVenues } from './useGetAllVenues'

jest.mock('algoliasearch')

const mockInitIndex = algoliasearch('', '').initIndex
const search = mockInitIndex('').search as jest.Mock
jest.mock('libs/algolia/fetchAlgolia/AlgoliaError', () => ({
  captureAlgoliaError: jest.fn(),
}))

describe('useGetAllVenues', () => {
  it('should fetch all venues', async () => {
    renderHook(() => useGetAllVenues(), {
      wrapper: ({ children }) => reactQueryProviderHOC(children),
    })

    await waitFor(() => {
      expect(search).toHaveBeenCalledWith('', {
        aroundLatLng: '0, 0',
        aroundRadius: 'all',
        attributesToHighlight: [],
        facetFilters: [['has_at_least_one_bookable_offer:true']],
      })
    })
  })
})
