import { ILocationContext, useLocation } from 'libs/location'
import { useDistance } from 'libs/location/hooks/useDistance'
import { formatDistance } from 'libs/parsers'
import { SuggestedPlace } from 'libs/place'

jest.mock('libs/parsers')

jest.mock('libs/location')
const mockUseGeolocation = jest.mocked(useLocation)

const DEFAULT_POSITION = { latitude: 90, longitude: 90 }
const DEFAULT_PLACE: SuggestedPlace = {
  geolocation: DEFAULT_POSITION,
  label: 'label',
  info: 'info',
}
const OFFER_POSITION = { lat: 31, long: 56 }
const UNDEFINED_OFFER_POSITION = {
  lat: undefined,
  lng: undefined,
}

describe('useDistance()', () => {
  it('should call useLocation and formatDistance when geolocation is on', () => {
    // eslint-disable-next-line local-rules/independent-mocks
    mockUseGeolocation.mockReturnValue({ geolocPosition: DEFAULT_POSITION } as ILocationContext)
    useDistance(OFFER_POSITION)

    expect(formatDistance).toHaveBeenCalledWith(OFFER_POSITION, DEFAULT_POSITION)
  })

  it('should call useLocation and formatDistance when geolocation is off but user set a custom position', () => {
    // eslint-disable-next-line local-rules/independent-mocks
    mockUseGeolocation.mockReturnValue({
      geolocPosition: null,
      place: DEFAULT_PLACE,
    } as ILocationContext)
    useDistance(OFFER_POSITION)

    expect(formatDistance).toHaveBeenCalledWith(OFFER_POSITION, DEFAULT_POSITION)
  })

  it('should return undefined when no offerPosition given', () => {
    // eslint-disable-next-line local-rules/independent-mocks
    mockUseGeolocation.mockReturnValue({
      geolocPosition: DEFAULT_POSITION,
      place: DEFAULT_PLACE,
    } as ILocationContext)

    expect(useDistance(UNDEFINED_OFFER_POSITION)).toEqual(undefined)
  })

  it('should return undefined when user position and custom position are null', () => {
    // eslint-disable-next-line local-rules/independent-mocks
    mockUseGeolocation.mockReturnValue({
      geolocPosition: null,
      place: null,
    } as ILocationContext)

    expect(useDistance(OFFER_POSITION)).toEqual(undefined)
  })
})
