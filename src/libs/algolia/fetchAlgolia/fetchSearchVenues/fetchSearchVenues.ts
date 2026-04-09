import { FetchSearchResultsArgs } from 'features/search/types'
import { captureAlgoliaError } from 'libs/algolia/fetchAlgolia/AlgoliaError'
import { client } from 'libs/algolia/fetchAlgolia/clients'
import { getDefaultSearchResponse } from 'libs/algolia/fetchAlgolia/fetchSearchResults/helpers/getDefaultSearchResponse'
import { buildVenueNotOpenToPublicQuery } from 'libs/algolia/fetchAlgolia/fetchSearchResults/queries/buildVenueNotOpenToPublicQuery'
import { buildVenuesQuery } from 'libs/algolia/fetchAlgolia/fetchSearchResults/queries/buildVenuesQuery'
import { AlgoliaVenue } from 'libs/algolia/types'

export const fetchSearchVenues = async (args: FetchSearchResultsArgs) => {
  const { parameters, buildLocationParameterParams, disabilitiesProperties } = args
  const queries = [
    buildVenuesQuery({ parameters, buildLocationParameterParams, disabilitiesProperties }),
    buildVenueNotOpenToPublicQuery({ query: parameters.query }),
  ]

  try {
    const { results } = await client.searchForHits<AlgoliaVenue>({ requests: queries })
    const [venuesResponse, venueNotOpenToPublic] = results

    return { venuesResponse, venueNotOpenToPublic }
  } catch (error) {
    captureAlgoliaError(error)

    return {
      venuesResponse: getDefaultSearchResponse<AlgoliaVenue>(),
      venueNotOpenToPublic: getDefaultSearchResponse<AlgoliaVenue>(),
    }
  }
}
