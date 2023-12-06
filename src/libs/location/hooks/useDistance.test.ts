import { ILocationContext, useLocation } from 'libs/location'
import { useDistance } from 'libs/location/hooks/useDistance'
import { formatDistance } from 'libs/parsers'

jest.mock('libs/parsers')

jest.mock('libs/geolocation')
const mockUseGeolocation = jest.mocked(useLocation)

const position = { latitude: 90, longitude: 90 }
const offerPosition = { lat: 31, long: 56 }
const undefinedOfferPosition = {
  lat: undefined,
  lng: undefined,
}

describe('useDistance()', () => {
  it('should call useLocation and formatDistance when geolocation is on', () => {
    // eslint-disable-next-line local-rules/independent-mocks
    mockUseGeolocation.mockReturnValue({ userPosition: position } as ILocationContext)
    useDistance(offerPosition)

    expect(formatDistance).toHaveBeenCalledWith(offerPosition, position)
  })

  it('should call useLocation and formatDistance when geolocation is off but user set a custom position', () => {
    // eslint-disable-next-line local-rules/independent-mocks
    mockUseGeolocation.mockReturnValue({
      userPosition: null,
      customPosition: position,
      isCustomPosition: true,
    } as ILocationContext)
    useDistance(offerPosition)

    expect(formatDistance).toHaveBeenCalledWith(offerPosition, position)
  })

  it('should return undefined when no offerPosition given', () => {
    // eslint-disable-next-line local-rules/independent-mocks
    mockUseGeolocation.mockReturnValue({
      userPosition: position,
      customPosition: position,
    } as ILocationContext)

    expect(useDistance(undefinedOfferPosition)).toEqual(undefined)
  })

  it('should return undefined when user position and custom position are null', () => {
    // eslint-disable-next-line local-rules/independent-mocks
    mockUseGeolocation.mockReturnValue({
      userPosition: null,
      customPosition: null,
    } as ILocationContext)

    expect(useDistance(offerPosition)).toEqual(undefined)
  })
})
