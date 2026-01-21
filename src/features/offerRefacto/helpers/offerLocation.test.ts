import { offerResponseSnap } from 'features/offer/fixtures/offerResponse'
import { determineLocation, getRoundedPosition } from 'features/offerRefacto/helpers'

describe('getRoundedPosition', () => {
  it('should return undefined if latitude is undefined', () => {
    const result = getRoundedPosition(undefined, 2)

    expect(result).toEqual(undefined)
  })

  it('should return undefined if longitude is undefined', () => {
    const result = getRoundedPosition(1, undefined)

    expect(result).toEqual(undefined)
  })

  it('should return rounded position if both latitude and longitude are defined', () => {
    const result = getRoundedPosition(48.856613, 2.352222)

    expect(result).toEqual({
      latitude: 48.857,
      longitude: 2.352,
    })
  })
})

describe('determineLocation', () => {
  it('should return user location when defined', () => {
    const userLocation = { latitude: 10, longitude: 20 }
    const result = determineLocation(userLocation, offerResponseSnap)

    expect(result).toEqual({ latitude: 10, longitude: 20 })
  })

  it('should return offer venue location when defined and user location not defined', () => {
    const result = determineLocation(undefined, offerResponseSnap)

    expect(result).toEqual(offerResponseSnap.venue.coordinates)
  })

  it('should return (0,0) when neither user location nor offer venue location are defined', () => {
    const offerWithoutCoordinates = {
      ...offerResponseSnap,
      venue: {
        ...offerResponseSnap.venue,
        coordinates: { latitude: undefined, longitude: undefined },
      },
    }
    const result = determineLocation(undefined, offerWithoutCoordinates)

    expect(result).toEqual({ latitude: 0, longitude: 0 })
  })
})
