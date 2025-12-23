import { Activity } from 'api/gen'
import { getFilterDescription } from 'features/venueMap/helpers/getFilterDescription/getFilterDescription'

describe('getFilterDescription', () => {
  it('should return "Tout" when all types in the group are selected', () => {
    const description = getFilterDescription('OUTINGS', [
      Activity.ART_GALLERY,
      Activity.CINEMA,
      Activity.FESTIVAL,
      Activity.GAMES_CENTRE,
      Activity.LIBRARY,
      Activity.MUSEUM,
      Activity.PERFORMANCE_HALL,
    ])

    expect(description).toEqual('Tout')
  })

  it('should return a comma-separated list of labels for selected types', () => {
    const description = getFilterDescription('OUTINGS', [
      Activity.PERFORMANCE_HALL,
      Activity.CINEMA,
    ])

    expect(description).toEqual('Cinéma - Salle de projections, Musique - Salle de concerts')
  })

  it('should return an empty string when no types are selected', () => {
    const description = getFilterDescription('OUTINGS', [])

    expect(description).toBe('')
  })
})
