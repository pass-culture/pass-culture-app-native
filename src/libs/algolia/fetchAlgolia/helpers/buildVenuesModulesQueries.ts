import { VenuesModuleParameters } from 'features/home/types'
import { BuildLocationParameterParams } from 'libs/algolia/fetchAlgolia/buildAlgoliaParameters/buildLocationParameter'
import { buildVenuesQueryOptions } from 'libs/algolia/fetchAlgolia/buildVenuesQueryOptions'
import { buildHitsPerPage } from 'libs/algolia/fetchAlgolia/utils'
import { env } from 'libs/environment/env'

type Params = {
  paramsList: (VenuesModuleParameters & BuildLocationParameterParams)[]
}

const attributesToHighlight: string[] = [] // We disable highlighting because we don't need it

export const buildVenuesModulesQueries = ({ paramsList }: Params) =>
  paramsList.map((params) => ({
    indexName: env.ALGOLIA_VENUES_INDEX_NAME,
    query: '',
    ...buildVenuesQueryOptions(params, {
      userLocation: params.userLocation,
      selectedLocationMode: params.selectedLocationMode,
      aroundMeRadius: params.aroundMeRadius,
      aroundPlaceRadius: params.aroundPlaceRadius,
    }),
    ...buildHitsPerPage(params.hitsPerPage),
    attributesToHighlight,
  }))
