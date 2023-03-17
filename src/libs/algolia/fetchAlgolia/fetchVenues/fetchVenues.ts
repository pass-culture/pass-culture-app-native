import { Venue } from 'features/venue/types'
import { AlgoliaVenue, FetchVenuesParameters } from 'libs/algolia'
import { captureAlgoliaError } from 'libs/algolia/fetchAlgolia/AlgoliaError'
import { client } from 'libs/algolia/fetchAlgolia/clients'
import { adaptAlgoliaVenues } from 'libs/algolia/fetchAlgolia/fetchVenues/adaptAlgoliaVenues'
import { buildFetchVenuesQueryParameters } from 'libs/algolia/fetchAlgolia/fetchVenues/buildFetchVenuesQueryParameters'
import { adaptGenericAlgoliaTypes } from 'libs/algolia/fetchAlgolia/helpers/adaptGenericAlgoliaTypes'
import { env } from 'libs/environment'

export const fetchVenues = async ({
  query,
  attributesToHighlight = [],
}: FetchVenuesParameters): Promise<Venue[]> => {
  const venuesIndex = client.initIndex(env.ALGOLIA_VENUES_INDEX_NAME)
  const algoliaSearchParams = buildFetchVenuesQueryParameters({
    query,
    attributesToHighlight,
  })

  try {
    const rawAlgoliaVenuesResponse = await venuesIndex.search<AlgoliaVenue>(
      algoliaSearchParams.query,
      algoliaSearchParams.requestOptions
    )

    const rawVenues = adaptGenericAlgoliaTypes(rawAlgoliaVenuesResponse)
    const adaptedVenues = adaptAlgoliaVenues(rawVenues)

    return adaptedVenues
  } catch (error) {
    captureAlgoliaError(error)
    return [] as Venue[]
  }
}
