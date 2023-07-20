import { VenuesModuleParameters } from 'features/home/types'
import { buildVenuesQueryOptions } from 'libs/algolia/fetchAlgolia/buildVenuesQueryOptions'
import { buildHitsPerPage } from 'libs/algolia/fetchAlgolia/utils'
import { env } from 'libs/environment'
import { Position } from 'libs/geolocation'

type Params = {
  paramsList: VenuesModuleParameters[]
  userLocation: Position
}

const attributesToHighlight: string[] = [] // We disable highlighting because we don't need it

export const buildVenuesModulesQueries = ({ paramsList, userLocation }: Params) =>
  paramsList.map((params) => ({
    indexName: env.ALGOLIA_VENUES_INDEX_NAME,
    query: '',
    params: {
      ...buildVenuesQueryOptions(params, userLocation),
      ...buildHitsPerPage(params.hitsPerPage),
      attributesToHighlight,
    },
  }))
