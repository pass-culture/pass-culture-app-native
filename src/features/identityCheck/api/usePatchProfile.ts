import { useMutation } from 'react-query'

import { api } from 'api/api'
import { ProfileUpdateRequest } from 'api/gen'
import { SubscriptionState } from 'features/identityCheck/context/types'
import { storage } from 'libs/storage'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'

export function usePatchProfile() {
  const { showErrorSnackBar } = useSnackBarContext()

  return useMutation(
    (profile: SubscriptionState['profile']) => {
      const body = getCompleteProfile(profile)
      if (body) {
        return api.postNativeV1SubscriptionProfile(body)
      } else {
        return Promise.reject(new Error('No body was provided for subscription profile'))
      }
    },
    {
      onSuccess: async () => {
        await storage.clear('activation_profile')
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
