import { getGeolocPosition } from './getGeolocPosition'
import { EiffelTourCoordinates } from './tests.utils'

describe('getPosition()', () => {
  it('should resolve with the geolocation', async () => {
    const position = await getGeolocPosition()

    expect(global.navigator.geolocation.getCurrentPosition).toHaveBeenCalledTimes(1)
    expect(position).toEqual(EiffelTourCoordinates)
  })
})
