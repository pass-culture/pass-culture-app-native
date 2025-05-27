import * as fetchVenuesAPI from 'libs/algolia/fetchAlgolia/fetchVenues/fetchVenues'
import { venuesFixture as mockVenues } from 'libs/algolia/fetchAlgolia/fetchVenues/fixtures/venuesFixture'
import { Region } from 'libs/maps/maps'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { renderHook, waitFor } from 'tests/utils'

import { useVenuesInRegionQuery } from './useVenuesInRegionQuery'

jest.mock('libs/network/NetInfoWrapper')

const mockFetchVenues = jest.spyOn(fetchVenuesAPI, 'fetchVenues').mockResolvedValue(mockVenues)

const region: Region = {
  latitude: 48.866667,
  latitudeDelta: 0.08157178378529253,
  longitude: 2.333333,
  longitudeDelta: 0.04760990854064799,
}

describe('useVenuesInRegionQuery', () => {
  it('should fetch all venues', async () => {
    renderHook(() => useVenuesInRegionQuery({ region }), {
      wrapper: ({ children }) => reactQueryProviderHOC(children),
    })

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

  it('should return custom data', async () => {
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

    await waitFor(() =>
      expect(result.current.data).toStrictEqual(mockVenues.map((venue) => venue.venueId))
    )
  })
})
