import { buildVenuesQueryOptions } from 'libs/algolia/fetchAlgolia/buildVenuesQueryOptions'
import { AlgoliaVenuesModuleParameters } from 'libs/algolia/fetchAlgolia/fetchVenuesModules'
import { buildHitsPerPage } from 'libs/algolia/fetchAlgolia/utils'
import { AlgoliaLocationFilter } from 'libs/algolia/types'
import { env } from 'libs/environment'

const attributesToHighlight: string[] = [] // We disable highlighting because we don't need it

export const buildVenuesModulesQueries = (
  paramsList: AlgoliaVenuesModuleParameters[],
  locationFilter: AlgoliaLocationFilter
) =>
  paramsList.map((params) => ({
    indexName: env.ALGOLIA_VENUES_INDEX_NAME,
    query: '',
    params: {
      ...buildVenuesQueryOptions({ ...params, locationFilter }),
      ...buildHitsPerPage(params.hitsPerPage),
      attributesToHighlight,
    },
  }))
