import { useQuery } from 'react-query'

import { fetchOffersByGTL } from 'libs/algolia/fetchAlgolia/fetchOffersByGTL'
import { fetchOffersByGTLArgs } from 'libs/algolia/types'
import { QueryKeys } from 'libs/queryKeys'

const STALE_TIME_OFFERS_BY_GTL = 5 * 60 * 1000

export const useGetOffersByGtlQuery = (args: fetchOffersByGTLArgs) => {
  return useQuery([QueryKeys.OFFERS_BY_GTL], () => fetchOffersByGTL(args), {
    staleTime: STALE_TIME_OFFERS_BY_GTL,
  })
}
