import { t } from '@lingui/macro'
import { useNavigation } from '@react-navigation/native'
import { useEffect, useState } from 'react'
import { useMutation } from 'react-query'

import { api } from 'api/api'
import { ApiError } from 'api/apiHelpers'
import { MaintenancePageType, ProfileUpdateRequest } from 'api/gen'
import { useNextSubscriptionStep } from 'features/auth/signup/nextSubscriptionStep'
import { useIdentityCheckContext } from 'features/identityCheck/context/IdentityCheckContextProvider'
import { IdentityCheckState } from 'features/identityCheck/context/types'
import { UseNavigationType } from 'features/navigation/RootNavigator'
import { WEBAPP_V2_URL } from 'libs/environment'
import { MutationKeys } from 'libs/queryKeys'
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
  }, [])

  return identificationUrl
}

const getCompleteProfile = (
  profile: IdentityCheckState['profile']
): ProfileUpdateRequest | null => {
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
  const { profile } = useIdentityCheckContext()
  const { showErrorSnackBar } = useSnackBarContext()
  return useMutation(
    () => {
      const body = getCompleteProfile(profile)
      return body ? api.postnativev1subscriptionprofile(body) : Promise.reject()
    },
    {
      onError: () =>
        showErrorSnackBar({
          message: t`Une erreur est survenue lors de la mise à jour de votre profil`,
          timeout: SNACK_BAR_TIME_OUT,
        }),
    }
  )
}

interface HonorStatementMutationOptions {
  onSuccess: () => void
  onError: (error: unknown) => void
}

export function usePostHonorStatement({ onSuccess, onError }: HonorStatementMutationOptions) {
  return useMutation(() => api.postnativev1subscriptionhonorStatement(), {
    onSuccess,
    onError,
  })
}
