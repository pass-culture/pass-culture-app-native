import { useMutation } from 'react-query'

import { api } from 'api/api'
import { ProfileUpdateRequest } from 'api/gen'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { SubscriptionState } from 'features/identityCheck/context/types'
import { resetProfileStores } from 'features/identityCheck/pages/profile/store/resetProfileStores'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'

export function usePostProfile() {
  const { showErrorSnackBar } = useSnackBarContext()
  const { refetchUser } = useAuthContext()

  return useMutation(
    (profile: SubscriptionState['profile']) => {
      const body = getCompleteProfile(profile)
      if (body) {
        return api.postNativeV1SubscriptionProfile(body)
      } else {
        const profileWithMissingFileds = JSON.stringify(profile, (_, value) => value ?? null, 2)
        return Promise.reject(
          new Error(
            `No body was provided for subscription profile. "getCompleteProfile()" return null because: ${profileWithMissingFileds}`
          )
        )
      }
    },
    {
      onSuccess: () => {
        resetProfileStores()
        refetchUser()
      },
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
    profile.city?.name &&
    profile.city?.postalCode &&
    profile.name?.firstName &&
    profile.name?.lastName
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
