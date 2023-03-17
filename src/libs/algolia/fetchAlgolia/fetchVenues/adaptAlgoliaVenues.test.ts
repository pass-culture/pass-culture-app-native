import { Venue } from 'features/venue/types'
import { adaptAlgoliaVenues } from 'libs/algolia/fetchAlgolia/fetchVenues/adaptAlgoliaVenues'
import { algoliaVenuesFixture } from 'libs/algolia/fetchAlgolia/fetchVenues/fixtures/AlgoliaVenuesFixture'

describe('adaptAlgoliaVenues', () => {
  it('should adapt AlgoliaVenues into Venues', () => {
    const expectedVenues: Venue[] = [
      { label: 'Cinéma de la fin', info: 'Paris', venueId: 4197 },
      { label: 'La librairie quantique', info: 'Syndicat des librairies physiques', venueId: 4192 },
    ]
    const adaptedVenues = adaptAlgoliaVenues(algoliaVenuesFixture)
    expect(adaptedVenues).toEqual(expectedVenues)
  })
})
