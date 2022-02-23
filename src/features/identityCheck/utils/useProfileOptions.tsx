import { useQuery } from 'react-query'

import { api } from 'api/api'
import { ProfileOptionsResponse } from 'api/gen'
import { QueryKeys } from 'libs/queryKeys'

function useProfileOptionsResponse() {
  return useQuery<ProfileOptionsResponse>(QueryKeys.SCHOOL_TYPES, () =>
    api.getnativev1subscriptionprofileOptions()
  )
}

export const useProfileOptions = () => {
  const { data } = useProfileOptionsResponse()
  const schoolTypes = data?.school_types
  const activities = data?.activities
  return { schoolTypes, activities }
}
