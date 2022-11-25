import { getPosition } from './getPosition'
import { EiffelTourCoordinates } from './tests.utils'

jest.mock('libs/geolocation/getPosition', () => jest.requireActual('./getPosition'))

describe('getPosition()', () => {
  afterEach(jest.restoreAllMocks)

  it('should resolve with the geolocation', async () => {
    const position = await getPosition()
    expect(global.navigator.geolocation.getCurrentPosition).toHaveBeenCalledTimes(1)
    expect(position).toEqual(EiffelTourCoordinates)
  })
})
