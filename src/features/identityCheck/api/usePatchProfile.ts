import { useMutation } from 'react-query'

import { api } from 'api/api'
import { ProfileUpdateRequest } from 'api/gen'
import { useSubscriptionContext } from 'features/identityCheck/context/SubscriptionContextProvider'
import { SubscriptionState } from 'features/identityCheck/context/types'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'

export function usePatchProfile() {
  const { profile } = useSubscriptionContext()
  const { showErrorSnackBar } = useSnackBarContext()
  return useMutation(
    () => {
      const body = getCompleteProfile(profile)
      return body ? api.postnativev1subscriptionprofile(body) : Promise.reject()
    },
    {
      onError: () =>
        showErrorSnackBar({
          message: 'Une erreur est survenue lors de la mise à jour de ton profil',
          timeout: SNACK_BAR_TIME_OUT,
        }),
    }
  )
}

const getCompleteProfile = (profile: SubscriptionState['profile']): ProfileUpdateRequest | null => {
  if (
    profile.status &&
    profile.address &&
    profile.city &&
    profile.city.name &&
    profile.city.postalCode &&
    profile.name &&
    profile.name.firstName &&
    profile.name.lastName
  ) {
    return {
      activityId: profile.status,
      address: profile.address,
      city: profile.city.name,
      firstName: profile.name.firstName,
      lastName: profile.name.lastName,
      postalCode: profile.city.postalCode,
      schoolTypeId: profile.schoolType,
    }
  }
  return null
}
