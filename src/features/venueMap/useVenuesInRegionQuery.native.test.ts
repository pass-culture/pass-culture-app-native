import * as venueMapStore from 'features/venueMap/store/venueMapStore'
import { venuesFixture as mockVenues } from 'libs/algolia/fetchAlgolia/fetchVenues/fixtures/venuesFixture'
import { Region } from 'libs/maps/maps'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, renderHook, waitFor } from 'tests/utils'

import { useVenuesInRegionQuery } from './useVenuesInRegionQuery'

jest.mock('libs/network/NetInfoWrapper')

const mockFetchVenues = jest.fn()
jest.mock('libs/algolia/fetchAlgolia/fetchVenues/fetchVenues', () => ({
  fetchVenues: (params: unknown) => mockFetchVenues(params),
}))

const region: Region = {
  latitude: 48.866667,
  latitudeDelta: 0.08157178378529253,
  longitude: 2.333333,
  longitudeDelta: 0.04760990854064799,
}

describe('useVenuesInRegionQuery', () => {
  const spySetVenues = jest.spyOn(venueMapStore, 'setVenues')

  beforeAll(() => {
    act(() => {
      venueMapStore.setVenueTypeCode(null)
    })
  })

  it('should fetch all venues', async () => {
    renderHook(() => useVenuesInRegionQuery({ region }), {
      wrapper: ({ children }) => reactQueryProviderHOC(children),
    })

    await waitFor(() => {
      expect(mockFetchVenues).toHaveBeenCalledWith({
        buildLocationParameterParams: {
          aroundMeRadius: 'all',
          aroundPlaceRadius: 50,
          selectedLocationMode: 'AROUND_PLACE',
          userLocation: {
            latitude: 48.866667,
            longitude: 2.333333,
          },
        },
        options: {
          hitsPerPage: 1000,
        },
        query: '',
      })
    })
  })

  it('should not fetch venues when no region defined', () => {
    renderHook(
      () =>
        useVenuesInRegionQuery({
          region: {} as Region,
          radius: 10,
        }),
      {
        wrapper: ({ children }) => reactQueryProviderHOC(children),
      }
    )

    expect(mockFetchVenues).not.toHaveBeenCalled()
  })

  it('should not dispatch in context when initial venues not defined', async () => {
    renderHook(
      () =>
        useVenuesInRegionQuery({
          region,
          radius: 10,
        }),
      {
        wrapper: ({ children }) => reactQueryProviderHOC(children),
      }
    )

    await waitFor(() => {
      expect(spySetVenues).toHaveBeenCalledTimes(0)
    })
  })

  it('should return custom data', async () => {
    mockFetchVenues.mockResolvedValueOnce(mockVenues)
    const { result } = renderHook(
      () =>
        useVenuesInRegionQuery({
          region,
          radius: 10,
          select: (data) => data?.map((value) => value.venueId),
        }),
      {
        wrapper: ({ children }) => reactQueryProviderHOC(children),
      }
    )

    await waitFor(() => {
      expect(result.current.data).toStrictEqual(mockVenues.map((venue) => venue.venueId))
    })
  })
})
