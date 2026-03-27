import { DisabilitiesProperties } from 'features/accessibility/types'
import { BuildLocationParameterParams } from 'libs/algolia/fetchAlgolia/buildAlgoliaParameters/buildLocationParameter'
import { buildOfferSearchParameters } from 'libs/algolia/fetchAlgolia/buildAlgoliaParameters/buildOfferSearchParameters'
import { offerAttributesToRetrieve } from 'libs/algolia/fetchAlgolia/buildAlgoliaParameters/offerAttributesToRetrieve'
import { buildHitsPerPage } from 'libs/algolia/fetchAlgolia/utils'
import { SearchQueryParameters } from 'libs/algolia/types'
import { env } from 'libs/environment/env'
import { CustomRemoteConfig } from 'libs/firebase/remoteConfig/remoteConfig.types'

export type BuildOffersQueryArgs = {
  parameters: SearchQueryParameters
  buildLocationParameterParams: BuildLocationParameterParams
  isUserUnderage: boolean
  disabilitiesProperties: DisabilitiesProperties
  aroundPrecision?: CustomRemoteConfig['aroundPrecision']
}

export const buildOffersQueryBase = ({
  parameters,
  buildLocationParameterParams,
  isUserUnderage,
  disabilitiesProperties,
  aroundPrecision,
}: BuildOffersQueryArgs) => ({
  indexName: env.ALGOLIA_OFFERS_INDEX_NAME,
  query: parameters.query || '',
  page: parameters.page || 0,
  ...buildOfferSearchParameters(
    parameters,
    buildLocationParameterParams,
    isUserUnderage,
    disabilitiesProperties,
    true
  ),
  attributesToRetrieve: offerAttributesToRetrieve,
  attributesToHighlight: [],
  ...buildHitsPerPage(parameters.hitsPerPage),
  ...(aroundPrecision && { aroundPrecision }),
  clickAnalytics: true,
  analytics: true,
})
