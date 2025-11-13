import { useQuery } from '@tanstack/react-query'

import { AsyncError, LogTypeEnum } from 'libs/monitoring/errors'
import { QueryKeys } from 'libs/queryKeys'

export const MAX_ASYNC_TEST_REQ_COUNT = 3

export const useErrorAsyncQuery = (
  asyncTestReqCount: number,
  setAsyncTestReqCount: React.Dispatch<React.SetStateAction<number>>
) => {
  async function errorAsync() {
    setAsyncTestReqCount((v) => ++v)
    if (asyncTestReqCount < MAX_ASYNC_TEST_REQ_COUNT) {
      throw new AsyncError('NETWORK_REQUEST_FAILED', {
        retry: query.refetch,
        logType: LogTypeEnum.ERROR,
      })
    }
    return null
  }

  const query = useQuery({
    queryKey: [QueryKeys.ERROR_ASYNC],
    queryFn: () => errorAsync(),
    gcTime: 0,
    enabled: false,
  })

  return query
}
