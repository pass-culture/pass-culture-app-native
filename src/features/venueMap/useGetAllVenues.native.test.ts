import algoliasearch from 'algoliasearch'

import { mockAlgoliaVenues } from 'features/search/fixtures/mockAlgoliaVenues'
import { adaptAlgoliaVenues } from 'libs/algolia/fetchAlgolia/fetchVenues/adaptAlgoliaVenues'
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
const mockUseVenueMapState = jest.fn()
const mockDispatch = jest.fn()
jest.mock('features/venueMap/context/VenueMapWrapper', () => ({
  useVenueMapState: () => mockUseVenueMapState(),
}))

const region: Region = {
  latitude: 48.866667,
  latitudeDelta: 0.08157178378529253,
  longitude: 2.333333,
  longitudeDelta: 0.04760990854064799,
}

const initialVenues = adaptAlgoliaVenues(mockAlgoliaVenues)

describe('useGetAllVenues', () => {
  describe('When filter not applied', () => {
    beforeAll(() => {
      mockUseVenueMapState.mockReturnValue({
        venueMapState: { venueTypeCode: null },
        dispatch: mockDispatch,
      })
    })

    it('should fetch all venues when initial venues not defined', async () => {
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

    it('should not fetch all venues when initial venues defined', () => {
      renderHook(
        () =>
          useGetAllVenues({
            region,
            radius: 10,
            initialVenues,
          }),
        {
          wrapper: ({ children }) => reactQueryProviderHOC(children),
        }
      )

      expect(search).not.toHaveBeenCalled()
    })

    it('should return initial venues when defined', () => {
      const { result } = renderHook(
        () =>
          useGetAllVenues({
            region,
            radius: 10,
            initialVenues,
          }),
        {
          wrapper: ({ children }) => reactQueryProviderHOC(children),
        }
      )

      expect(result.current.venues).toEqual(initialVenues)
    })

    it('should dispatch in context inital venues when defined', () => {
      renderHook(
        () =>
          useGetAllVenues({
            region,
            radius: 10,
            initialVenues,
          }),
        {
          wrapper: ({ children }) => reactQueryProviderHOC(children),
        }
      )

      expect(mockDispatch).toHaveBeenNthCalledWith(1, {
        type: 'SET_VENUES',
        payload: initialVenues,
      })
    })

    it('should not dispatch in context when inital venues not defined', async () => {
      renderHook(
        () =>
          useGetAllVenues({
            region,
            radius: 10,
          }),
        {
          wrapper: ({ children }) => reactQueryProviderHOC(children),
        }
      )

      await waitFor(() => {
        expect(mockDispatch).toHaveBeenCalledTimes(0)
      })
    })

    it('should not return initial venues when not defined', async () => {
      const { result } = renderHook(
        () =>
          useGetAllVenues({
            region,
            radius: 10,
          }),
        {
          wrapper: ({ children }) => reactQueryProviderHOC(children),
        }
      )

      await waitFor(() => {
        expect(result.current.venues).toEqual(undefined)
      })
    })
  })
})
