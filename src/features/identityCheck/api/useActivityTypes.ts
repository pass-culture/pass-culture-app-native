import { useQuery } from 'react-query'

import { api } from 'api/api'
import { ProfileOptionsResponse } from 'api/gen'
import { QueryKeys } from 'libs/queryKeys'

const STALE_TIME_PROFILE_OPTIONS = 5 * 60 * 1000

function useActivityTypesResponse() {
  return useQuery<ProfileOptionsResponse>(
    [QueryKeys.SCHOOL_TYPES],
    () => api.getnativev1subscriptionprofileOptions(),
    { staleTime: STALE_TIME_PROFILE_OPTIONS }
  )
}

export const useActivityTypes = () => {
  const { data } = useActivityTypesResponse()
  const schoolTypes = data?.school_types
  const activities = data?.activities
  return { schoolTypes, activities }
}
