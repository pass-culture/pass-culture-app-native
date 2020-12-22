import { getOpenStreetMapUrl } from '../getOpenStreetMapUrl'

describe('parseOpenStreetMapUrl.test.ts', () => {
  it('parses the url according to provided coordinates', () => {
    const lat = 48.85837
    const lng = 2.294481
    expect(getOpenStreetMapUrl({ latitude: lat, longitude: lng })).toBe(
      'https://www.openstreetmap.org/directions?engine=fossgis_osrm_car&route=%3B48.85837%2C2.294481#map=16/48.85837/2.294481'
    )
  })
})
