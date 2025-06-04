import { useQuery } from 'react-query'

import { api } from 'api/api'
import { MagicApiResponse } from 'api/gen'
import { QueryKeys } from 'libs/queryKeys'

const STALE_TIME_MAGIC_API = 5 * 60 * 1000

export const useMagicAPI = <TData = MagicApiResponse>(query: string) => {
  return useQuery<MagicApiResponse, Error, TData>(
    [QueryKeys.MAGIC_API],
    () => {
      console.log({ query })
      const response = api.postNativeV1MagicApi({
        query,
      })
      console.log(response)
      return response
    },
    {
      staleTime: STALE_TIME_MAGIC_API,
    }
  )
}
