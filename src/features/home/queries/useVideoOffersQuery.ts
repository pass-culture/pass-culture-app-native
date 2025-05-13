import { useEffect } from 'react'
import { useQuery } from 'react-query'

import { OffersModuleParameters } from 'features/home/types'
import { useIsUserUnderage } from 'features/profile/helpers/useIsUserUnderage'
import { fetchMultipleOffers } from 'libs/algolia/fetchAlgolia/fetchMultipleOffers/fetchMultipleOffers'
import { useAdaptOffersPlaylistParameters } from 'libs/algolia/fetchAlgolia/fetchMultipleOffers/helpers/useAdaptOffersPlaylistParameters'
import { fetchOffersByEan } from 'libs/algolia/fetchAlgolia/fetchOffersByEan'
import { fetchOffersByIds } from 'libs/algolia/fetchAlgolia/fetchOffersByIds'
import { useTransformOfferHits } from 'libs/algolia/fetchAlgolia/transformOfferHit'
import { SearchQueryParameters } from 'libs/algolia/types'
import { useLocation } from 'libs/location/LocationWrapper'
import { QueryKeys } from 'libs/queryKeys'
import { Offer } from 'shared/offer/types'

const MAX_NUMBER_OF_OFFERS = 20

const isSearchQueryParameters = (parameter: unknown): parameter is SearchQueryParameters =>
  typeof parameter === 'object' && parameter !== null

export const useVideoOffersQuery = (
  offersModuleParameters: OffersModuleParameters[],
  id: string,
  offerIds?: string[],
  eanList?: string[]
) => {
  const adaptPlaylistParameters = useAdaptOffersPlaylistParameters()
  const { userLocation } = useLocation()
  const isUserUnderage = useIsUserUnderage()
  const transformHits = useTransformOfferHits()

  const adaptedPlaylistParameters = offersModuleParameters
    .map(adaptPlaylistParameters)
    .filter(isSearchQueryParameters)

  const { data, refetch } = useQuery({
    queryKey: [QueryKeys.VIDEO_OFFER, id],
    queryFn: async () => {
      if (offerIds && offerIds?.length > 0) {
        return fetchOffersByIds({
          objectIds: offerIds,
          isUserUnderage,
        })
      }

      if (eanList && eanList?.length > 0) {
        return fetchOffersByEan({
          eanList,
          userLocation,
          isUserUnderage,
        })
      }

      return (
        await fetchMultipleOffers({
          paramsList: adaptedPlaylistParameters,
          isUserUnderage,
        })
      ).flatMap((data) => data.hits)
    },
  })

  useEffect(() => {
    // When we enable or disable the geolocation, we want to refetch the home modules
    refetch().catch(() => {
      return
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userLocation?.latitude, userLocation?.longitude])

  const hits = (data?.map(transformHits) as Offer[]) ?? []

  return { offers: hits.slice(0, MAX_NUMBER_OF_OFFERS) }
}
