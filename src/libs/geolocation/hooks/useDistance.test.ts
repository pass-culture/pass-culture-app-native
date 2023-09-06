import { ILocationContext, useLocation } from 'libs/geolocation'
import { useDistance } from 'libs/geolocation/hooks/useDistance'
import { formatDistance } from 'libs/parsers'

jest.mock('libs/parsers')

jest.mock('libs/geolocation')
const mockUseGeolocation = jest.mocked(useLocation)

const position = { latitude: 90, longitude: 90 }
const offerPosition = { lat: 31, long: 56 }

describe('useDistance()', () => {
  it('should call useLocation and formatDistance when geolocation is on', () => {
    // eslint-disable-next-line local-rules/independent-mocks
    mockUseGeolocation.mockReturnValue({ userPosition: position } as ILocationContext)
    useDistance(offerPosition)
    expect(useLocation).toBeCalledWith()
    expect(formatDistance).toBeCalledWith(offerPosition, position)
  })

  it('should return undefined when no offerPosition given', () => {
    // @ts-expect-error offer position should not be undefined or null
    useDistance(undefined)
    expect(useLocation).toBeCalledWith()
    expect(formatDistance).not.toBeCalled()
  })
  it('should return undefined when position is null', () => {
    // eslint-disable-next-line local-rules/independent-mocks
    mockUseGeolocation.mockReturnValue({ userPosition: null } as ILocationContext)
    useDistance(offerPosition)
    expect(useLocation).toBeCalledWith()
    expect(formatDistance).not.toBeCalled()
  })
})
