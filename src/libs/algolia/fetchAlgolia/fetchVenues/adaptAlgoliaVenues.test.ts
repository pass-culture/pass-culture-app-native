import { adaptAlgoliaVenues } from 'libs/algolia/fetchAlgolia/fetchVenues/adaptAlgoliaVenues'
import { algoliaVenuesFixture } from 'libs/algolia/fetchAlgolia/fetchVenues/fixtures/AlgoliaVenuesFixture'
import { venuesFixture } from 'libs/algolia/fetchAlgolia/fetchVenues/fixtures/venuesFixture'

describe('adaptAlgoliaVenues', () => {
  it('should adapt AlgoliaVenues into Venues', () => {
    const expectedVenues = venuesFixture

    const adaptedVenues = adaptAlgoliaVenues(algoliaVenuesFixture)

    expect(adaptedVenues).toEqual(expectedVenues)
  })
})
