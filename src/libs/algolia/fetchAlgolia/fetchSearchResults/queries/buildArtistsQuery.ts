import { DisabilitiesProperties } from 'features/accessibility/types'
import { BuildLocationParameterParams } from 'libs/algolia/fetchAlgolia/buildAlgoliaParameters/buildLocationParameter'
import { buildOfferSearchParameters } from 'libs/algolia/fetchAlgolia/buildAlgoliaParameters/buildOfferSearchParameters'
import { buildHitsPerPage } from 'libs/algolia/fetchAlgolia/utils'
import { SearchQueryParameters } from 'libs/algolia/types'
import { env } from 'libs/environment/env'

type BuildArtistsQueryArgs = {
  parameters: SearchQueryParameters
  buildLocationParameterParams: BuildLocationParameterParams
  isUserUnderage: boolean
  disabilitiesProperties: DisabilitiesProperties
}

export const buildArtistsQuery = ({
  parameters,
  buildLocationParameterParams,
  isUserUnderage,
  disabilitiesProperties,
}: BuildArtistsQueryArgs) => ({
  indexName: env.ALGOLIA_OFFERS_INDEX_NAME,
  query: '',
  ...buildOfferSearchParameters(
    { ...parameters, artistName: parameters.query },
    buildLocationParameterParams,
    isUserUnderage,
    disabilitiesProperties,
    true
  ),
  attributesToRetrieve: ['artists'],
  ...buildHitsPerPage(100),
})
