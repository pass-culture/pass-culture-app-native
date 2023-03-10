import { AlgoliaVenue } from 'libs/algolia'
import { captureAlgoliaError } from 'libs/algolia/fetchAlgolia/AlgoliaError'
import { client } from 'libs/algolia/fetchAlgolia/clients'
import { env } from 'libs/environment'
import { Venue } from 'libs/venue'

const attributesToHighlight: string[] = [] // We disable highlighting because we don't need it

export const fetchVenues = async (query: string): Promise<Venue[]> => {
  const venuesIndex = client.initIndex(env.ALGOLIA_VENUES_INDEX_NAME)

  try {
    const response = await venuesIndex.search<AlgoliaVenue>(query || '', { attributesToHighlight })
    return response.hits.map(buildSuggestedVenue)
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
