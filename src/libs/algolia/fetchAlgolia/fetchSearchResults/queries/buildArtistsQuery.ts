import { DisabilitiesProperties } from 'features/accessibility/types'
import { BuildLocationParameterParams } from 'libs/algolia/fetchAlgolia/buildAlgoliaParameters/buildLocationParameter'
import { buildHitsPerPage } from 'libs/algolia/fetchAlgolia/utils'
import { SearchQueryParameters } from 'libs/algolia/types'
import { env } from 'libs/environment/env'

type BuildArtistsQueryArgs = {
  parameters: SearchQueryParameters
  buildLocationParameterParams: BuildLocationParameterParams
  isUserUnderage: boolean
  disabilitiesProperties: DisabilitiesProperties
}

export const buildArtistsQuery = ({ parameters }: BuildArtistsQueryArgs) => ({
  indexName: env.ALGOLIA_ARTISTS_INDEX_NAME,
  query: '',
  ...(parameters.query ? { facetFilters: [[`name:${parameters.query}`]] } : []),
  ...buildHitsPerPage(100),
})
