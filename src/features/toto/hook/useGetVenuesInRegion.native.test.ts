import { useGetVenuesInRegion } from 'features/toto/hook/useGetVenuesInRegion'
import { useGetAllVenues } from 'features/toto/useGetAllVenues'
import { venuesFixture } from 'libs/algolia/fetchAlgolia/fetchVenues/fixtures/venuesFixture'
import { renderHook } from 'tests/utils'

jest.mock('features/venueMap/useGetAllVenues')
const mockUseGetAllVenues = useGetAllVenues as jest.Mock
mockUseGetAllVenues.mockReturnValue({ data: venuesFixture })

const mockRegion = {
  latitude: 48.8566,
  latitudeDelta: 0.07799560849023598,
  longitude: 2.3522,
  longitudeDelta: 0.06773949313991143,
}

describe('useGetVenuesInRegion', () => {
  it('should return venues in region when no venue is selected', () => {
    const { result } = renderHook(() => useGetVenuesInRegion(mockRegion, null))

    expect(result.current).toEqual(venuesFixture)
  })

  it('should return venues in region when a venue is selected and is in region', () => {
    const { result } = renderHook(() => useGetVenuesInRegion(mockRegion, venuesFixture[0]))

    expect(result.current).toEqual(venuesFixture)
  })

  it('should return venues in region + selected venue when a venue is selected and is out of region', () => {
    mockUseGetAllVenues.mockReturnValueOnce({ data: venuesFixture.slice(1) })
    const { result } = renderHook(() => useGetVenuesInRegion(mockRegion, venuesFixture[0]))

    expect(result.current).toEqual([...venuesFixture.slice(1), venuesFixture[0]])
  })
})
