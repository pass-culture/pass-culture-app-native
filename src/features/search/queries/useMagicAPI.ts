import { useQuery } from 'react-query'

import { api } from 'api/api'
import { MagicApiResponse } from 'api/gen'
import { QueryKeys } from 'libs/queryKeys'

const STALE_TIME_MAGIC_API = 5 * 60 * 1000

export const useMagicAPI = <TData = MagicApiResponse>() => {
  return useQuery<MagicApiResponse, Error, TData>(
    [QueryKeys.MAGIC_API],
    () => {
      const response = api.postNativeV1MagicApi({
        query: 'Concert de Rap pour ce weekend à Marseille',
      })
      console.log(response)
      return response
    },
    {
      staleTime: STALE_TIME_MAGIC_API,
    }
  )
}
