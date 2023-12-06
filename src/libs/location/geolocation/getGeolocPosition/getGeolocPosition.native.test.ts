import Geolocation from 'react-native-geolocation-service'

import { getGeolocPosition } from './getGeolocPosition'
import { EiffelTourCoordinates, getCurrentPositionSuccess } from './tests.utils'

jest.mock('libs/location/geolocation/getGeolocPosition/getGeolocPosition', () =>
  jest.requireActual('./getGeolocPosition')
)

describe('getGeolocPosition()', () => {
  it('should resolve with the geolocation', async () => {
    const getCurrentPositionSpy = jest
      .spyOn(Geolocation, 'getCurrentPosition')
      .mockImplementation(getCurrentPositionSuccess)
    const position = await getGeolocPosition()

    expect(getCurrentPositionSpy).toHaveBeenCalledTimes(1)
    expect(position).toEqual(EiffelTourCoordinates)
  })
})
