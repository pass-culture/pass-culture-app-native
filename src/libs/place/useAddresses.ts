import { useQuery } from 'react-query'

import { AddressProps, fetchAddresses } from 'libs/place/fetchAddresses'
import { QueryKeys } from 'libs/queryKeys'

const STALE_TIME_ADDRESSES = 5 * 60 * 1000

export const useAddresses = ({ query, cityCode, postalCode }: AddressProps) =>
  useQuery(AddressesQueryKeys, () => fetchAddresses({ query, cityCode, postalCode }), {
    staleTime: STALE_TIME_ADDRESSES,
    cacheTime: 0,
    enabled: false,
  })

const AddressesQueryKeys: QueryKeys[] = [
  QueryKeys.ADDRESSES,
  QueryKeys.CITY_CODE,
  QueryKeys.POSTAL_CODE,
]
