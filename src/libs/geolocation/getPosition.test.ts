import Geolocation from 'react-native-geolocation-service'

import { waitFor } from 'tests/utils'

import { getPosition } from './getPosition'
import { EiffelTourCoordinates, getCurrentPositionSuccess } from './tests.utils'

describe('getPosition', () => {
  afterEach(() => jest.restoreAllMocks())

  it('should resolve with the geolocation', async () => {
    const getCurrentPosition = jest
      .spyOn(Geolocation, 'getCurrentPosition')
      .mockImplementation(getCurrentPositionSuccess)

    const setInitialPosition = jest.fn()
    getPosition(setInitialPosition)

    await waitFor(() => expect(getCurrentPosition).toHaveBeenCalled())
    expect(setInitialPosition).toHaveBeenCalledWith(EiffelTourCoordinates)
  })
})
