import { OffersPlaylistParameters } from 'features/home/types'
import { BuildLocationParameterParams } from 'libs/algolia/fetchAlgolia/buildAlgoliaParameters/buildLocationParameter'
import { buildOffersModulesQueries } from 'libs/algolia/fetchAlgolia/fetchMultipleOffers/helpers/buildOffersModulesQueries'
import { multipleQueries } from 'libs/algolia/fetchAlgolia/multipleQueries'
import { Offer } from 'shared/offer/types'

type FetchMultipleOffersArgs = {
  paramsList: OffersPlaylistParameters[]
  buildLocationParameterParams: BuildLocationParameterParams
  isUserUnderage: boolean
}

export const fetchOffersModules = async ({
  paramsList,
  buildLocationParameterParams,
  isUserUnderage,
}: FetchMultipleOffersArgs) => {
  const queries = buildOffersModulesQueries({
    paramsList,
    buildLocationParameterParams,
    isUserUnderage,
  })

  return multipleQueries<Offer>(queries)
}
