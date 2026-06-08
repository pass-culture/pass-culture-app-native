import { SearchWrapper, useSearch } from 'features/search/context/SearchWrapper'
import { getGeolocPosition } from 'libs/location/geolocation/getGeolocPosition/getGeolocPosition'
import { checkGeolocPermission, GeolocPermissionState } from 'libs/location/location'
import { LocationLabel, LocationMode } from 'libs/location/types'
import { locationActions } from 'libs/locationV2/location.store'
import { SuggestedPlace } from 'libs/place/types'
import { act, renderHook } from 'tests/utils'

jest.mock('libs/location/geolocation/getGeolocPosition/getGeolocPosition')
const getGeolocPositionMock = getGeolocPosition as jest.MockedFunction<typeof getGeolocPosition>

jest.mock('libs/location/geolocation/requestGeolocPermission/requestGeolocPermission')

jest.mock('libs/location/geolocation/checkGeolocPermission/checkGeolocPermission')
const mockCheckGeolocPermission = checkGeolocPermission as jest.MockedFunction<
  typeof checkGeolocPermission
>

mockCheckGeolocPermission.mockResolvedValue(GeolocPermissionState.GRANTED)

jest.useFakeTimers()

const mockPlace: SuggestedPlace = {
  label: 'Kourou',
  info: 'Guyane',
  type: 'street',
  geolocation: { longitude: -52.669736, latitude: 5.16186 },
}

describe('useSearch', () => {
  it('should update locationType with type Around Place when Location mode is switched to a specified place', async () => {
    const { result } = renderUseSearch()

    await act(async () => {
      locationActions.setPlace(mockPlace)
      locationActions.setLocationMode(LocationMode.AROUND_PLACE)
    })

    expect(result.current.searchState.locationFilter.locationType).toBe(LocationMode.AROUND_PLACE)
  })

  it('should update locationType with type Around me when Location mode is switched to geolocation', async () => {
    getGeolocPositionMock.mockResolvedValueOnce({ latitude: 0, longitude: 0 })

    const { result } = renderUseSearch()

    await act(async () => {
      locationActions.setPlace(mockPlace)
      locationActions.setLocationMode(LocationMode.AROUND_PLACE)
    })

    expect(result.current.searchState.locationFilter.locationType).toBe(LocationMode.AROUND_PLACE)

    await act(async () => {
      locationActions.setLocationMode(LocationMode.AROUND_ME)
    })

    expect(result.current.searchState.locationFilter.locationType).toBe(LocationMode.AROUND_ME)
  })

  it(`should update locationType with type Everywhere when Location mode is switched to ${LocationLabel.everywhereLabel}`, async () => {
    const { result } = renderUseSearch()

    await act(async () => {
      locationActions.setPlace(mockPlace)
      locationActions.setLocationMode(LocationMode.AROUND_PLACE)
    })

    expect(result.current.searchState.locationFilter.locationType).toBe(LocationMode.AROUND_PLACE)

    await act(async () => {
      locationActions.setLocationMode(LocationMode.EVERYWHERE)
    })

    expect(result.current.searchState.locationFilter.locationType).toBe(LocationMode.EVERYWHERE)
  })
})

const renderUseSearch = () => {
  return renderHook(useSearch, { wrapper: SearchWrapper })
}
