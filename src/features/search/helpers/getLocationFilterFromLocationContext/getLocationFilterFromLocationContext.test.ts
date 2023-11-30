import { DEFAULT_RADIUS } from 'features/location/components/SearchLocationModal'
import { LocationType } from 'features/search/enums'
import { getLocationFilterFromLocationContext } from 'features/search/helpers/getLocationFilterFromLocationContext/getLocationFilterFromLocationContext'
import { SuggestedPlace } from 'libs/place'

const mockPlace: SuggestedPlace = {
  label: 'Kourou',
  info: 'Guyane',
  geolocation: { longitude: -52.669736, latitude: 5.16186 },
}

describe('getLocationFilterFromLocationContext', () => {
  it('should return geolocation type if only the geolocation is activate', () => {
    expect(getLocationFilterFromLocationContext({ isGeolocated: true, place: null })).toEqual({
      locationType: LocationType.AROUND_ME,
      aroundRadius: DEFAULT_RADIUS,
    })
  })

  it('should return place type if only the place is activate', () => {
    expect(
      getLocationFilterFromLocationContext({
        isGeolocated: false,
        isCustomPosition: true,
        place: mockPlace,
      })
    ).toEqual({
      locationType: LocationType.PLACE,
      aroundRadius: DEFAULT_RADIUS,
      place: mockPlace,
    })
  })

  it('should return place type if the place and the geolocation are activate', () => {
    expect(
      getLocationFilterFromLocationContext({
        isGeolocated: true,
        isCustomPosition: true,
        place: mockPlace,
      })
    ).toEqual({
      locationType: LocationType.PLACE,
      aroundRadius: DEFAULT_RADIUS,
      place: mockPlace,
    })
  })

  it('should return everywhere type if the place and the geolocation are disable', () => {
    expect(
      getLocationFilterFromLocationContext({
        isGeolocated: false,
        isCustomPosition: false,
        place: null,
      })
    ).toEqual({
      locationType: LocationType.EVERYWHERE,
    })
  })
})
