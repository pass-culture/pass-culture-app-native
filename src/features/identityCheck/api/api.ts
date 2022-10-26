import { useNavigation } from '@react-navigation/native'
import { useEffect, useState } from 'react'
import { useMutation, useQuery } from 'react-query'

import { api } from 'api/api'
import { ApiError } from 'api/apiHelpers'
import { MaintenancePageType, ProfileUpdateRequest, ProfileOptionsResponse } from 'api/gen'
import { useNextSubscriptionStep } from 'features/auth/signup/useNextSubscriptionStep'
import { useSubscriptionContext } from 'features/identityCheck/context/SubscriptionContextProvider'
import { SubscriptionState } from 'features/identityCheck/context/types'
import { UseNavigationType } from 'features/navigation/RootNavigator'
import { env, WEBAPP_V2_URL } from 'libs/environment'
import { MutationKeys, QueryKeys } from 'libs/queryKeys'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'

export const REDIRECT_URL_UBBLE = `${WEBAPP_V2_URL}/verification-identite/fin`

export function useIdentificationUrl() {
  const { data: subscription } = useNextSubscriptionStep()
  const [identificationUrl, setIdentificationUrl] = useState<string | undefined>()
  const { navigate } = useNavigation<UseNavigationType>()

  const { mutate: postIdentificationUrl } = useMutation(
    MutationKeys.IDENTIFICATION_URL,
    async () => {
      try {
        const data = await api.postnativev1ubbleIdentification({ redirectUrl: REDIRECT_URL_UBBLE })
        setIdentificationUrl(data.identificationUrl)
      } catch (err) {
        const error = (err as ApiError)?.content.code
        if (error === 'IDCHECK_ALREADY_PROCESSED') {
          navigate('IdentityCheckPending')
        } else {
          const withDMS = subscription?.maintenancePageType === MaintenancePageType['with-dms']
          navigate('IdentityCheckUnavailable', { withDMS })
        }
      }
    }
  )

  useEffect(() => {
    if (identificationUrl) return
    postIdentificationUrl()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return identificationUrl
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

interface MutationOptions {
  onSuccess: () => void
  onError: (error: unknown) => void
}

export function usePostHonorStatement({ onSuccess, onError }: MutationOptions) {
  return useMutation(() => api.postnativev1subscriptionhonorStatement(), {
    onSuccess,
    onError,
  })
}

export function useSendPhoneValidationMutation({ onSuccess, onError }: MutationOptions) {
  return useMutation(
    (phoneNumber: string) => api.postnativev1sendPhoneValidationCode({ phoneNumber }),
    {
      onSuccess,
      onError,
    }
  )
}

export function useValidatePhoneNumberMutation({ onSuccess, onError }: MutationOptions) {
  return useMutation((code: string) => api.postnativev1validatePhoneNumber({ code }), {
    onSuccess,
    onError,
  })
}

export function usePhoneValidationRemainingAttempts() {
  const { data: phoneValidationRemainingAttempts } = useQuery(
    QueryKeys.PHONE_VALIDATION_REMAINING_ATTEMPTS,
    () => api.getnativev1phoneValidationremainingAttempts()
  )
  const isLastAttempt = phoneValidationRemainingAttempts?.remainingAttempts === 1
  return { ...phoneValidationRemainingAttempts, isLastAttempt }
}

const STALE_TIME_PROFILE_OPTIONS = 5 * 60 * 1000

export function useProfileOptionsResponse() {
  return useQuery<ProfileOptionsResponse>(
    QueryKeys.SCHOOL_TYPES,
    () => api.getnativev1subscriptionprofileOptions(),
    { staleTime: STALE_TIME_PROFILE_OPTIONS }
  )
}

export const useProfileOptions = () => {
  const { data } = useProfileOptionsResponse()
  const schoolTypes = data?.school_types
  const activities = data?.activities
  return { schoolTypes, activities }
}

export const logoutFromEduConnectIfAllowed = (logoutUrl: string | undefined) => {
  if (logoutUrl && new RegExp(`^${env.EDUCONNECT_ALLOWED_DOMAIN}`, 'i').test(logoutUrl)) {
    globalThis.window.open(logoutUrl)
  }
}
