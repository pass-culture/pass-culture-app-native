import { useQuery } from 'react-query'

import { api } from 'api/api'
import { SchoolTypesResponse } from 'api/gen'
import { QueryKeys } from 'libs/queryKeys'

const STALE_TIME_SCHOOL_TYPES = 5 * 60 * 1000

export function useSchoolTypesResponse() {
  return useQuery<SchoolTypesResponse>(
    QueryKeys.SCHOOL_TYPES,
    () => api.getnativev1subscriptionschoolTypes(),
    { staleTime: STALE_TIME_SCHOOL_TYPES }
  )
}

export const useSchoolTypes = () => {
  const { data } = useSchoolTypesResponse()
  const schoolTypes = data?.school_types
  const activities = data?.activities
  return { schoolTypes, activities }
}
