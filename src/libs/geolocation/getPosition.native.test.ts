import Geolocation from 'react-native-geolocation-service'

import { getPosition } from './getPosition'
import { EiffelTourCoordinates, getCurrentPositionSuccess } from './tests.utils'

jest.mock('libs/geolocation/getPosition', () => jest.requireActual('./getPosition'))

describe('getPosition()', () => {
  afterEach(jest.restoreAllMocks)

  it('should resolve with the geolocation', async () => {
    const getCurrentPositionSpy = jest
      .spyOn(Geolocation, 'getCurrentPosition')
      .mockImplementation(getCurrentPositionSuccess)
    const position = await getPosition()
    expect(getCurrentPositionSpy).toHaveBeenCalledTimes(1)
    expect(position).toEqual(EiffelTourCoordinates)
  })
})
