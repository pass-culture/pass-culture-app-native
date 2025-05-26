import { EiffelTourCoordinates } from '../tests/tests.utils'

import { getGeolocPosition } from './getGeolocPosition'

describe('getPosition()', () => {
  it('should resolve with the geolocation', async () => {
    const position = await getGeolocPosition()

    expect(global.navigator.geolocation.getCurrentPosition).toHaveBeenCalledTimes(1)
    expect(position).toEqual(EiffelTourCoordinates)
  })
})
