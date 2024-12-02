import { VenueTypeCodeKey } from 'api/gen'
import { getFilterDescription } from 'features/venueMap/helpers/getFilterDescription/getFilterDescription'

describe('getFilterDescription', () => {
  it('should return "Tout" when all types in the group are selected', () => {
    const description = getFilterDescription('OUTINGS', [
      VenueTypeCodeKey.CONCERT_HALL,
      VenueTypeCodeKey.FESTIVAL,
      VenueTypeCodeKey.GAMES,
      VenueTypeCodeKey.LIBRARY,
      VenueTypeCodeKey.MOVIE,
      VenueTypeCodeKey.MUSEUM,
      VenueTypeCodeKey.PERFORMING_ARTS,
      VenueTypeCodeKey.TRAVELING_CINEMA,
      VenueTypeCodeKey.VISUAL_ARTS,
    ])

    expect(description).toEqual('Tout')
  })

  it('should return a comma-separated list of labels for selected types', () => {
    const description = getFilterDescription('OUTINGS', [
      VenueTypeCodeKey.CONCERT_HALL,
      VenueTypeCodeKey.MOVIE,
    ])

    expect(description).toEqual('Musique - Salle de concerts, Cinéma - Salle de projections')
  })

  it('should return an empty string when no types are selected', () => {
    const description = getFilterDescription('OUTINGS', [])

    expect(description).toBe('')
  })
})
