import { OffersModuleParameters } from 'features/home/types'
import { LocationMode } from 'libs/algolia'
import { adaptOffersPlaylistLocationParameters } from 'libs/algolia/fetchAlgolia/fetchMultipleOffers/helpers/adaptOffersPlaylistLocationParameters'

const mockedUserLocation = { latitude: 30, longitude: 30.1 }

describe('adaptOffersPlaylistLocationParameters', () => {
  it('should return adapted location parameters when module is set to isGeolocated with a given aroundRadius', () => {
    const parameters = {
      isGeolocated: true,
      aroundRadius: 100,
    } as OffersModuleParameters

    const result = adaptOffersPlaylistLocationParameters(parameters, mockedUserLocation)

    expect(result).toStrictEqual({
      aroundMeRadius: 100,
      aroundPlaceRadius: 100,
      selectedLocationMode: LocationMode.AROUND_ME,
      userLocation: {
        latitude: 30,
        longitude: 30.1,
      },
    })
  })

  it('should return default adapted location parameters when module is not set with isGeolocated and a given aroundRadius', () => {
    const parameters = {} as OffersModuleParameters

    const result = adaptOffersPlaylistLocationParameters(parameters, mockedUserLocation)

    expect(result).toStrictEqual({
      aroundMeRadius: 'all',
      aroundPlaceRadius: 'all',
      selectedLocationMode: LocationMode.EVERYWHERE,
      userLocation: {
        latitude: 30,
        longitude: 30.1,
      },
    })
  })
})
