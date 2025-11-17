import { useQuery } from '@tanstack/react-query'

import { BuildSearchAddressProps } from 'libs/place/buildUrl'
import { fetchAddresses } from 'libs/place/fetchAddresses'
import { QueryKeys } from 'libs/queryKeys'

const STALE_TIME_ADDRESSES = 5 * 60 * 1000

export const useAddressesQuery = ({
  query,
  limit,
  cityCode,
  postalCode,
  enabled,
}: BuildSearchAddressProps & { enabled: boolean }) =>
  useQuery({
    queryKey: [QueryKeys.ADDRESSES, query, cityCode, postalCode],
    queryFn: () => fetchAddresses({ query, limit, cityCode, postalCode }),
    staleTime: STALE_TIME_ADDRESSES,
    enabled,
  })
