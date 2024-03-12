import { isGeolocValid } from 'features/venuemap/helpers/isGeolocValid'

describe('isGeolocValid', () => {
  it('should validate geoloc when coordinates are decimal', () => {
    expect(isGeolocValid({ lat: 48.890155, lng: 2.362414 })).toBe(true)
  })

  it('should invalidate geoloc when longitude is undefined', () => {
    expect(isGeolocValid({ lat: 48.890155 })).toBe(false)
  })

  it('should invalidate geoloc when longitude is an integer', () => {
    expect(isGeolocValid({ lat: 48.890155, lng: 2 })).toBe(false)
  })

  it('should invalidate geoloc when latitude is undefined', () => {
    expect(isGeolocValid({ lng: 2.362414 })).toBe(false)
  })

  it('should invalidate geoloc when latitude is an integer', () => {
    expect(isGeolocValid({ lat: 48, lng: 2.362414 })).toBe(false)
  })
})
