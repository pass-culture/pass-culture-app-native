import { useMutation } from '@tanstack/react-query'

import { api } from 'api/api'
import { ProfileUpdateRequest } from 'api/gen'
import { SubscriptionState } from 'features/identityCheck/context/types'

type PostProfileMutationOptions = {
  onSuccess?: () => void
  onError?: (error: unknown) => void
}

export function usePostProfileMutation({ onSuccess, onError }: PostProfileMutationOptions) {
  return useMutation(
    (profile: SubscriptionState['profile']) => {
      const body = getCompleteProfile(profile)
      if (body) {
        return api.postNativeV1SubscriptionProfile(body)
      } else {
        const profileWithMissingFileds = JSON.stringify(profile, (_, value) => value ?? null, 2)
        const errorMessage = `No body was provided for subscription profile. "getCompleteProfile()" return null because: ${profileWithMissingFileds}`
        return Promise.reject(new Error(errorMessage))
      }
    },
    { onSuccess, onError }
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
