import { useEffect } from 'react'

import { useSubscriptionContext } from 'features/identityCheck/context/SubscriptionContextProvider'
import { useProfileInfoQuery } from 'features/identityCheck/queries/useProfileInfoQuery'

// Specific for transi 17-18 : In case we already have some profile informations we rehydrate the context
export const useRehydrateProfile = () => {
  const { profileInfo } = useProfileInfoQuery()
  const { dispatch } = useSubscriptionContext()

  useEffect(() => {
    if (profileInfo) {
      dispatch({
        type: 'SET_PROFILE_INFO',
        payload: {
          name: {
            firstName: profileInfo.firstName,
            lastName: profileInfo.lastName,
          },
          address: profileInfo.address,
          city: {
            name: profileInfo.city,
            postalCode: profileInfo.postalCode,
            code: '',
          },
        },
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileInfo])

  return profileInfo
}
