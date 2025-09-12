import { useQuery } from '@tanstack/react-query'

import { api } from 'api/api'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { QueryKeys } from 'libs/queryKeys'

export const useEmailUpdateStatus = () => {
  const { isLoggedIn } = useAuthContext()

  return useQuery({
    queryKey: [QueryKeys.EMAIL_UPDATE_STATUS_V2],
    queryFn: () => api.getNativeV2ProfileEmailUpdateStatus(),
    enabled: isLoggedIn,
  })
}
