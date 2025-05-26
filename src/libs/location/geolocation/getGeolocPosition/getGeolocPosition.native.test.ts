import Geolocation from 'react-native-geolocation-service'

import { EiffelTourCoordinates, getCurrentPositionSuccess } from '../tests/tests.utils'

import { getGeolocPosition } from './getGeolocPosition'

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
