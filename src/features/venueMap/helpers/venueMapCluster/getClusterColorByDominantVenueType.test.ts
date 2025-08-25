import { VenueTypeCodeKey } from 'api/gen'

import { getClusterColorByDominantVenueType } from './getClusterColorByDominantVenueType'

describe('getClusterColorByDominantVenueType', () => {
  it('should return the color upon venue type occurences (orange)', () => {
    const types: VenueTypeCodeKey[] = [
      VenueTypeCodeKey.GAMES,
      VenueTypeCodeKey.VISUAL_ARTS,
      VenueTypeCodeKey.LIBRARY,
    ]

    expect(getClusterColorByDominantVenueType(types)).toBe('orange')
  })

  it('should return the color upon venue type occurences (blue_orange)', () => {
    const types: VenueTypeCodeKey[] = [
      VenueTypeCodeKey.GAMES,
      VenueTypeCodeKey.VISUAL_ARTS,
      VenueTypeCodeKey.LIBRARY,
      VenueTypeCodeKey.OTHER,
    ]

    expect(getClusterColorByDominantVenueType(types)).toBe('blue_orange')
  })

  it('should return the color upon venue type occurences (blue)', () => {
    const types: VenueTypeCodeKey[] = [
      VenueTypeCodeKey.PATRIMONY_TOURISM,
      VenueTypeCodeKey.CULTURAL_CENTRE,
      VenueTypeCodeKey.OTHER,
    ]

    expect(getClusterColorByDominantVenueType(types)).toBe('blue')
  })

  it('should return the color upon venue type occurences (pink)', () => {
    const types: VenueTypeCodeKey[] = [
      VenueTypeCodeKey.BOOKSTORE,
      VenueTypeCodeKey.CREATIVE_ARTS_STORE,
      VenueTypeCodeKey.DISTRIBUTION_STORE,
    ]

    expect(getClusterColorByDominantVenueType(types)).toBe('pink')
  })

  it('should return the color upon venue type occurences (orange_pink)', () => {
    const types: VenueTypeCodeKey[] = [
      VenueTypeCodeKey.GAMES,
      VenueTypeCodeKey.BOOKSTORE,
      VenueTypeCodeKey.CREATIVE_ARTS_STORE,
      VenueTypeCodeKey.DISTRIBUTION_STORE,
    ]

    expect(getClusterColorByDominantVenueType(types)).toBe('orange_pink')
  })

  it('should return the color with higher priority (blue_orange_pink)', () => {
    const types: VenueTypeCodeKey[] = [
      VenueTypeCodeKey.GAMES,
      VenueTypeCodeKey.BOOKSTORE,
      VenueTypeCodeKey.OTHER,
    ]

    expect(getClusterColorByDominantVenueType(types)).toBe('blue_orange_pink')
  })

  it('should return the color with higher priority (blue_pink)', () => {
    const types: VenueTypeCodeKey[] = [VenueTypeCodeKey.BOOKSTORE, VenueTypeCodeKey.OTHER]

    expect(getClusterColorByDominantVenueType(types)).toBe('blue_pink')
  })
})
