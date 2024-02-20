import {
  calculateHorizontalDistance,
  calculateVerticalDistance,
  distanceToLatitudeDelta,
  distanceToLongitudeDelta,
} from 'features/venuemap/helpers/calculateDistanceMap'

describe('calculateVerticalDistance', () => {
  it('should return correct vertical distance for positive radius and screen ratio', () => {
    const radiusInMeters = 1000
    const screenRatio = 1.5
    const result = calculateVerticalDistance(radiusInMeters, screenRatio)

    expect(result).toEqual(832.0502943378438)
  })
})

describe('calculateHorizontalDistance', () => {
  it('should return correct horizontal distance for positive radius and screen ratio', () => {
    const radiusInMeters = 1000
    const screenRatio = 1.5
    const result = calculateHorizontalDistance(radiusInMeters, screenRatio)

    expect(result).toEqual(554.7001962252291)
  })
})

describe('distanceToLatitudeDelta', () => {
  it('should return correct latitude delta for positive distance', () => {
    const distanceInMeters = 1000
    const result = distanceToLatitudeDelta(distanceInMeters)

    expect(result).toEqual(0.008983152841195215)
  })
})

describe('distanceToLongitudeDelta', () => {
  it('should return correct longitude delta for positive distance and latitude', () => {
    const distanceInMeters = 1000
    const latitudeInDegrees = 45
    const result = distanceToLongitudeDelta(distanceInMeters, latitudeInDegrees)

    expect(result).toEqual(0.012704096580888674)
  })
})
