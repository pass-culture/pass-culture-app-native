import { useQuery } from 'react-query'

import { api } from 'api/api'
import { GetAvailableReactionsResponse } from 'api/gen'
import { QueryKeys } from 'libs/queryKeys'

export const useAvailableReaction = () => {
  return useQuery<GetAvailableReactionsResponse>([QueryKeys.AVAILABLE_REACTION], () =>
    api.getNativeV1ReactionAvailable()
  )
}
