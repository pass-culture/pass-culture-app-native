import { getVenueTags } from 'features/venueMap/helpers/getVenueTags/getVenueTags'

describe('getVenueTags function', () => {
  it('should return an array of venue tags when distance and venue type are provided', () => {
    const result = getVenueTags({ distance: 'à 5 km', venue_type: 'Cinéma' })

    expect(result).toEqual(['à 5 km', 'Cinéma'])
  })

  it('should return an array of venue tags only with venue type when distance is undefined', () => {
    const result = getVenueTags({ distance: undefined, venue_type: 'Cinéma' })

    expect(result).toEqual(['Cinéma'])
  })

  it('should return an array of venue tags only with distance when venue type is undefined', () => {
    const result = getVenueTags({ distance: 'à 5 km', venue_type: undefined })

    expect(result).toEqual(['à 5 km'])
  })

  it('should return an empty array when both distance and venue type are undefined', () => {
    const result = getVenueTags({ distance: undefined, venue_type: undefined })

    expect(result).toEqual([])
  })
})
