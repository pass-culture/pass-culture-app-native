import * as venueMapStore from 'features/venueMap/store/venueMapStore'
import { venuesFilterActions } from 'features/venueMap/store/venuesFilterStore'
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
mockFetchVenues.mockResolvedValue({})

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
      venuesFilterActions.setVenuesFilters([])
    })
  })

  it('should fetch all venues', async () => {
    const { result } = renderHook(() => useVenuesInRegionQuery({ region }), {
      wrapper: ({ children }) => reactQueryProviderHOC(children),
    })

    await waitFor(async () => expect(result.current.isFetched).toBeTruthy())

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

  it('should not fetch venues when no region defined', async () => {
    const { result } = renderHook(
      () =>
        useVenuesInRegionQuery({
          region: {} as Region,
          radius: 10,
        }),
      {
        wrapper: ({ children }) => reactQueryProviderHOC(children),
      }
    )

    await waitFor(async () => expect(result.current.isFetched).toBeFalsy())

    expect(mockFetchVenues).not.toHaveBeenCalled()
  })

  // TODO(PC-36585): Test flaky following the v5 react query update
  // eslint-disable-next-line jest/no-disabled-tests
  it.skip('should not dispatch in context when initial venues not defined', async () => {
    const { result } = renderHook(
      () =>
        useVenuesInRegionQuery({
          region,
          radius: 10,
        }),
      {
        wrapper: ({ children }) => reactQueryProviderHOC(children),
      }
    )
    await act(async () => {})

    await waitFor(() => expect(result.current.isSuccess).toBeFalsy())

    await act(async () => {})

    expect(spySetVenues).toHaveBeenCalledTimes(0)
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

    await waitFor(() => expect(result.current.isSuccess).toBeTruthy())

    expect(result.current.data).toStrictEqual(mockVenues.map((venue) => venue.venueId))
  })
})
