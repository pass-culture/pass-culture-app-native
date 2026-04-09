import { DisabilitiesProperties } from 'features/accessibility/types'
import { BuildLocationParameterParams } from 'libs/algolia/fetchAlgolia/buildAlgoliaParameters/buildLocationParameter'
import { buildVenueSearchParameters } from 'libs/algolia/fetchAlgolia/buildAlgoliaParameters/buildVenueSearchParameters/buildVenueSearchParameters'
import { getSearchVenueQuery } from 'libs/algolia/fetchAlgolia/fetchSearchResults/helpers/getSearchVenueQuery'
import { getCurrentVenuesIndex } from 'libs/algolia/fetchAlgolia/helpers/getCurrentVenuesIndex'
import { buildHitsPerPage } from 'libs/algolia/fetchAlgolia/utils'
import { SearchQueryParameters } from 'libs/algolia/types'

type BuildVenuesQueryArgs = {
  parameters: SearchQueryParameters
  buildLocationParameterParams: BuildLocationParameterParams
  disabilitiesProperties: DisabilitiesProperties
}

export const buildVenuesQuery = ({
  parameters,
  buildLocationParameterParams,
  disabilitiesProperties,
}: BuildVenuesQueryArgs) => {
  const currentVenuesIndex = getCurrentVenuesIndex({
    selectedLocationMode: buildLocationParameterParams.selectedLocationMode,
    geolocPosition: buildLocationParameterParams.geolocPosition,
  })

  return {
    indexName: currentVenuesIndex,
    query: getSearchVenueQuery(parameters),
    page: 0,
    ...buildHitsPerPage(35),
    ...buildVenueSearchParameters(
      buildLocationParameterParams,
      disabilitiesProperties,
      parameters.venue
    ),
    clickAnalytics: true,
  }
}
