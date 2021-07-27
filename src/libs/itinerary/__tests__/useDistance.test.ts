import { mocked } from 'ts-jest/utils'

import { useGeolocation } from 'libs/geolocation'
import {
  emptyGeolocationContext,
  geolocalisationContext,
} from 'libs/geolocation/fixtures/geolocationContext'
import { useDistance } from 'libs/geolocation/hooks/useDistance'
import { formatDistance } from 'libs/parsers'

jest.mock('libs/parsers')
jest.mock('libs/geolocation')
const mockedUseGeolocation = mocked(useGeolocation, true)

describe('useDistance', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const offerPosition = { lat: 31, long: 56 }

  it('should call useGeolocation and formatDistance when geolocation is on', () => {
    useDistance(offerPosition)
    expect(useGeolocation).toHaveBeenCalledWith()
    expect(formatDistance).toHaveBeenCalledWith(offerPosition, geolocalisationContext.position)
  })

  it('should return undefined when no offerpositon given', () => {
    // @ts-expect-error offer position should not be undefined or null
    useDistance()
    expect(useGeolocation).toHaveBeenCalledWith()
    expect(formatDistance).not.toHaveBeenCalled()
  })
  it('should return undefined when geolocation is off', () => {
    mockedUseGeolocation.mockReturnValueOnce(emptyGeolocationContext)
    useDistance(offerPosition)
    expect(useGeolocation).toHaveBeenCalledWith()
    expect(formatDistance).not.toHaveBeenCalled()
  })
})
