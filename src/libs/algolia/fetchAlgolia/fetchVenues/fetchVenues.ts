import { Venue } from 'features/venue/types'
import { AlgoliaQueryParameters, AlgoliaVenue, FetchVenuesParameters } from 'libs/algolia'
import { captureAlgoliaError } from 'libs/algolia/fetchAlgolia/AlgoliaError'
import { client } from 'libs/algolia/fetchAlgolia/clients'
import { env } from 'libs/environment'

const attributesToHighlight: string[] = [] // We disable highlighting because we don't need it

export const fetchVenues = async (query: FetchVenuesParameters['query']): Promise<Venue[]> => {
  const venuesIndex = client.initIndex(env.ALGOLIA_VENUES_INDEX_NAME)
  const algoliaSearchParams: AlgoliaQueryParameters = {
    query: query || '',
    requestOptions: { attributesToHighlight },
  }

  try {
    const rawAlgoliaVenuesResponse = await venuesIndex.search<AlgoliaVenue>(
      algoliaSearchParams.query,
      algoliaSearchParams.requestOptions
    )

    const algoliaVenues: AlgoliaVenue[] = rawAlgoliaVenuesResponse.hits
    const adaptedVenues: Venue[] = algoliaVenues.map(buildSuggestedVenue)

    return adaptedVenues
  } catch (error) {
    captureAlgoliaError(error)
    return [] as Venue[]
  }
}

const buildSuggestedVenue = (venue: AlgoliaVenue): Venue => ({
  label: venue.name,
  info: venue.city || venue.offerer_name,
  venueId: parseInt(venue.objectID),
})
