import { venuesFixture } from 'libs/algolia/fetchAlgolia/fetchVenues/fixtures/venuesFixture'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { renderHook, waitFor } from 'tests/utils'

import { useGetVenuesInRegion } from './useGetVenuesInRegion'

const mockFetchVenues = jest.fn()
jest.mock('libs/algolia/fetchAlgolia/fetchVenues/fetchVenues', () => ({
  fetchVenues: (params: unknown) => mockFetchVenues(params),
}))

const mockRegion = {
  latitude: 48.8566,
  latitudeDelta: 0.07799560849023598,
  longitude: 2.3522,
  longitudeDelta: 0.06773949313991143,
}

describe('useGetVenuesInRegion', () => {
  beforeEach(() => {
    mockFetchVenues.mockResolvedValue(venuesFixture)
  })

  it('should return venues in specific region', async () => {
    const { result } = renderHook(() => useGetVenuesInRegion(mockRegion), {
      wrapper: ({ children }) => reactQueryProviderHOC(children),
    })

    await waitFor(() => expect(result.current).toStrictEqual(venuesFixture))
  })

  it('should return undefined when region is not specified', async () => {
    const { result } = renderHook(() => useGetVenuesInRegion(), {
      wrapper: ({ children }) => reactQueryProviderHOC(children),
    })

    await waitFor(() => expect(result.current).toBeUndefined())
  })

  it('should return undefined if no venues are retrieved', async () => {
    mockFetchVenues.mockResolvedValueOnce(null)

    const { result } = renderHook(() => useGetVenuesInRegion(mockRegion), {
      wrapper: ({ children }) => reactQueryProviderHOC(children),
    })

    await waitFor(() => expect(result.current).toBeUndefined())
  })

  it('should return an empty list if geoloc data are not good', async () => {
    mockFetchVenues.mockReturnValueOnce(
      venuesFixture.map((venue) => ({
        ...venue,
        _geoloc: { ...venue._geoloc, lat: undefined, lng: undefined },
      }))
    )

    const { result } = renderHook(() => useGetVenuesInRegion(mockRegion), {
      wrapper: ({ children }) => reactQueryProviderHOC(children),
    })

    await waitFor(() => expect(result.current).toStrictEqual([]))
  })
})
