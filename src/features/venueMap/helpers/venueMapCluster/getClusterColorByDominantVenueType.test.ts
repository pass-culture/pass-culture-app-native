import { VenueTypeCodeKey } from 'api/gen'
import { VenueTypeCode } from 'libs/parsers/venueType'

import { getClusterColorByDominantVenueType } from './getClusterColorByDominantVenueType'

describe('getClusterColorByDominantVenueType', () => {
  it('should return the color upon venue type occurences (orange)', () => {
    const types: VenueTypeCode[] = [
      VenueTypeCodeKey.GAMES,
      VenueTypeCodeKey.VISUAL_ARTS,
      VenueTypeCodeKey.LIBRARY,
      VenueTypeCodeKey.OTHER,
    ]

    expect(getClusterColorByDominantVenueType(types)).toBe('orange')
  })

  it('should return the color upon venue type occurences (blue)', () => {
    const types: VenueTypeCode[] = [
      VenueTypeCodeKey.GAMES,
      VenueTypeCodeKey.PATRIMONY_TOURISM,
      VenueTypeCodeKey.DISTRIBUTION_STORE,
      VenueTypeCodeKey.OTHER,
    ]

    expect(getClusterColorByDominantVenueType(types)).toBe('blue')
  })

  it('should return the color upon venue type occurences (pink)', () => {
    const types: VenueTypeCode[] = [
      VenueTypeCodeKey.GAMES,
      VenueTypeCodeKey.BOOKSTORE,
      VenueTypeCodeKey.CREATIVE_ARTS_STORE,
      VenueTypeCodeKey.CULTURAL_CENTRE,
    ]

    expect(getClusterColorByDominantVenueType(types)).toBe('pink')
  })

  it('should return the color with higher priority (pink)', () => {
    const types: VenueTypeCode[] = [
      VenueTypeCodeKey.GAMES,
      VenueTypeCodeKey.BOOKSTORE,
      VenueTypeCodeKey.OTHER,
    ]

    expect(getClusterColorByDominantVenueType(types)).toBe('pink')
  })

  it('should return the color with higher priority (blue)', () => {
    const types: VenueTypeCode[] = [VenueTypeCodeKey.GAMES, VenueTypeCodeKey.OTHER]

    expect(getClusterColorByDominantVenueType(types)).toBe('blue')
  })
})
