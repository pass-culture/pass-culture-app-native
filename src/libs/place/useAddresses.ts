import { useQuery } from 'react-query'

import { useNetwork } from 'libs/network/useNetwork'
import { BuildSearchAddressProps } from 'libs/place/buildUrl'
import { fetchAddresses } from 'libs/place/fetchAddresses'
import { QueryKeys } from 'libs/queryKeys'

export const useAddresses = ({
  query,
  limit,
  cityCode,
  postalCode,
  enabled,
}: BuildSearchAddressProps & { enabled: boolean }) => {
  const { isConnected } = useNetwork()

  return useQuery<string[]>(
    [QueryKeys.ADDRESSES, query, cityCode, postalCode],
    () => fetchAddresses({ query, limit, cityCode, postalCode }),
    { enabled: enabled && isConnected }
  )
}
