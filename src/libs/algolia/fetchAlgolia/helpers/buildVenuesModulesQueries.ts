import { VenuesModuleParameters } from 'features/home/types'
import { BuildLocationParameterParams } from 'libs/algolia/fetchAlgolia/buildAlgoliaParameters/buildLocationParameter'
import { buildVenuesQueryOptions } from 'libs/algolia/fetchAlgolia/buildVenuesQueryOptions'
import { buildHitsPerPage } from 'libs/algolia/fetchAlgolia/utils'
import { env } from 'libs/environment'

type Params = {
  paramsList: VenuesModuleParameters[]
  buildLocationParameterParams: BuildLocationParameterParams
}

const attributesToHighlight: string[] = [] // We disable highlighting because we don't need it

export const buildVenuesModulesQueries = ({ paramsList, buildLocationParameterParams }: Params) =>
  paramsList.map((params) => ({
    indexName: env.ALGOLIA_VENUES_INDEX_NAME,
    query: '',
    params: {
      ...buildVenuesQueryOptions(params, buildLocationParameterParams),
      ...buildHitsPerPage(params.hitsPerPage),
      attributesToHighlight,
    },
  }))
