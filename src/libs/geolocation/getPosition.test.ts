import { waitFor } from '@testing-library/react-native'
import { Alert } from 'react-native'
import Geolocation from 'react-native-geolocation-service'

import { getPosition } from './getPosition'
import {
  EiffelTourCoordinates,
  getCurrentPositionFail,
  getCurrentPositionSuccess,
} from './tests.utils'

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
  it('should reject with empty coordinates', async () => {
    const getCurrentPosition = jest
      .spyOn(Geolocation, 'getCurrentPosition')
      .mockImplementation(getCurrentPositionFail)
    const alert = jest.spyOn(Alert, 'alert')

    const setInitialPosition = jest.fn()
    getPosition(setInitialPosition)

    await waitFor(() => expect(getCurrentPosition).toHaveBeenCalled())
    expect(alert).toBeCalled()
  })
})
