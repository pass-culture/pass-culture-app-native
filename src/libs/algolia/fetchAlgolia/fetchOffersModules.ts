import { OffersPlaylistParameters } from 'features/home/types'
import { buildOffersModulesQueries } from 'libs/algolia/fetchAlgolia/fetchMultipleOffers/helpers/buildOffersModulesQueries'
import { multipleQueries } from 'libs/algolia/fetchAlgolia/multipleQueries'
import { Offer } from 'shared/offer/types'

type FetchMultipleOffersArgs = {
  paramsList: OffersPlaylistParameters[]
  isUserUnderage: boolean
}

export const fetchOffersModules = async ({
  paramsList,
  isUserUnderage,
}: FetchMultipleOffersArgs) => {
  const queries = buildOffersModulesQueries({
    paramsList,
    isUserUnderage,
  })

  return multipleQueries<Offer>(queries)
}
