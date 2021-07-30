import { waitFor } from 'tests/utils'

import { getPosition } from './getPosition'
import { EiffelTourCoordinates } from './tests.utils'

describe('getPosition', () => {
  afterEach(() => jest.restoreAllMocks())

  it('should resolve with the geolocation', async () => {
    const setPosition = jest.fn()
    const setIsPositionUnavailable = jest.fn()
    getPosition(setPosition, setIsPositionUnavailable)

    await waitFor(() => expect(global.navigator.geolocation.getCurrentPosition).toBeCalled())
    expect(setPosition).toBeCalledWith(EiffelTourCoordinates)
  })
})
