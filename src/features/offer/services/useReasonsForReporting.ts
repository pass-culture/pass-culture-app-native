import { useQuery } from 'react-query'

import { api } from 'api/api'
import { QueryKeys } from 'libs/queryKeys'

export const useReasonsForReporting = () => {
  return useQuery(QueryKeys.REPORT_OFFER_REASONS, () => api.getnativev1offerreportreasons())
}
