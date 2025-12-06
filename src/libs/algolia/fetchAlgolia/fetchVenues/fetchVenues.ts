import { Venue } from 'features/venue/types'
import { captureAlgoliaError } from 'libs/algolia/fetchAlgolia/AlgoliaError'
import { client } from 'libs/algolia/fetchAlgolia/clients'
import { adaptAlgoliaVenues } from 'libs/algolia/fetchAlgolia/fetchVenues/adaptAlgoliaVenues'
import { buildFetchVenuesQueryParameters } from 'libs/algolia/fetchAlgolia/fetchVenues/buildFetchVenuesQueryParameters'
import { adaptGenericAlgoliaTypes } from 'libs/algolia/fetchAlgolia/helpers/adaptGenericAlgoliaTypes'
import { AlgoliaVenue, FetchVenuesParameters } from 'libs/algolia/types'
import { env } from 'libs/environment/env'

export const fetchVenues = async ({
  query,
  attributesToHighlight = [],
  buildLocationParameterParams,
  options,
}: FetchVenuesParameters): Promise<Venue[]> => {
  const algoliaSearchParams = buildFetchVenuesQueryParameters({
    query,
    attributesToHighlight,
    buildLocationParameterParams,
    options,
  })

  try {
    const response = await client.searchForHits<AlgoliaVenue>({
      requests: [
        {
          indexName: env.ALGOLIA_VENUES_INDEX_NAME,
          query: algoliaSearchParams.query,
          ...algoliaSearchParams.requestOptions,
        },
      ],
    })

    const rawAlgoliaVenuesResponse = response.results[0]
    if (!rawAlgoliaVenuesResponse) return []

    const rawVenues = adaptGenericAlgoliaTypes(rawAlgoliaVenuesResponse)

    return adaptAlgoliaVenues(rawVenues)
  } catch (error) {
    captureAlgoliaError(error)
    return [] as Venue[]
  }
}
